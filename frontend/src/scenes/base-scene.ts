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

export class BaseScene extends Scene {
  _map!: MapStructure;

  _player!: Player;

  _controls!: Controls;

  _dialog: Dialog | undefined;

  _dialogWithOptions: DialogWithOptions | undefined;

  _awards!: Awards;

  _isObjectInBag: boolean = false;

  _objectBag: Phaser.GameObjects.Sprite | undefined;

  preload(sceneKey: string): void {
    this._map = MapGenerator.newMap(sceneKey);
  }

  create(): void {
    MapRenderer.renderer(this, this._map);

    this.#createPlayer();

    this.#createDialogs();

    this.#createAwards();

    this.#setupCamera();

    this._defineBehaviors();
  }

  update(): void {
    if (this._controls.wasSpaceKeyPressed()) {
      this.#handlePlayerInteraction();
      return;
    }

    const directionSelected = this._controls.getDirectionKeyPressed();
    this._player.move(directionSelected);

    if (this._isObjectInBag) {
      this._objectBag!.setPosition(this._player.x, this._player.y);
    }
  }

  _showElements(group: GameObjects.Group): void {
    group.children.iterate((child) => {
      child.setActive(true);
      (child as Phaser.GameObjects.Sprite).setVisible(true);
      return true;
    });
  }

  _hideElements(group: GameObjects.Group): void {
    group.children.iterate((child) => {
      child.setActive(false);
      (child as Phaser.GameObjects.Sprite).setVisible(false);
      return true;
    });
  }

  _defineBehaviors(): void {
    const treeGroup = this._map.assetGroups.get(AssetKeys.TILES.TREE)!;
    const npcGroup = this._map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;

    this.physics.add.collider(this._player, treeGroup);
    this.physics.add.collider(this._player, npcGroup);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite): void {}

  #handleNPCProximity(): void {
    const npcGroup = this._map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;
    npcGroup.getChildren().forEach((npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      const distance = Phaser.Math.Distance.Between(
        this._player.x,
        this._player.y,
        npcSprite.x,
        npcSprite.y
      );

      if (distance <= 80) {
        this._defineBehaviorForNPCs(npcSprite);
      }
    });
  }

  #attemptObjectDrop() {
    const dropX = this._player.x + TILE_SIZE;
    const dropY = this._player.y;

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
      this._objectBag!.setPosition(dropX, dropY);
      this._isObjectInBag = false;

      if (this._objectBag!.body) {
        const body = this._objectBag!.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = false;
        body.updateFromGameObject();
      }
    }
  }

  #handlePlayerInteraction(): void {
    if (this._dialog?.isVisible()) {
      this._dialog.showNextMessage();
      return;
    }

    if (this._isObjectInBag) {
      this.#attemptObjectDrop();
      return;
    }

    this.#handleNPCProximity();
  }

  #setupCamera(): void {
    this.cameras.main.setBounds(
      0,
      0,
      MAP_WIDTH * TILE_SIZE * 400,
      MAP_HEIGHT * TILE_SIZE * 400,
      true
    );
    this.cameras.main.startFollow(this._player);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  #createAwards(): void {
    this._awards = new Awards({
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

    this._dialog = new Dialog({ scene: this, data: levelData.dialogs });
    this._dialogWithOptions = new DialogWithOptions({
      scene: this,
      data: levelData.dialogs,
      callback: (optionSelected: string) => {
        console.log("Option selected: ", optionSelected);
      },
    });
  }

  #createPlayer(): void {
    this._player = new Player({
      scene: this,
      position: {
        x: 0 + TILE_SIZE + this._map.startPosition.x * TILE_SIZE,
        y: 0 + TILE_SIZE + this._map.startPosition.y * TILE_SIZE,
      },
      velocity: 700,
    });

    this._controls = new Controls(this);
  }
}
