import { AssetKeys } from "assets/asset-keys";
import { AnimationsKeys } from "assets/animation-keys";
import { SceneKeys } from "./scene-keys";
import { BaseScene } from "./base-scene";
import { Awards } from "common-ui/awards";

export class Level1 extends BaseScene {
  #total_oranges = 0;

  #npc_1_show_first_message!: boolean;

  #npc_1_show_first_complete_collect_objects!: boolean;

  #npc_1_show_intermediate_message!: boolean;

  _awardGroup!: GameObjects.Group;


  constructor() {
    super(SceneKeys.LEVEL_1);

    this.#npc_1_show_first_message = true;
    this.#npc_1_show_first_complete_collect_objects = true;
    this.#npc_1_show_intermediate_message = false;
  }

  create() {
    super.create();

    this._hideElements(
      this._map.assetGroups.get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!,
    );
    this._awardGroup = this.add.group();
    
    const tilemap = this.make.tilemap({ key: 'level1' });
    this.#createAwards(tilemap);


    this._hideElements(this._awardGroup);
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

    const myAwards = new Awards(
      { scene: this,
       width: 800,
       padding: 10,
       scale: 1,
       frameRate: 10,
       assetKey: "award",
       spriteConfig: {
         frameWidth: 64,
         frameHeight: 64,
       }})

  }

  #createAwards(tilemap: Phaser.Tilemaps.Tilemap) {
    const awardsLayer = tilemap.objects.find((f) => f.name === "objs_awards");

    awardsLayer!.objects.forEach((element) => {
      const spriteAward = this.physics.add.sprite(
        element.x!,
        element.y!,
        AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      );
      spriteAward.setOrigin(0.5, 0.5);
      spriteAward.setImmovable(true);

      this._awardGroup.add(spriteAward);
    });
  }

  _defineBehaviors() {
    const treeGroup = this._map.assetGroups.get(AssetKeys.TILES.TREE)!;
    const orangeGroup = this._map.assetGroups.get(
      AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
    )!;
    const npcGroup = this._map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;

    this.physics.add.collider(this._player, treeGroup);

    this.#total_oranges = orangeGroup.getChildren().length;

    this.physics.add.collider(this._player, npcGroup, (_player, npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForNPCs(npcSprite);
    });

    this.physics.add.collider(this._player, orangeGroup, (_player, item) => {
      const itemObject = item as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForItems(itemObject);
    });
  }

  #defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite) {
    this.#total_oranges = this._map.assetGroups
      .get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!
      .getLength();

    if (this._controls.wasSpaceKeyPressed()) {
      if (npc.name === "npc-1") {
        const orangeGroup = this._map.assetGroups.get(
          AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
        )!;

        if (this.#npc_1_show_first_message) {
          this._dialog?.show(npc.name);
          this._showElements(orangeGroup!);
          this._dialog?.setMessageComplete(npc.name);
          this.#npc_1_show_first_message = false;
        } else if (this.#total_oranges > 0) {
          this._dialog?.show("npc-1");
          this.#npc_1_show_intermediate_message = true;
        } else {
          if (this.#npc_1_show_first_complete_collect_objects) {
            if (!this.#npc_1_show_intermediate_message) {
              this._dialog?.setMessageComplete(npc.name);
            }
            this.#npc_1_show_first_complete_collect_objects = false;
          }
          this._dialog?.show(npc.name);
        }
      }

      if (npc.name === "npc-2") {
        if (this.#total_oranges === 0) {
          this._dialog?.setMessageComplete(npc.name);
        }
        this._dialog?.show(npc.name);
      }
    }
  }

  #defineBehaviorForItems(item: Phaser.GameObjects.Sprite) {
    item.destroy();
  }
}
