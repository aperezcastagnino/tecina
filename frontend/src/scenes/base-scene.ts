import { Scene, GameObjects } from "phaser";
import { loadLevelData } from "utils/data-util";
import { Controls } from "common/controls";
import { Player } from "common/player";
import { Dialog } from "common-ui/dialog";
import { DialogWithOptions } from "common-ui/dialog-with-options";
import { MapRenderer } from "common/map/map-renderer";
import type { MapConfiguration, MapStructure } from "types/map";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  MIN_PARTITION_SIZE,
  MIN_ROOM_SIZE,
  TILE_SIZE,
} from "config/config";
import { MapGenerator } from "common/map/map-generator";
import { Awards } from "common-ui/awards";
import { AssetKeys } from "assets/asset-keys";
import { HealthBar } from "common-ui/health-bar";
import { DIRECTION } from "common/player-keys";
import { SceneKeys } from "./scene-keys";

type MapMinimalConfiguration = Pick<MapConfiguration, "tilesConfig"> &
  Partial<Omit<MapConfiguration, "tilesConfig">>;

export abstract class BaseScene extends Scene {
  protected map!: MapStructure;

  protected player!: Player;

  protected controls!: Controls;

  protected dialog!: Dialog;

  protected dialogWithOptions?: DialogWithOptions;

  protected healthBar!: HealthBar;

  protected awards!: Awards;

  protected heldItem?: Phaser.GameObjects.Sprite;

  protected remainingQuestItems = 0;

  // =========================================================================
  // Abstract Methods
  // =========================================================================

  protected abstract createAnimations(): void;

  // =========================================================================
  // Lifecycle Methods
  // =========================================================================

  protected async preload(config: MapMinimalConfiguration): Promise<void> {
    try {
      this.map = MapGenerator.create(this.validateMapConfig(config));
      this.createAnimations();
    } catch (error) {
      console.error("Failed to initialize scene:", error);
    }
  }

  protected async create(): Promise<void> {
    try {
      await this.initializeScene();
    } catch (error) {
      console.error("Failed to create scene:", error);
    }
  }

  update(): void {
    if (this.controls.wasSpaceKeyPressed()) {
      this.handlePlayerInteraction();
      return;
    }

    const directionSelected = this.controls.getDirectionKeyPressed();
    this.player.move(directionSelected);

    if (this.heldItem) {
      this.heldItem.setPosition(this.player.x, this.player.y);
    }
  }

  // =========================================================================
  // Public Methods
  // =========================================================================

  showElements(groupName: string): void {
    const group = this.map.assetGroups.get(groupName);
    this.setElementsVisibility(group!, true);
  }

  hideElements(groupName: string): void {
    const group = this.map.assetGroups.get(groupName);
    this.setElementsVisibility(group!, false);
  }

  makeItemDraggable(groupName: string): void {
    this.physics.add.collider(
      this.player,
      this.map.assetGroups.get(groupName)!,
      (_player, element) => {
        this.pickupItem(element as Phaser.GameObjects.Sprite);
      },
    );
  }

  // =========================================================================
  // Protected Methods
  // =========================================================================

  // Obstacles or interactive static objects
  protected setupCollisions(): void {
    const collisionGroups = [
      AssetKeys.TILES.TREE,
      AssetKeys.CHARACTERS.NPC,
    ].map((key) => this.map.assetGroups.get(key)!);

    collisionGroups.forEach((group) => {
      this.physics.add.collider(this.player, group);
    });
  }

  // =========================================================================
  // Private Methods
  // =========================================================================

  private async initializeScene(): Promise<void> {
    MapRenderer.render(this, this.map);

    await Promise.all([
      this.initializePlayer(),
      this.initializeUI(),
      this.initializeCamera(),
    ]);

    this.setupCollisions();
  }

  private initializePlayer(): void {
    const startPosition = {
      x: TILE_SIZE + this.map.startPosition.x * TILE_SIZE,
      y: TILE_SIZE + this.map.startPosition.y * TILE_SIZE,
    };

    this.player = new Player({
      scene: this,
      position: startPosition,
      velocity: 700,
    });

    this.controls = new Controls(this);
  }

  private initializeUI(): void {
    this.initializeDialogs();
    this.initializeHealthBar();
    this.initializeAwards();
  }

  private initializeCamera(): void {
    const worldWidth = MAP_WIDTH * TILE_SIZE;
    const worldHeight = MAP_HEIGHT * TILE_SIZE;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    this.player.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight, true);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  private initializeDialogs(): void {
    const levelData = loadLevelData(this, this.scene.key.toLowerCase());

    this.dialog = new Dialog({ scene: this, data: levelData.dialogs });
    this.dialogWithOptions = new DialogWithOptions({
      scene: this,
      data: levelData.dialogs,
      callback: (optionSelected: string) => {
        console.log("Option selected: ", optionSelected);
      },
    });
  }

  private initializeHealthBar(): void {
    this.healthBar = new HealthBar(this);
  }

  private initializeAwards(): void {
    this.awards = new Awards({
      scene: this,
      assetKey: AssetKeys.ITEMS.FRUITS.ORANGE.ASSET_KEY,
      spriteConfig: {
        startFrame: AssetKeys.ITEMS.FRUITS.ORANGE.STAR_FRAME,
        endFrame: AssetKeys.ITEMS.FRUITS.ORANGE.END_FRAME,
        frameWidth: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_WIDTH,
        frameHeight: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_HEIGHT,
      },
    });
  }

