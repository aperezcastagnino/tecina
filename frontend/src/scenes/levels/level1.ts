import { SceneKeys } from "scenes/scene-keys";
import { ItemState, TileType } from "types/map.d";
import {
  TileKeys,
  CharacterAssets,
  UIComponentKeys,
  ItemAssets,
} from "assets/assets";
import { PLAYER_KEYS } from "common/player-keys";
import { Level } from "./level-maker";

function showInstructionPopup(scene: Phaser.Scene): void {
  const { centerX, centerY } = scene.cameras.main;

  const popupBackground = scene.add.graphics();
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

  const popupImage = scene.add
    .image(0, 0, UIComponentKeys.INSTRUCTIONS)
    .setScale(0.6);

  const closeButton = scene.add
    .image(0, 0, UIComponentKeys.CROSS)
    .setScale(0.07)
    .setAlpha(0.5)
    .setInteractive();

  closeButton.x = popupWidth / 2 - 40;
  closeButton.y = -popupHeight / 2 + 20;

  const popupContainer = scene.add.container(centerX, centerY, [
    popupImage,
    closeButton,
  ]);

  const closePopup = () => {
    popupContainer.destroy();
    popupBackground.destroy();
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
      assetKey: ItemAssets.BANANAS.assetKey,
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
