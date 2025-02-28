import { AssetKeys } from "assets/asset-keys";
import { AnimationsKeys } from "assets/animation-keys";
import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";

export class Level1 extends BaseScene {
  #collected_items = 0;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  create(): void {
    super.create();

    this.hideElements(
      this.map.assetGroups.get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!
    );
  }

  preload(): void {
    super.preload(SceneKeys.LEVEL_1);
  }

  defineBehaviors(): void {
    super.defineBehaviors();

    const fruitsGroup = this.map.assetGroups.get(
      AssetKeys.ITEMS.FRUITS.ORANGE.NAME
    )!;
    this.physics.add.collider(this.player, fruitsGroup, (_player, item) => {
      const itemObject = item as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForItems(itemObject);
    });

    console.log("total items: ", fruitsGroup.getChildren().length);
  }

  defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite): void {
    if (!this.dialog?.isDialogActive()) {
      this.dialog?.show(npc.name);

      const assetKey = this.dialog?.getAssetKey()!;
      if (!assetKey) return;

      const assetGroup = this.map.assetGroups.get(assetKey)!;
      this.showElements(assetGroup);
      this.awards.setAwardsCount(this.dialog?.getQuantityToCollect() || 0);
      this.#collected_items = this.dialog?.getQuantityToCollect() || 0;
    } else if (this.objectBag) {
      const assetKey = this.dialog?.getAssetKey()!;
      if (
        assetKey === this.objectBag.texture.key &&
        this.dialog?.getQuestGiverNpcId() === npc.name
      ) {
        this.#collected_items -= 1;
        this.awards.setAwardsCount(this.#collected_items);
        this.objectBag.destroy();
        this.objectBag = undefined;

        if (this.#collected_items === 0) {
          this.dialog?.setMessageComplete(npc.name);
          this.dialog?.show(npc.name);
        }
      } else {
        this.dialog?.show(npc.name);
      }
    }
  }

  #defineBehaviorForItems(item: Phaser.GameObjects.Sprite): void {
    if (item.visible && !this.objectBag) {
      this.objectBag = item;
      this.children.bringToTop(this.objectBag);
      if (item.body) {
        const body = item.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = true;
      }
    }
  }

  createAnimations(): void {
    this.anims.create({
      key: AnimationsKeys.ORANGE,
      frames: this.anims.generateFrameNumbers(
        AssetKeys.ITEMS.FRUITS.ORANGE.NAME
      ),
      frameRate: 19,
      repeat: -1,
    });
  }
}