  private pickupItem(item: Phaser.GameObjects.Sprite): void {
    if (item.visible && !this.heldItem) {
      this.heldItem = item;
      this.children.bringToTop(this.heldItem);
      if (item.body) {
        const body = item.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = true;
      }
    }
  }

  private handlePlayerInteraction(): void {
    if (this.dialog?.isVisible) {
      this.dialog.showNextMessage();
      return;
    }

    this.interactWithNearNPC();

    if (this.heldItem) {
      this.tryDropHeldItem();
    }
  }

  private tryDropHeldItem() {
    const playerDirection = this.player.direction;
    let dropX = 0;
    let dropY = 0;
    switch (playerDirection) {
      case DIRECTION.UP:
        dropX = this.player.x;
        dropY = this.player.y - TILE_SIZE;
        break;
      case DIRECTION.DOWN:
        dropX = this.player.x;
        dropY = this.player.y + TILE_SIZE;
        break;
      case DIRECTION.LEFT:
        dropX = this.player.x - TILE_SIZE;
        dropY = this.player.y;
        break;
      case DIRECTION.RIGHT:
        dropX = this.player.x + TILE_SIZE;
        dropY = this.player.y;
        break;
      default:
        console.error(`Unexpected player direction: ${playerDirection}`);
        dropX = this.player.x;
        dropY = this.player.y;
    }

    const canDrop =
      this.physics
        .overlapRect(dropX, dropY, TILE_SIZE, TILE_SIZE, true, true)
        .filter(
          (ol) =>
            ol.gameObject instanceof GameObjects.Image &&
            (ol.gameObject.texture.key !== AssetKeys.TILES.TREE ||
              ol.gameObject.texture.key !== AssetKeys.CHARACTERS.NPC),
        ).length === 0;

    if (canDrop) {
      this.heldItem!.setPosition(dropX, dropY);

      if (this.heldItem!.body) {
        const body = this.heldItem!.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = false;
        body.updateFromGameObject();
      }
      this.heldItem = undefined;
    }
  }

  private interactWithNearNPC(): void {
    this.map.assetGroups
      .get(AssetKeys.CHARACTERS.NPC)!
      .getChildren()
      .forEach((npc) => {
        const npcSprite = npc as Phaser.GameObjects.Sprite;
        const distance = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          npcSprite.x,
          npcSprite.y,
        );

        if (distance <= 70) {
          this.handleInteractionNPC(npcSprite);
        }
      });
  }

  private handleInteractionNPC(npc: Phaser.GameObjects.Sprite): void {
    if (!this.dialog?.isDialogActive()) {
      this.startDialogWithNPC(npc);
      return;
    }

    if (this.heldItem) {
      this.handleItemInteraction(npc);
    } else {
      this.dialog?.show(npc.name);
    }
  }

  private startDialogWithNPC(npc: Phaser.GameObjects.Sprite): void {
    this.dialog?.show(npc.name);
    const assetKey = this.dialog?.getAssetKey();

    if (!assetKey) return;

    this.remainingQuestItems = this.dialog?.getQuantityToCollect() || 0;
    this.awards.setAwardsCount(this.remainingQuestItems);
    this.showElements(assetKey);
  }

  private handleItemInteraction(npc: Phaser.GameObjects.Sprite): void {
    const assetKey = this.dialog?.getAssetKey();

    if (npc.name === this.dialog?.getQuestGiverNpcId()) {
      if (this.heldItem!.texture.key === assetKey) {
        this.updateQuestProgress(npc);
      } else {
        this.applyWrongItemPenalty();
      }

      this.heldItem!.destroy();
      this.heldItem = undefined;
    } else {
      this.dialog?.show(npc.name);
    }
  }

  private updateQuestProgress(npc: Phaser.GameObjects.Sprite): void {
    this.remainingQuestItems -= 1;
    this.awards.setAwardsCount(this.remainingQuestItems);

    if (this.remainingQuestItems === 0) {
      this.dialog?.setMessageComplete(npc.name);
      this.dialog?.show(npc.name);

      if (this.dialog?.areAllDialogsCompleted()) {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.scene.start(SceneKeys.GAME_OVER);
      }
    }
  }

  private applyWrongItemPenalty(): void {
    const isDead = this.healthBar.decreaseHealth(30);
    if (isDead) {
      this.scene.start(SceneKeys.GAME_OVER);
    }
  }

  private validateMapConfig(config: MapMinimalConfiguration): MapConfiguration {
    if (!config.tilesConfig?.length) {
      throw new Error("Invalid map configuration: Missing tiles config");
    }

    return {
      name: this.scene.key,
      tilesConfig: config.tilesConfig,
      mapWidth: config.mapWidth ?? MAP_WIDTH,
      mapHeight: config.mapHeight ?? MAP_HEIGHT,
      minPartitionSize: config.minPartitionSize ?? MIN_PARTITION_SIZE,
      minRoomSize: config.minRoomSize ?? MIN_ROOM_SIZE,
    };
  }

  private setElementsVisibility(
    group: GameObjects.Group,
    visible: boolean,
  ): void {
    group.children.iterate((child) => {
      const sprite = child as Phaser.GameObjects.Sprite;
      sprite.setVisible(visible);

      const body = sprite.body as Phaser.Physics.Arcade.Body;
      if (body) {
        body.enable = visible;
      }

      return true;
    });
  }
}
