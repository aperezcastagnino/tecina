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
    super._defineBehaviors();
  }

  _defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite) {
    super._defineBehaviorForNPCs(npc);
  }

  _defineBehaviorForAwards(award: Phaser.GameObjects.Sprite) {
    super._defineBehaviorForAwards(award);
  }
}
