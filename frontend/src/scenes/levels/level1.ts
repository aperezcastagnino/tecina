import { SceneKeys } from "scenes/scene-keys";
import { TileType } from "types/map.d";
import {
  TileKeys,
  CharacterKeys,
  ItemKeys,
  UIComponentKeys,
} from "assets/asset-keys";
import { Level } from "./level-creator";

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
    cornerRadius
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

  closeButton.on("pointerdown", () => {
    popupContainer.destroy();
    popupBackground.destroy();
  });
}

export const Level1 = new Level({
  name: SceneKeys.LEVEL_1,
  dimensions: {
    width: 100,
    height: 100,
  },
  tiles: [
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
        asset: ItemKeys.FRUITS.BANANAS.ASSET_KEY,
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
  ],
  itemsToAnimate: [ItemKeys.FRUITS.BANANAS],
  itemsToMakeDraggable: [ItemKeys.FRUITS.BANANAS],
  onCreate: (scene: Phaser.Scene) => {
    showInstructionPopup(scene);
  },
});
