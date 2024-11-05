import { Scene } from "phaser";
import type { LevelData } from "types/level-data";
import { loadLevelData } from "../utils/data-util";
import { DEBUG_MODE_ACTIVE } from "../config/debug-config";
import { arePositionsNear, getNextPosition } from "../utils/location-utils";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { Player } from "../characters/player";
import { NPC } from "../characters/npc";
import { DIRECTION } from "../common/player-keys";
import { TILE_SIZE } from "../config/config";
import { Controls } from "../common/controls";
import { Dialog } from "../common-ui/dialog";
import { Awards } from "../common-ui/awards";
import { DialogWithOptions } from "../common-ui/dialog-with-options";

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

  #dialog: Dialog | undefined;

  #dialogWithOptions: DialogWithOptions | undefined;

  #awards!: Awards;

  #npcs: NPC[];

  #levelData: LevelData | undefined;

  constructor() {
    super(SceneKeys.LEVEL_1);
    this.#npcs = [];
  }

  create() {
    this.#levelData = loadLevelData(this, SceneKeys.LEVEL_1.toLowerCase());
    console.log(this.#levelData);
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
    collisionLayer.setAlpha(DEBUG_MODE_ACTIVE ? 0.7 : 0).setDepth(2);

    this.#player = new Player({
      scene: this,
      direction: DIRECTION.DOWN,
      position: {
        x: 2 * TILE_SIZE,
        y: 2 * TILE_SIZE,
      },
      collisionLayer,
    });
    this.#createNPCs(map);

    this.#controls = new Controls(this);
    this.#dialog = new Dialog({ scene: this, data: this.#levelData.dialogs });

    this.#dialogWithOptions = new DialogWithOptions({
      scene: this,
      data: this.#levelData.dialogs,
      callback: (optionSelected: string) => {
        console.log("Option selected: ", optionSelected);
      },
    });

    this.cameras.main.startFollow(this.#player.sprite);
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
    if (
      selectedDirection !== DIRECTION.NONE &&
      !this.#dialogWithOptions?.isVisible
    ) {
      this.#player.moveCharacter(selectedDirection);
    }

    if (this.#controls.wasSpaceKeyPressed() && !this.#player.isMoving) {
      this.#handlePlayerInteraction();
    }

    if (this.#controls.wasShiftPressed()) {
      this.#dialog?.setMessageComplete("npc-1");
      this.#dialogWithOptions?.show("npc-1");
    }

    this.#player.update();
    this.#npcs.forEach((npc) => npc.update());

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
        return;
      }

      const { x, y } = this.#player.sprite;
      const targetPosition = getNextPosition({ x, y }, this.#player.direction);

      const nearbyNpc = this.#npcs.find((npc) =>
        arePositionsNear(npc.sprite, targetPosition),
      );
      if (nearbyNpc) {
        nearbyNpc.facePlayer(this.#player.direction);
        nearbyNpc.isTalkingToPlayer = true;
        this.#dialog.show("npc-1");
      }
    }
  }

  #createNPCs(map: Phaser.Tilemaps.Tilemap) {
    this.#npcs = [];

    const npcLayers = map
      .getObjectLayerNames()
      .filter((layerName) => layerName.includes("NPC"));

    npcLayers.forEach((layerName) => {
      const layer = map.getObjectLayer(layerName);
      const npcObject = layer?.objects.find(
        (obj) => obj.type === CUSTOM_TILED_TYPES.NPC,
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
          (prop: any) => prop.name === TILED_NPC_PROPERTY.FRAME,
        )?.value || 0;

      const npcMessagesSTRING =
        npcObject.properties?.find(
          (prop: any) => prop.name === TILED_NPC_PROPERTY.MESSAGES,
        )?.value || "";
      const npcMessages = npcMessagesSTRING.split("::");

      const npc = new NPC({
        scene: this,
        position: { x: 6 * TILE_SIZE, y: 3 * TILE_SIZE },
        direction: DIRECTION.DOWN,
        frame: parseInt(npcFrame, 10),
        messages: npcMessages,
        otherCharactersToCheckForCollisionsWith: [this.#player],
      });

      this.#npcs.push(npc);
    });

    this.#player.setCaractersToCollideWith(this.#npcs);
  }
}
