import { SceneKeys } from "scenes/scene-keys";
import { ItemState, TileType } from "types/map.d";
import {
  TileKeys,
  CharacterAssets,
  UIComponentKeys,
  ItemAssets,
} from "assets/assets";
import { PLAYER_KEYS } from "common/player-keys";
import { BoxColors } from "assets/colors";
import { FontSize, FontColor, FontFamily } from "assets/fonts";
import { Level } from "./level-maker";

function showInstructionPopup(scene: Phaser.Scene): void {
  const { centerX, centerY } = scene.cameras.main;

  const overlay = scene.add
    .rectangle(
      0,
      0,
      scene.cameras.main.width * 2,
      scene.cameras.main.height * 2,
      0x000000,
      0.5,
    )
    .setOrigin(0)
    .setScrollFactor(0);

  const popupBackground = scene.add.graphics();
  const popupWidth = 1100;
  const popupHeight = 900;
  const cornerRadius = 0.1;
  const backgroundAlpha = 0.8;

  for (let i = 0; i < 5; i += 1) {
    popupBackground.fillStyle(0x000000, 0.1 - i * 0.015);
    popupBackground.fillRoundedRect(
      centerX - popupWidth / 2 + i * 4,
      centerY - popupHeight / 2 + i * 4,
      popupWidth,
      popupHeight,
      cornerRadius,
    );
  }

  popupBackground.fillStyle(0xa37936, backgroundAlpha);
  popupBackground.fillRoundedRect(
    centerX - popupWidth / 2,
    centerY - popupHeight / 2 - 25,
    popupWidth,
    popupHeight,
    cornerRadius,
  );

  const howToPlayImage = scene.add
    .image(
      centerX - popupWidth / 2 - 400,
      centerY - popupHeight / 2 - 400,
      UIComponentKeys.HOW_TO_PLAY,
    )
    .setScale(0.7)
    .setScrollFactor(0);

  const instructionsBox = scene.add
    .rectangle(
      centerX - popupWidth / 2 - 400,
      centerY - popupHeight / 2 - 190,
      850,
      200,
      BoxColors.main,
      0.9,
    )
    .setStrokeStyle(8, BoxColors.border, 1)
    .setScrollFactor(0);

  const instructionsText = scene.add
    .text(
      centerX - popupWidth / 2 - 790,
      centerY - popupHeight / 2 - 250,
      "FIND THE CHARACTER IN THE MAP, INTERACT WITH THEM AND THEY WILL TELL YOU WHAT TO DO NEXT",
      {
        fontFamily: FontFamily.PRIMARY,
        color: FontColor.YELLOW,
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: 850 - 18 },
      },
    )
    .setScrollFactor(0);

  const arrowsBox = scene.add
    .rectangle(
      centerX - popupWidth - 75,
      centerY - popupHeight + 550,
      400,
      300,
      BoxColors.main,
      0.9,
    )
    .setStrokeStyle(8, BoxColors.border, 1)
    .setScrollFactor(0);

  const arrowsText = scene.add
    .text(
      centerX - popupWidth / 2 - 790,
      centerY - popupHeight / 2,
      "USE THE ARROWS TO MOVE IN THE MAP",
      {
        fontFamily: FontFamily.PRIMARY,
        color: FontColor.YELLOW,
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: 380 - 18 },
      },
    )
    .setScrollFactor(0);

  const arrowsImage = scene.add
    .image(
      centerX - popupWidth - 75,
      centerY - popupHeight + 600,
      UIComponentKeys.ARROWS,
    )
    .setScale(0.18)
    .setScrollFactor(0);

  const interactionBox = scene.add
    .rectangle(
      centerX - popupWidth + 375,
      centerY - popupHeight + 550,
      400,
      300,
      BoxColors.main,
      0.9,
    )
    .setStrokeStyle(8, BoxColors.border, 1)
    .setScrollFactor(0);

  const interactionText = scene.add
    .text(
      centerX - popupWidth / 2 - 330,
      centerY - popupHeight / 2,
      "PRESS SPACE BAR TO INTERACT",
      {
        fontFamily: FontFamily.PRIMARY,
        color: FontColor.YELLOW,
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: 380 - 18 },
      },
    )
    .setScrollFactor(0);

  const spaceImage = scene.add
    .image(
      centerX - popupWidth + 375,
      centerY - popupHeight + 600,
      UIComponentKeys.SPACE,
    )
    .setScale(0.18)
    .setScrollFactor(0);

  const closeButton = scene.add
    .image(0, 0, UIComponentKeys.CROSS)
    .setScale(0.07)
    .setAlpha(0.5)
    .setInteractive();

  closeButton.x = popupWidth / 2 - 40;
  closeButton.y = -popupHeight / 2 + 20;

  const popupContainer = scene.add.container(centerX, centerY, [
    closeButton,
    howToPlayImage,
    instructionsBox,
    arrowsBox,
    arrowsImage,
    interactionBox,
    instructionsText,
    arrowsText,
    interactionText,
    spaceImage,
  ]);

  const closePopup = () => {
    popupContainer.destroy();
    popupBackground.destroy();
    overlay.destroy();
    Object.values(PLAYER_KEYS).forEach((key) => {
      scene.input.keyboard?.off(`keydown-${key}`, closePopup);
    });
  };

  closeButton.on("pointerdown", closePopup);

  Object.values(PLAYER_KEYS).forEach((key) => {
    scene.input.keyboard?.on(`keydown-${key}`, closePopup);
  });
}

export default new Level({
  name: SceneKeys.LEVEL_1,
  tilesConfig: [
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.GUY.ASSET_KEY,
      frame: CharacterAssets.GUY.FRAME,
      quantity: 1,
    },
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.GIRL.ASSET_KEY,
      frame: CharacterAssets.GIRL.FRAME,
      quantity: 1,
    },
    {
      type: TileType.WALKABLE_SPACE,
      assetKey: TileKeys.GRASS,
      frequency: 50,
    },
    {
      type: TileType.WALKABLE_SPACE,
      assetKey: TileKeys.FLOWER_GRASS,
      frequency: 50,
    },
    {
      type: TileType.OBSTACLE,
      assetKey: TileKeys.TREE,
      frequency: 3,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.APPLE.assetKey,
      quantity: 1,
      initialState: ItemState.HIDDEN,
      isAnimated: true,
    },
  ],
  defaultFloorAsset: {
    type: TileType.WALKABLE_SPACE,
    assetKey: TileKeys.GRASS,
  },
  onCreate: async (scene: Phaser.Scene) => {
    showInstructionPopup(scene);
  },
});
