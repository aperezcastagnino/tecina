import { Scene } from "phaser";
import { SceneKeys } from "./SceneKeys";
import { AssetKeys } from "../assets/AssetKeys";
import { Player } from "../levels/Player";
import { DIRECTION } from "../common/Direction";
import { TILE_SIZE } from "../config/Config";
import { Controls } from "../utils/Controls";

export class Level1 extends Scene {
  #player: Player;
  #controls: Controls;

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
      AssetKeys.LEVELS.TILESET
    );
    if (!collisionTiles) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision tileset using data from tiled`
      );
      return;
    }
    const _groundLayer = map.createLayer(0, collisionTiles!);
    const _elementsLayer = map.createLayer(1, collisionTiles!);
    const collisionLayer = map.createLayer("collision", collisionTiles, 0, 0);
    if (!collisionLayer) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision layer using data from tiled`
      );
      return;
    }

    collisionLayer.setAlpha(0).setDepth(2);

    this.#player = new Player({
      scene: this,
      direction: DIRECTION.DOWN,
      origin: {
        x: 4 * TILE_SIZE,
        y: 4 * TILE_SIZE,
      },
      collisionLayer: collisionLayer,
      position: {
        x: 4 * TILE_SIZE,
        y: 4 * TILE_SIZE,
      },
      spriteGridMovementFinishedCallback: () => {
        console.log(
          `[${Level1.name}:create] sprite grid movement finished callback invoked`
        );
      },
    });
    this.cameras.main.startFollow(this.#player.sprite);

    this.#controls = new Controls(this);

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update() {
    const selectedDirection = this.#controls.getDirectionKeyJustPressed();
    if (selectedDirection !== DIRECTION.NONE) {
      this.#player.moveCharacter(selectedDirection);
    }

    this.#player.update();
  }
}
