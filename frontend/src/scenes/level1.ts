import { GameObjects } from "phaser";
import { AssetKeys } from "assets/asset-keys";
import { AnimationsKeys } from "assets/animation-keys";
import { SceneKeys } from "./scene-keys";
import { BaseScene } from "./base-scene";

export class Level1 extends BaseScene {
  #total_oranges = 0;

  #npc_1_show_first_message!: boolean;

  #npc_1_show_first_complete_collect_objects!: boolean;

  #npc_1_show_intermediate_message!: boolean;

  constructor() {
    super(SceneKeys.LEVEL_1);

    this.#npc_1_show_first_message = true;
    this.#npc_1_show_first_complete_collect_objects = true;
    this.#npc_1_show_intermediate_message = false;
  }

  create() {
    super.create();

    this._hideElements(this._map.assetGroups.get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!);
  }

  preload() {
    super.preload(SceneKeys.LEVEL_1);

    this.anims.create({
      key: AnimationsKeys.ORANGE,
      frames: this.anims.generateFrameNumbers(
        AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      ),
      frameRate: 19,
      repeat: -1,
    });
  }

  _defineBehaviors() {
    const treeGroup = this._map.assetGroups.get(AssetKeys.TILES.TREE)!;
    const orangeGroup = this._map.assetGroups.get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!;
    const npcGroup = this._map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;

    this.physics.add.collider(this._player, treeGroup);

    this.#total_oranges = orangeGroup.getChildren().length;

    this.physics.add.collider(this._player, npcGroup, (_player, npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForNPCs(npcSprite, orangeGroup);
    });

    this.physics.add.collider(
      this._player,
      orangeGroup,
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
    this.#total_oranges = this._map.assetGroups.get("ORANGE")!.getChildren().length;
    if (this._controls.wasSpaceKeyPressed()) {
      if (npc.name === "npc-1") {
        if (this.#npc_1_show_first_message) {
          this._dialog?.show("npc-1");
          this._showElements(itemGroup!);
          this._dialog?.setMessageComplete("npc-1");
          this.#npc_1_show_first_message = false;
        } else if (this.#total_oranges > 0) {
          this._dialog?.show("npc-1");
          this.#npc_1_show_intermediate_message = true;
        } else {
          if (this.#npc_1_show_first_complete_collect_objects) {
            if (!this.#npc_1_show_intermediate_message) {
              this._dialog?.setMessageComplete("npc-1");
            }
            this.#npc_1_show_first_complete_collect_objects = false;
          }
          this._dialog?.show("npc-1");
        }
      }
      if (npc.name === "npc-2") {
        if (this.#total_oranges === 0) {
          this._dialog?.setMessageComplete("npc-2");
        }
        this._dialog?.show("npc-2");
      }
    }
  }

  #defineBehaviorForItems(item: Phaser.GameObjects.Sprite) {
    item.destroy();
  }
}
