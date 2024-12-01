import { Scene } from "phaser";
import type { LevelData } from "types/level-data";
import { loadLevelData } from "utils/data-util";
import { AssetKeys } from "assets/asset-keys";
import { Player } from "characters/player";
import { TILE_SIZE } from "config/config";
import { Controls } from "common/controls";
import { Dialog } from "common-ui/dialog";
import { DialogWithOptions } from "common-ui/dialog-with-options";
import { SceneKeys } from "./scene-keys";

export class Level1 extends Scene {
  #player!: Player;

  #controls!: Controls;

  #dialog: Dialog | undefined;

  #dialogWithOptions: DialogWithOptions | undefined;

  #levelData: LevelData | undefined;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  create() {
    this.#levelData = loadLevelData(this, SceneKeys.LEVEL_1.toLowerCase());
    this.cameras.main.setBounds(0, 0, 1280, 2176);

    const tilemap = this.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });
    const tileset = tilemap.addTilesetImage(
      "tileset_sunnysideworld",
      AssetKeys.LEVELS.TILESET,
    );
    if (!tileset) {
      console.error(
        `[${Level1.name}:create] encountered error while assigning tileset to the map`,
      );
      return;
    }
    tilemap.createLayer(AssetKeys.LEVELS.GROUND, tileset);
    const collisionLayer = tilemap.createLayer(
      AssetKeys.LEVELS.ELEMENTS,
      tileset,
    );
    if (!collisionLayer) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision layer using data from tiled`,
      );
      return;
    }
    collisionLayer.setCollisionByExclusion([-1]);

    this.#player = new Player({
      scene: this,
      position: {
        x: 2 * TILE_SIZE,
        y: 2 * TILE_SIZE,
      },
      velocity: 700,
    });
    this.physics.add.collider(this.#player, collisionLayer);

    this.#controls = new Controls(this);

    this.#dialog = new Dialog({ scene: this, data: this.#levelData.dialogs });

    this.#dialogWithOptions = new DialogWithOptions({
      scene: this,
      data: this.#levelData.dialogs,
      callback: (optionSelected: string) => {
        console.log("Option selected: ", optionSelected);
      },
    });

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update() {
    const directionSelected = this.#controls.getDirectionKeyPressed();
    this.#player.move(directionSelected);

    if (this.#controls.wasSpaceKeyPressed() && !this.#player.isMoving) {
      this.#handlePlayerInteraction();
    }

    if (this.#controls.wasShiftPressed()) {
      this.#dialog?.setMessageComplete("npc-1");
      this.#dialogWithOptions?.show("npc-1");
    }

    if (this.#dialogWithOptions?.isVisible) {
      this.#dialogWithOptions!.handlePlayerInput(
        this.#controls.getKeyPressed(),
      );
    }
  }

  #handlePlayerInteraction() {
    if (this.#dialog) {
      if (this.#dialog.isVisible) {
        this.#dialog.showNextMessage();
      }
    }
  }
}
