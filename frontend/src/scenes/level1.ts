import { Scene, GameObjects } from "phaser";
import { AssetKeys } from "assets/asset-keys";
import { MAP_HEIGHT, MAP_WIDTH } from "config/map-config";
import type { Map } from "types/map";
import { loadLevelData } from "utils/data-util";
import { GAME_DIMENSIONS, TILE_SIZE } from "config/config";
import { MapGenerator } from "common/map/map-generator";
import { MapRenderer } from "common/map/map-renderer";
import { Controls } from "common/controls";
import { Player } from "common/player";
import { Dialog } from "common-ui/dialog";
import { SceneKeys } from "./scene-keys";

export class Level1 extends Scene {
  #player!: Player;

  #controls!: Controls;

  #dialog: Dialog | undefined;

  #map!: Map;

  #total_oranges = 0;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  preload() {
    this.#map = MapGenerator.newMap(SceneKeys.LEVEL_1, MAP_HEIGHT, MAP_WIDTH);

    this.anims.create({
      key: "ORANGEAnim",
      frames: this.anims.generateFrameNumbers(
        AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      ),
      frameRate: 19,
      repeat: -1,
    });
  }

  create() {
    MapRenderer.renderer(this, this.#map);

    console.log(this.#map);

    this.#createPlayer();

    this.#createDialogs();

    // this.#hideElements(this.#awardGroup);

    this.#defineBehaviors();
    this.cameras.main.startFollow(this.#player);
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
    const directionSelected = this.#controls.getDirectionKeyPressed();

    if (!this.#dialog?.isVisible) {
      this.#player.move(directionSelected);
    }
    if (this.#controls.wasSpaceKeyPressed()) {
      this.#handlePlayerInteraction();
    }
  }

  #handlePlayerInteraction() {
    if (this.#dialog) {
      if (this.#dialog.isVisible) {
        this.#dialog.showNextMessage();
      }
    }
  }

  #showElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(true);
      (child as Phaser.GameObjects.Sprite).setVisible(true);
      return true;
    });
  }

  #hideElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(false);
      (child as Phaser.GameObjects.Sprite).setVisible(false);
      return true;
    });
  }

  #defineBehaviors() {
    const treeGroup = this.#map.assetGroups.filter(
      (group) => group.name === "TREE",
    );
    const orangeGroup = this.#map.assetGroups.filter(
      (group) => group.name === "ORANGE",
    );
    const npcGroup = this.#map.assetGroups.filter(
      (group) => group.name === "NPC",
    );
    this.#hideElements(orangeGroup[0]!);

    this.#total_oranges = npcGroup[0]!.countActive();
    console.log(this.#total_oranges);
    this.physics.add.collider(this.#player, treeGroup[0]!);
    this.physics.add.collider(this.#player, npcGroup[0]!, (_player, npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForNPCs(npcSprite, orangeGroup[0]!);
    });

    this.physics.add.collider(
      this.#player,
      orangeGroup[0]!,
      (_player, item) => {
        const itemObject = item as Phaser.GameObjects.Sprite;
        this.#defineBehaviorForItems(itemObject);
      },
    );
  }

  #defineBehaviorForNPCs(
    npc: Phaser.GameObjects.Sprite,
    itemGroup: GameObjects.Group,
  ) {
    if (this.#controls.wasSpaceKeyPressed()) {
      if (npc.name === "npc-1") {
        if (this.#total_oranges > 0 && this.#total_oranges < 2) {
          this.#dialog?.setMessageComplete("npc-1");
          this.#dialog?.showNextMessage();
        } else {
          this.#dialog?.show("npc-1");
          this.#showElements(itemGroup!);
          this.#dialog?.setMessageComplete("npc-1");
        }
      }

      // if (npc.name === "npc-2") {
      // }
    }
  }

  #defineBehaviorForItems(item: Phaser.GameObjects.Sprite) {
    item.destroy();
  }

  #createDialogs() {
    const levelData = loadLevelData(this, SceneKeys.LEVEL_1.toLowerCase());
    this.#dialog = new Dialog({ scene: this, data: levelData.dialogs });
  }

  #createPlayer() {
    this.#player = new Player({
      scene: this,
      position: {
        x: this.#map.startPosition.x + 190,
        y: this.#map.startPosition.y + GAME_DIMENSIONS.HEIGHT / 2 + 40,
      },
      velocity: 700,
    });

    this.#controls = new Controls(this);
  }
}
