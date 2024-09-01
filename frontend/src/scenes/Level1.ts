import { Scene } from "phaser";
import { SceneKeys } from "./SceneKeys";
import { AssetKeys } from "../assets/AssetKeys";
import { Player } from "../levels/Player";
import { DIRECTION } from "../common/Direction";
import { TILE_SIZE } from "../config/Config";

export class Level1 extends Scene {
  #player: Player;
  camera: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  create() {
    console.log(`[${Level1.name}:created] INVOKED`);
    // this.camera = this.cameras.main;
    // this.camera.setBackgroundColor(0x00ff00);

    const map = this.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });
    const collisionTiles = map.addTilesetImage(
      "tileset_sunnysideworld",
      AssetKeys.LEVELS.TILESET
    );
    if (!collisionTiles) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision tileset using data from tiled`
      );
      return;
    }
    const groundLayer = map.createLayer(0, collisionTiles!);
    const elementsLayer = map.createLayer(1, collisionTiles!);
    const collisionLayer = map.createLayer("collision", collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision layer using data from tiled`
      );
      return;
    }

    collisionLayer.setAlpha(0.7).setDepth(1);

    this.#player = new Player({
      scene: this,
      direction: DIRECTION.DOWN,
      origin: {
        x: 1 * TILE_SIZE,
        y: 1 * TILE_SIZE,
      },
      collisionLayer: collisionLayer,
    });
  }
}
