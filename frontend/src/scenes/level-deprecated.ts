import { BaseScene } from "./base-scene";
import { SceneKeys } from "./scene-keys";

export class LevelDeprecated extends BaseScene {
  constructor() {
    super(SceneKeys.LEVEL_DEPRECATED);
  }

  create() {
    super.create();
  }

  _defineBehaviors() {
    // eslint-disable-next-line no-underscore-dangle
    super._defineBehaviors();
  }

  _defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite) {
    // eslint-disable-next-line no-underscore-dangle
    super._defineBehaviorForNPCs(npc);
  }

  _defineBehaviorForAwards(award: Phaser.GameObjects.Sprite) {
    // eslint-disable-next-line no-underscore-dangle
    super._defineBehaviorForAwards(award);
  }
}
