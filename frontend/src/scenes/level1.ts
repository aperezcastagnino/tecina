import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";
import { TileType, type TileConfig } from "types/map.d";
import { PLAYER_KEYS } from "common/player-keys";
import { Animations } from "utils/animation-utils";
import {
  TileKeys,
  CharacterKeys,
  ItemKeys,
  UIComponentKeys,
} from "assets/asset-keys";

export const level1Config: TileConfig[] = [
  {
    tile: {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      asset: CharacterKeys.GUY.ASSET_KEY,
      frame: CharacterKeys.GUY.FRAME,
    },
    quantity: 1,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      asset: CharacterKeys.GIRL.ASSET_KEY,
      frame: CharacterKeys.GIRL.FRAME,
    },
    quantity: 1,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE,
      asset: TileKeys.GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE,
      asset: TileKeys.FLOWER_GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.OBSTACLE,
      asset: TileKeys.TREE,
    },
    frequency: 1,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: ItemKeys.FRUITS.ORANGE.ASSET_KEY,
    },
    quantity: 1,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: ItemKeys.FRUITS.STRAWBERRY.ASSET_KEY,
    },
    frequency: 5,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: ItemKeys.FRUITS.BANANAS.ASSET_KEY,
    },
    quantity: 2,
  },
];

export class Level1 extends BaseScene {
  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  async preload(): Promise<void> {
    await super.preload({ tilesConfig: level1Config });
  }

  async create(): Promise<void> {
    await super.create();

    this.hideElements(ItemKeys.FRUITS.ORANGE.ASSET_KEY);
    this.hideElements(ItemKeys.FRUITS.BANANAS.ASSET_KEY);

    this.showInstructionPopup();
  }

  protected createAnimations(): void {
    Animations.useOrangeAnimation(this);
    Animations.useStrawberryAnimation(this);
    Animations.useBananasAnimation(this);
  }

  protected setupCollisions(): void {
    super.setupCollisions();

    this.makeItemDraggable(ItemKeys.FRUITS.ORANGE.ASSET_KEY);
    this.makeItemDraggable(ItemKeys.FRUITS.STRAWBERRY.ASSET_KEY);
    this.makeItemDraggable(ItemKeys.FRUITS.BANANAS.ASSET_KEY);
  }

  private showInstructionPopup(): void {
    const { centerX, centerY } = this.cameras.main;

    const popupBackground = this.add.graphics();
    const popupWidth = 1100;
    const popupHeight = 600;
    const cornerRadius = 30;
    const backgroundAlpha = 0.6;

    popupBackground.fillStyle(0xfbc455, backgroundAlpha);
    popupBackground.fillRoundedRect(
      centerX - popupWidth / 2,
      centerY - popupHeight / 2 - 25,
      popupWidth,
      popupHeight,
      cornerRadius,
    );

    const popupImage = this.add
      .image(0, 0, UIComponentKeys.INSTRUCTIONS)
      .setScale(0.6);

    const closeButton = this.add
      .image(0, 0, UIComponentKeys.CROSS)
      .setScale(0.07)
      .setAlpha(0.5)
      .setInteractive();

    closeButton.x = popupWidth / 2 - 40;
    closeButton.y = -popupHeight / 2 + 20;

    const popupContainer = this.add.container(centerX, centerY, [
      popupImage,
      closeButton,
    ]);

    const closePopup = () => {
      popupContainer.destroy();
      popupBackground.destroy();
      Object.values(PLAYER_KEYS).forEach((key) => {
        this.input.keyboard?.off(`keydown-${key}`, closePopup);
      });
    };

    closeButton.on("pointerdown", closePopup);

    Object.values(PLAYER_KEYS).forEach((key) => {
      this.input.keyboard?.on(`keydown-${key}`, closePopup);
    });
  }
}
