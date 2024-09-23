import { Scene } from "phaser";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { Player } from "../characters/player";
import { DIRECTION } from "../common/direction";
import { TILE_SIZE } from "../config/config";
import { Controls } from "../utils/controls";
import { DialogUi } from "../common/dialog-ui";

export class Level1 extends Scene {
  #player!: Player;

  #controls!: Controls;

  #dialogUi: DialogUi | undefined;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  create() {
    console.log(`[${Level1.name}:created] INVOKED`);

    this.cameras.main.setBounds(0, 0, 1280, 2176);
    // this.cameras.main.setZoom(0.8);

    const map = this.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });
    const collisionTiles = map.addTilesetImage(
      "tileset_sunnysideworld",
      AssetKeys.LEVELS.TILESET,
    );
    if (!collisionTiles) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision tileset using data from tiled`,
      );
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const groundLayer = map.createLayer(0, collisionTiles!);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const elementsLayer = map.createLayer(1, collisionTiles!);
    const collisionLayer = map.createLayer("collision", collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision layer using data from tiled`,
      );
      return;
    }

    collisionLayer.setAlpha(0).setDepth(2);

    this.#player = new Player({
      scene: this,
      direction: DIRECTION.DOWN,
      position: {
        x: 4 * TILE_SIZE,
        y: 4 * TILE_SIZE,
      },
      collisionLayer,
      spriteGridMovementFinishedCallback: () => {
        console.log(
          `[${Level1.name}:create] sprite grid movement finished callback invoked`,
        );
      },
    });
    this.cameras.main.startFollow(this.#player.sprite);

    this.#controls = new Controls(this);

    this.#dialogUi = new DialogUi(this);
    this.#dialogUi.showDialogModal([
      "Primer mensaje",
      "segundo mensaje",
      "tercer mensaje",
      "cuarto mensaje",
    ]);

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update() {
    // const selectedDirection = this.#controls.getDirectionKeyJustPressed();
    const selectedDirection = this.#controls.getDirectionKeyPressedDown();
    if (selectedDirection !== DIRECTION.NONE) {
      this.#player.moveCharacter(selectedDirection);
    }

    this.#player.update();
  }
}
