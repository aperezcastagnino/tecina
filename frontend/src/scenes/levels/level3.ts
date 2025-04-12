import { SceneKeys } from "scenes/scene-keys";
import { BaseLevelScene } from "scenes/levels/base-level-scene";
import { TileType, type TileConfig } from "types/map.d";
import { CharacterKeys } from "assets/asset-keys";

export const level3Config: TileConfig[] = [
    {
        tile: {
          type: TileType.INTERACTIVE_STATIC_OBJECT,
          asset: CharacterKeys.GUY.ASSET_KEY,
          frame: CharacterKeys.GUY.FRAME,
        },
        quantity: 1,
      },
];

export class Level3 extends BaseLevelScene {
  constructor() {
    super(SceneKeys.LEVEL_3);
  }

  async preload(): Promise<void> {
    await super.preload({ tilesConfig: level3Config });
  }

  async create(): Promise<void> {
    await super.create();
  }

  protected createAnimations(): void {
  }

  protected setupCollisions(): void {
  }
}
