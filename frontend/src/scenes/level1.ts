import { AssetKeys } from "assets/asset-keys";
import { AnimationsKeys } from "assets/animation-keys";
import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";

export class Level1 extends BaseScene {
  #collected_oranges = 0;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  create(): void {
    super.create();

    this._hideElements(
      this._map.assetGroups.get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!
    );
  }

  preload(): void {
    super.preload(SceneKeys.LEVEL_1);

    this.#createAnimations();
  }

  _defineBehaviors(): void {
    super._defineBehaviors();
  }

  _defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite): void {
    console.log("LEVEL 1");

    if (npc.name === "npc-1" && this._isObjectInBag) {
      this.#collected_oranges += 1;
      this._awards.setAwardsCount(this.#collected_oranges);
      this._objectBag!.destroy();
      this._isObjectInBag! = false;
      return;
    }

    this._dialog?.show(npc.name);

    const assetKey = this._dialog?.getAssetKey();
    if (!assetKey) return;

    const assetGroup = this._map.assetGroups.get(assetKey)!;

    if (assetGroup.countActive(true) === 0 && !this._dialog?.isQuestActive()) {
      this._showElements(assetGroup);
    } else if (assetGroup.countActive(true) === 0) {
      this._dialog?.setMessageComplete(npc.name);
    }
  }

  #defineBehaviorForItems(item: Phaser.GameObjects.Sprite): void {
    if (item.visible && !this._isObjectInBag) {
      this._isObjectInBag = true;
      this._objectBag = item;
      this.children.bringToTop(this._objectBag); // Este método mueve "top" al frente de la pila de renderizado
      if (item.body) {
        const body = item.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = true; // Deshabilitar las colisiones del objeto
      }
    }
  }

  #createAnimations(): void {
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
