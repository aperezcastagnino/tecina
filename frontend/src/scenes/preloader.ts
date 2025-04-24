import { Scene } from "phaser";
import { DEBUG_MODE_ACTIVE, FIRST_SCENE_TO_PLAY } from "config";
import { AnimationManager } from "managers/animation-manager";
import {
  ItemAssets,
  BackgroundKeys,
  CharacterKeys,
  TileKeys,
  UIComponentKeys,
} from "assets/assets";
import { PlayerAnimationKeys } from "common/player";
import { SceneKeys } from "./scene-keys";

export class Preloader extends Scene {
  constructor() {
    super(SceneKeys.PRELOADER);
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets");

    // Backgrounds
    this.load.image(
      BackgroundKeys.MAIN_MENU,
      `/backgrounds/main-menu-background.png`,
    );

    this.load.image(
      BackgroundKeys.LEVELS,
      `/backgrounds/levels-background.png`,
    );

    // Load data
    this.load.json("level_1", "/data/level_1.json");

    // Level 1

    // Load Characters
    this.load.spritesheet(CharacterKeys.PLAYER, `characters/player.png`, {
      frameWidth: 64,
      frameHeight: 88,
    });
    this.load.spritesheet(CharacterKeys.NPC, `characters/characters.png`, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Load UI Components
    this.load.image(UIComponentKeys.CURSOR, "/ui-components/cursor.png");
    this.load.image(
      UIComponentKeys.HEALTH_BAR.BACKGROUND.ASSET_KEY,
      "/ui-components/health-bar-background.png",
    );
    this.load.image(
      UIComponentKeys.HEALTH_BAR.LEFT.ASSET_KEY,
      "/ui-components/health-bar-fill-left.png",
    );
    this.load.image(
      UIComponentKeys.HEALTH_BAR.RIGHT.ASSET_KEY,
      "/ui-components/health-bar-fill-right.png",
    );
    this.load.image(
      UIComponentKeys.BUTTON_CIRCLE,
      "/ui-components/button-circle.png",
    );
    this.load.image(UIComponentKeys.TITLE, `/ui-components/title.png`);

    this.load.image(
      UIComponentKeys.START_BUTTON,
      "/ui-components/start-button.png",
    );
    this.load.image(
      UIComponentKeys.LOAD_BUTTON,
      "/ui-components/load-button.png",
    );
    this.load.image(
      UIComponentKeys.BUTTON_SHADOW,
      "/ui-components/button-shadow.png",
    );
    this.load.image(UIComponentKeys.CROSS, "/ui-components/cross.png");
    this.load.image(
      UIComponentKeys.INSTRUCTIONS,
      "/ui-components/instructions.png",
    );
    this.load.image(UIComponentKeys.GAME_OVER, "/ui-components/game-over.png");
    this.load.image(UIComponentKeys.WIN_TITLE, "/ui-components/win-title.png");

    // Load tiles
    this.load.image(TileKeys.GRASS, "/tiles/grass.png");
    this.load.image(TileKeys.TREE, "/tiles/tree.png");
    this.load.image(TileKeys.FLOWER_GRASS, "/tiles/flower_grass.png");

    // Load elements
    this.loadFruits();
  }

  create() {
    this.createAnimations();

    this.scene.start(
      DEBUG_MODE_ACTIVE ? FIRST_SCENE_TO_PLAY : SceneKeys.MAIN_MENU,
    );
  }

  private createAnimations() {
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_UP,
      CharacterKeys.PLAYER,
      [0, 1, 2],
    );
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_RIGHT,
      CharacterKeys.PLAYER,
      [3, 4, 5],
    );
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_DOWN,
      CharacterKeys.PLAYER,
      [6, 7, 8],
    );
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_LEFT,
      CharacterKeys.PLAYER,
      [9, 10, 11],
    );
  }

  private loadFruits() {
    this.load.spritesheet(
      ItemAssets.APPLE.assetKey,
      "/items/fruits/apple.png",
      {
        frameWidth: ItemAssets.APPLE.frameWidth,
        frameHeight: ItemAssets.APPLE.frameHeight,
        startFrame: ItemAssets.APPLE.starFrame,
        endFrame: ItemAssets.APPLE.endFrame,
      },
    );
    this.load.spritesheet(
      ItemAssets.BANANAS.assetKey,
      "/items/fruits/bananas.png",
      {
        frameWidth: ItemAssets.BANANAS.frameWidth,
        frameHeight: ItemAssets.BANANAS.frameHeight,
        startFrame: ItemAssets.BANANAS.starFrame,
        endFrame: ItemAssets.BANANAS.endFrame,
      },
    );
    this.load.spritesheet(
      ItemAssets.CHERRIES.assetKey,
      "/items/fruits/cherries.png",
      {
        frameWidth: ItemAssets.CHERRIES.frameWidth,
        frameHeight: ItemAssets.CHERRIES.frameHeight,
        startFrame: ItemAssets.CHERRIES.starFrame,
        endFrame: ItemAssets.CHERRIES.endFrame,
      },
    );
    this.load.spritesheet(ItemAssets.KIWI.assetKey, "/items/fruits/kiwi.png", {
      frameWidth: ItemAssets.KIWI.frameWidth,
      frameHeight: ItemAssets.KIWI.frameHeight,
      startFrame: ItemAssets.KIWI.starFrame,
      endFrame: ItemAssets.KIWI.endFrame,
    });
    this.load.spritesheet(
      ItemAssets.MELON.assetKey,
      "/items/fruits/melon.png",
      {
        frameWidth: ItemAssets.MELON.frameWidth,
        frameHeight: ItemAssets.MELON.frameHeight,
        startFrame: ItemAssets.MELON.starFrame,
        endFrame: ItemAssets.MELON.endFrame,
      },
    );
    this.load.spritesheet(
      ItemAssets.ORANGE.assetKey,
      "/items/fruits/orange.png",
      {
        frameWidth: ItemAssets.ORANGE.frameWidth,
        frameHeight: ItemAssets.ORANGE.frameHeight,
        startFrame: ItemAssets.ORANGE.starFrame,
        endFrame: ItemAssets.ORANGE.endFrame,
      },
    );
    this.load.spritesheet(
      ItemAssets.PINEAPPLE.assetKey,
      "/items/fruits/pineapple.png",
      {
        frameWidth: ItemAssets.PINEAPPLE.frameWidth,
        frameHeight: ItemAssets.PINEAPPLE.frameHeight,
        startFrame: ItemAssets.PINEAPPLE.starFrame,
        endFrame: ItemAssets.PINEAPPLE.endFrame,
      },
    );
    this.load.spritesheet(
      ItemAssets.STRAWBERRY.assetKey,
      "/items/fruits/strawberry.png",
      {
        frameWidth: ItemAssets.STRAWBERRY.frameWidth,
        frameHeight: ItemAssets.STRAWBERRY.frameHeight,
        startFrame: ItemAssets.STRAWBERRY.starFrame,
        endFrame: ItemAssets.STRAWBERRY.endFrame,
      },
    );

    // Animals
  }
}
