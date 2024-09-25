import { Scene } from "phaser";
import { DEBUG_MODE_ACTIVE } from "../config/debug-config";
import { getTargetPosition } from "../utils/grid";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { Player } from "../characters/player";
import { NPC } from "../characters/npc";
import { DIRECTION } from "../common/direction";
import { TILE_SIZE } from "../config/config";
import { Controls } from "../common/controls";
import { DialogUi } from "../common-ui/dialog-ui";
import { Awards } from "../utils/awards";

const CUSTOM_TILED_TYPES = {
  NPC: "npc",
  NPC_PATH: "npc_path",
};

const TILED_NPC_PROPERTY = {
  IS_SPAWN_POINT: "is_spawn_point",
  MOVEMENT_PATTERN: "movement_pattern",
  MESSAGES: "messages",
  FRAME: "frame",
};

export class Level1 extends Scene {
  #player!: Player;

  #controls!: Controls;

  #dialogUi: DialogUi | undefined;

  #awards!: Awards;

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
      AssetKeys.LEVELS.TILESET
    );
    if (!collisionTiles) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision tileset using data from tiled`
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
        `[${Level1.name}:create] encountered error while creating collision layer using data from tiled`
      );
      return;
    }
    collisionLayer.setAlpha(DEBUG_MODE_ACTIVE ? 0.7 : 0).setDepth(2);

    this.#player = new Player({
      scene: this,
      direction: DIRECTION.DOWN,
      position: {
        x: 2 * TILE_SIZE,
        y: 2 * TILE_SIZE,
      },
      collisionLayer,
      otherCharactersToCheckForCollisionsWith: this.#npcs,
    });
    this.cameras.main.startFollow(this.#player.sprite);

    this.#controls = new Controls(this);
    this.#dialogUi = new DialogUi(this);
    this.#createNPCs(map);

    this.cameras.main.fadeIn(1000, 0, 0, 0);
    this.#awards = new Awards({
      scene: this,
      width: this.cameras.main.width - 50,
      padding: 10,
      scale: 0.5,
      frameRate: 20,
      assetKey: AssetKeys.UI.AWARD.NAME,
      spriteConfig: {
        frameWidth: AssetKeys.UI.AWARD.frameWidth,
        frameHeight: AssetKeys.UI.AWARD.frameHeight,
      },
    });
    this.#awards.setAwardsCount(2);
  }

  update() {
    const selectedDirection = this.#controls.getDirectionKeyPressedDown();
    if (selectedDirection !== DIRECTION.NONE) {
      this.#player.moveCharacter(selectedDirection);
    }

    if (this.#controls.wasSpaceKeyPressed() && !this.#player.isMoving) {
      this.#handlePlayerInteraction();
    }

    this.#player.update();
    this.#npcs.forEach((npc) => npc.update());
  }

  #createNPCs(map: Phaser.Tilemaps.Tilemap) {
    this.#npcs = [];

    const npcLayers = map
      .getObjectLayerNames()
      .filter((layerName) => layerName.includes("NPC"));

    npcLayers.forEach((layerName) => {
      const layer = map.getObjectLayer(layerName);
      const npcObject = layer?.objects.find(
        (obj) => obj.type === CUSTOM_TILED_TYPES.NPC
      );
      if (
        !npcObject ||
        npcObject.x === undefined ||
        npcObject.y === undefined
      ) {
        return;
      }

      const npcFrame =
        npcObject.properties?.find(
          (prop: any) => prop.name === TILED_NPC_PROPERTY.FRAME
        )?.value || 0;

      const npcMessagesSTRING =
        npcObject.properties?.find(
          (prop: any) => prop.name === TILED_NPC_PROPERTY.MESSAGES
        )?.value || "";
      const npcMessages = npcMessagesSTRING.split("::");

      const npc = new NPC({
        scene: this,
        position: { x: 242, y: 52 },
        direction: DIRECTION.DOWN,
        frame: parseInt(npcFrame, 10),
        messages: npcMessages,
        otherCharactersToCheckForCollisionsWith: [this.#player],
      });

      this.#npcs.push(npc);
    });
  }

  #handlePlayerInteraction() {
    if (this.#dialogUi) {
      if (this.#dialogUi.isAnimationPlaying) {
        return;
      }

      if (this.#dialogUi.isVisible && this.#dialogUi.moreMessagesToShow) {
        this.#dialogUi.showNextMessage();
        return;
      }

      const { x, y } = this.#player.sprite;
      const targetPosition = getTargetPosition(
        { x, y },
        this.#player.direction
      );

      // const nearbyNpc = this.#npcs.find(
      //   (npc) =>
      //     npc.sprite.x === targetPosition.x && npc.sprite.y === targetPosition.y
      // );

      const nearbyNpc = this.#npcs[0];
      if (nearbyNpc) {
        nearbyNpc.facePlayer(this.#player.direction);
        nearbyNpc.isTalkingToPlayer = true;
        this.#dialogUi.showDialogModal(nearbyNpc.messages);
      }
    }
  }
}
