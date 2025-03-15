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
import { SceneKeys } from "./scene-keys";
import { DIRECTION } from "common/player-keys";

type MapMinimalConfiguration = Pick<MapConfiguration, "tilesConfig"> &
  Partial<Omit<MapConfiguration, "tilesConfig">>;

export abstract class BaseScene extends Scene {
  map!: MapStructure;

  player!: Player;

  controls!: Controls;

  dialog: Dialog | undefined;

  dialogWithOptions: DialogWithOptions | undefined;

  healthBar!: HealthBar;

  awards!: Awards;

  objectBag: Phaser.GameObjects.Sprite | undefined;

  #collected_items = 0;

  abstract createAnimations(): void;

  preload(config: MapMinimalConfiguration): void {
    this.map = MapGenerator.create({
      name: this.scene.key,
      tilesConfig: config.tilesConfig,
      mapWidth: config.mapHeight || MAP_WIDTH,
      mapHeight: config.mapWidth || MAP_HEIGHT,
      minPartitionSize: config.minPartitionSize || MIN_PARTITION_SIZE,
      minRoomSize: config.minRoomSize || MIN_ROOM_SIZE,
    });

    this.createAnimations();
  }

  async create() {
    MapRenderer.render(this, this.map);

    this.#createPlayer();

    this.#createDialogs();

    this.#createHealthBar();

    this.#createAwards();

    this.#setupCamera();

    this.defineInteractions();
  }

  update(): void {
    if (this.controls.wasSpaceKeyPressed()) {
      this.#handlePlayerInteraction();
      return;
    }

    const directionSelected = this.controls.getDirectionKeyPressed();
    this.player.move(directionSelected);

    if (this.objectBag) {
      this.objectBag.setPosition(this.player.x, this.player.y);
    }
  }

  showElements(group: GameObjects.Group): void {
    group.children.iterate((child) => {
      const sprite = child as Phaser.GameObjects.Sprite;
      sprite.setVisible(true);
      if (sprite.body)
        (sprite.body as Phaser.Physics.Arcade.Body).enable = true;

      return true;
    });
  }

  hideElements(group: GameObjects.Group): void {
    group.children.iterate((child) => {
      const sprite = child as Phaser.GameObjects.Sprite;
      sprite.setVisible(false);
      if (sprite.body)
        (sprite.body as Phaser.Physics.Arcade.Body).enable = false;

      return true;
    });
  }

  defineInteractions(): void {
    // Obstacles or interactive static objects
    const treeGroup = this.map.assetGroups.get(AssetKeys.TILES.TREE)!;
    const npcGroup = this.map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;

    this.physics.add.collider(this.player, treeGroup);
    this.physics.add.collider(this.player, npcGroup);
  }

  defineInteractionWithItems(item: Phaser.GameObjects.Sprite): void {
    if (item.visible && !this.objectBag) {
      this.objectBag = item;
      this.children.bringToTop(this.objectBag);
      if (item.body) {
        const body = item.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = true;
      }
    }
  }

  defineInteractionWithNPCs(npc: Phaser.GameObjects.Sprite): void {
    if (!this.dialog?.isDialogActive()) {
      this.dialog?.show(npc.name);

      const assetKey = this.dialog?.getAssetKey()!;
      if (!assetKey) return;

      this.#collected_items = this.dialog?.getQuantityToCollect() || 0;
      this.awards.setAwardsCount(this.#collected_items);

      this.showElements(this.map.assetGroups.get(assetKey)!);
    } else if (this.objectBag) {
      const assetKey = this.dialog?.getAssetKey()!;
      if (npc.name === this.dialog?.getQuestGiverNpcId()) {
        if (assetKey === this.objectBag.texture.key) {
          this.#collected_items -= 1;
          this.awards.setAwardsCount(this.#collected_items);

          if (this.#collected_items === 0) {
            this.dialog?.setMessageComplete(npc.name);
            this.dialog?.show(npc.name);
          }
        } else {
          const imDead = this.healthBar.decreaseHealth(30);
          if (imDead) {
            this.scene.start(SceneKeys.GAME_OVER);
          }
        }

        this.objectBag.destroy();
        this.objectBag = undefined;
      } else {
        this.dialog?.show(npc.name);
      }
    }
  }

  #handleNPCProximity(): void {
    const npcGroup = this.map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;
    npcGroup.getChildren().forEach((npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npcSprite.x,
        npcSprite.y
      );

      if (distance <= 70) {
        this.defineInteractionWithNPCs(npcSprite);
      }
    });
  }

  #handlePlayerInteraction(): void {
    if (this.dialog?.isVisible()) {
      this.dialog.showNextMessage();
      return;
    }

    this.#handleNPCProximity();

    if (this.objectBag) {
      this.#attemptObjectDrop();
    }
  }

  #attemptObjectDrop() {
    const playerDirection = this.player.getDirection();
    let dropX = 0;
    let dropY = 0;
    if (playerDirection === DIRECTION.UP) {
      dropX = this.player.x;
      dropY = this.player.y - TILE_SIZE;
    } else if (playerDirection === DIRECTION.DOWN) {
      dropX = this.player.x;
      dropY = this.player.y + TILE_SIZE;
    } else if (playerDirection === DIRECTION.LEFT) {
      dropX = this.player.x - TILE_SIZE;
      dropY = this.player.y;
    } else if (playerDirection === DIRECTION.RIGHT) {
      dropX = this.player.x + TILE_SIZE;
      dropY = this.player.y;
    }

    const canDrop =
      this.physics
        .overlapRect(dropX, dropY, TILE_SIZE, TILE_SIZE, true, true)
        .filter(
          (ol) =>
            ol.gameObject instanceof GameObjects.Image &&
            (ol.gameObject.texture.key !== AssetKeys.TILES.TREE ||
              ol.gameObject.texture.key !== AssetKeys.CHARACTERS.NPC)
        ).length === 0;

    if (canDrop) {
      this.objectBag!.setPosition(dropX, dropY);

      if (this.objectBag!.body) {
        const body = this.objectBag!.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = false;
        body.updateFromGameObject();
      }
      this.objectBag = undefined;
    }
  }

  #setupCamera(): void {
    this.cameras.main.setBounds(
      0,
      0,
      MAP_WIDTH * TILE_SIZE * 400,
      MAP_HEIGHT * TILE_SIZE * 400,
      true
    );
    this.cameras.main.startFollow(this.player);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  #createAwards(): void {
    this.awards = new Awards({
      assetKey: AssetKeys.ITEMS.FRUITS.ORANGE.ASSET_KEY,
      frameRate: 19,
      padding: 0,
      scene: this,
      width: MAP_WIDTH * TILE_SIZE,
      spriteConfig: {
        startFrame: AssetKeys.ITEMS.FRUITS.ORANGE.STAR_FRAME,
        endFrame: AssetKeys.ITEMS.FRUITS.ORANGE.END_FRAME,
        frameWidth: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_WIDTH,
        frameHeight: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_HEIGHT,
      },
    });
  }

  #createHealthBar(): void {
    this.healthBar = new HealthBar(this);
  }

  #createDialogs(): void {
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

  #createPlayer(): void {
    this.player = new Player({
      scene: this,
      position: {
        x: 0 + TILE_SIZE + this.map.startPosition.x * TILE_SIZE,
        y: 0 + TILE_SIZE + this.map.startPosition.y * TILE_SIZE,
      },
      velocity: 700,
    });

    this.controls = new Controls(this);
  }
}
