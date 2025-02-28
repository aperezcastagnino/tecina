import { Scene, GameObjects } from "phaser";
import { loadLevelData } from "utils/data-util";
import { TILE_SIZE } from "config/config";
import { Controls } from "common/controls";
import { Player } from "common/player";
import { Dialog } from "common-ui/dialog";
import { DialogWithOptions } from "common-ui/dialog-with-options";
import { MapRenderer } from "common/map/map-renderer";
import type { MapStructure } from "types/map";
import { MAP_HEIGHT, MAP_WIDTH } from "config/map-config";
import { MapGenerator } from "common/map/map-generator";
import { Awards } from "common-ui/awards";
import { AssetKeys } from "assets/asset-keys";

export abstract class BaseScene extends Scene {
  map!: MapStructure;

  player!: Player;

  controls!: Controls;

  dialog: Dialog | undefined;

  _dialogWithOptions: DialogWithOptions | undefined;

  awards!: Awards;

  objectBag: Phaser.GameObjects.Sprite | undefined;

  preload(sceneKey: string): void {
    this.map = MapGenerator.newMap(sceneKey);

    this.createAnimations();
  }

  create(): void {
    MapRenderer.renderer(this, this.map);

    this.#createPlayer();

    this.#createDialogs();

    this.#createAwards();

    this.#setupCamera();

    this.defineBehaviors();
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

  defineBehaviors(): void {
    const treeGroup = this.map.assetGroups.get(AssetKeys.TILES.TREE)!;
    const npcGroup = this.map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;

    this.physics.add.collider(this.player, treeGroup);
    this.physics.add.collider(this.player, npcGroup);
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

      if (distance <= 80) {
        this.defineBehaviorForNPCs(npcSprite);
      }
    });
  }

  #attemptObjectDrop() {
    const dropX = this.player.x + TILE_SIZE;
    const dropY = this.player.y;

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
    }
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
      assetKey: AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      frameRate: 19,
      padding: 0,
      scale: 2,
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

  #createDialogs(): void {
    const levelData = loadLevelData(this, this.scene.key.toLowerCase());

    this.dialog = new Dialog({ scene: this, data: levelData.dialogs });
    this._dialogWithOptions = new DialogWithOptions({
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  abstract defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite): void;
  abstract createAnimations(): void;
}
