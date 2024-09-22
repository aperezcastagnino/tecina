import { Scene, Tilemaps } from "phaser";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { Player } from "../characters/player";
import { DIRECTION } from "../common/direction";
import { TILE_SIZE } from "../config/config";
import { Controls } from "../utils/controls";
import { NPC } from "../characters/npc";

export class Level1 extends Scene {
  #player!: Player;

  #controls!: Controls;

  #npcs: NPC[] = [];

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
    this.#createNPCs(map);

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

  #createNPCs(map: Tilemaps.Tilemap) {
    const npcLayers = map
      .getObjectLayerNames()
      .filter((layerName) => layerName.includes("NPC"));
    npcLayers.forEach((layerName) => {
      const layer = map.getObjectLayer(layerName);
      const npcObject = layer?.objects.find((object) => object.type === "npc");

      if (
        !npcObject ||
        npcObject.x === undefined ||
        npcObject.y === undefined
      ) {
        return;
      }

      const npcFrame =
        npcObject.properties.find(
          (property: { name: string }) => property.name === "frame",
        )?.value || 0;

      const npc = new NPC({
        scene: this,
        position: {
          x: npcObject.x,
          y: npcObject.y - TILE_SIZE,
        },
        direction: DIRECTION.DOWN,
        frame: parseInt(npcFrame, 10),
        collisionLayer: null,
        spriteGridMovementFinishedCallback: () => {
          console.log(
            `[${Level1.name}:create] sprite grid movement finished callback invoked`,
          );
        },
      });

      this.#npcs.push(npc);
    });
  }
}
