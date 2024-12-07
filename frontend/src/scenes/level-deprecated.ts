import { BaseTiledScene } from "./base-tiled-scene";
import { SceneKeys } from "./scene-keys";

export class LevelDeprecated extends BaseTiledScene {
  constructor() {
    super(SceneKeys.LEVEL_DEPRECATED);
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
