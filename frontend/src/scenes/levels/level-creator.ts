import type { LevelConfig } from "types/level";
import { Animations } from "utils/animation-utils";
import { BaseLevelScene } from "./base-level-scene";

export class Level extends BaseLevelScene {
  private params: LevelConfig;

  constructor(params: LevelConfig) {
    super(params.name);
    this.params = params;
  }

  protected async preload(): Promise<void> {
    await super.preload({
      name: this.scene.key,
      tilesConfig: this.params.tilesConfig,
      dimensions: this.params.dimensions,
    });
  }

  async create(): Promise<void> {
    await super.create();

    this.params.itemsToHide?.forEach((item: string) => {
      this.hideElements(item);
    });
  }

  protected createAnimations(): void {
    this.params.itemsToAnimate?.forEach((item: string) => {
      Animations.animateItem(this, item);
    });
  }

  protected setupCollisions(): void {
    super.setupCollisions();

    this.params.itemsToMakeDraggable?.forEach((item: string) => {
      this.makeItemDraggable(item);
    });
  }
}
