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

export class BaseScene extends Scene {
  _map!: MapStructure;

  _player!: Player;

  _controls!: Controls;

  _dialog: Dialog | undefined;

  _dialogWithOptions: DialogWithOptions | undefined;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(sceneKey: string) {
    super(sceneKey);
  }

  preload(sceneKey: string) {
    this._map = MapGenerator.newMap(sceneKey);
  }

  create() {
    MapRenderer.renderer(this, this._map);

    this.#createDialogs();

    this.#createPlayer();

    this.#setCamera();

    this._defineBehaviors();
  }

  update() {
    const directionSelected = this._controls.getDirectionKeyPressed();

    if (!this._dialog?.isVisible) {
      this._player.move(directionSelected);
    }
    if (this._controls.wasSpaceKeyPressed()) {
      this.#handlePlayerInteraction();
    }
  }

  _showElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(true);
      (child as Phaser.GameObjects.Sprite).setVisible(true);
      return true;
    });
  }

  _hideElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(false);
      (child as Phaser.GameObjects.Sprite).setVisible(false);
      return true;
    });
  }

  _defineBehaviors() {}

  #handlePlayerInteraction() {
    if (this._dialog) {
      if (this._dialog.isVisible) {
        this._dialog.showNextMessage();
      }
    }
  }

  #setCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      MAP_WIDTH * TILE_SIZE * 400,
      MAP_HEIGHT * TILE_SIZE * 400,
      true,
    );
    this.cameras.main.startFollow(this._player);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  #createDialogs() {
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

  #createPlayer() {
    this._player = new Player({
      scene: this,
      position: {
        x: 100 + this._map.startPosition.x * TILE_SIZE,
        y: 100 + this._map.startPosition.y * TILE_SIZE,
      },
      velocity: 700,
    });

    this._controls = new Controls(this);
  }
}
