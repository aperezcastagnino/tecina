import { Scene, GameObjects } from "phaser";
import { loadLevelData } from "utils/data-util";
import { GAME_DIMENSIONS, TILE_SIZE } from "config/config";
import { Controls } from "common/controls";
import { Player } from "common/player";
import { Dialog } from "common-ui/dialog";
import { DialogWithOptions } from "common-ui/dialog-with-options";
import { MapRenderer } from "common/map/map-renderer";
import type { Map } from "types/map";
import { MAP_HEIGHT, MAP_WIDTH } from "config/map-config";

export class BaseScene extends Scene {
  _map!: Map;

  _player!: Player;

  _controls!: Controls;

  _dialog: Dialog | undefined;

  _dialogWithOptions: DialogWithOptions | undefined;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(sceneKey: string) {
    super(sceneKey);
  }

  create() {
    MapRenderer.renderer(this, this._map);

    console.log(this._map);

    this.#createPlayer();

    this.#createDialogs();

    // this.#hideElements(this.#awardGroup);

    this._defineBehaviors();
    this.cameras.main.startFollow(this._player);
    this.cameras.main.setBounds(
      0,
      0,
      MAP_WIDTH * TILE_SIZE * 400,
      MAP_HEIGHT * TILE_SIZE * 400,
      true,
    );
    this.cameras.main.fadeIn(1000, 0, 0, 0);
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
        x: this._map.startPosition.x + 190,
        y: this._map.startPosition.y + GAME_DIMENSIONS.HEIGHT / 2 + 40,
      },
      velocity: 700,
    });

    this._controls = new Controls(this);
  }
}
