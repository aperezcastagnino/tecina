import { Scene } from "phaser";
import { DEBUG_MODE_ACTIVE, FIRST_SCENE_TO_PLAY } from "config/config";
import { Animations } from "utils/animation-utils";
import {
  BackgroundKeys,
  CharacterKeys,
  ItemKeys,
  TileKeys,
  UIComponentKeys,
} from "assets/asset-keys";
import { PlayerAnimationKeys } from "common/player";
import {
  LOADING_SCREEN_PERCENT_TEXT_STYLE,
  LOADING_SCREEN_TEXT_STYLE,
} from "styles/loading-styles";
import { SceneKeys } from "./scene-keys";

export class Preloader extends Scene {
  private progressBar!: Phaser.GameObjects.Graphics;

  private progressBox!: Phaser.GameObjects.Graphics;

  private loadingText!: Phaser.GameObjects.Text;

  private percentText!: Phaser.GameObjects.Text;

  private currentProgress: number = 0;

  private targetProgress: number = 0;

  private assetsLoaded = false;

  constructor() {
    super(SceneKeys.PRELOADER);
  }

  init() {
    this.cameras.main.setBackgroundColor("#a6af48");

    const { centerX, centerY } = this.cameras.main;

    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.2);
    this.progressBox.fillRect(centerX - 240, centerY - 20, 480, 40);

    this.progressBar = this.add.graphics();

    this.loadingText = this.make
      .text({
        x: centerX,
        y: centerY - 50,
        text: "Loading...",
        style: LOADING_SCREEN_TEXT_STYLE,
      })
      .setOrigin(0.5, 0.5);

    this.percentText = this.make
      .text({
        x: centerX,
        y: centerY,
        text: "0%",
        style: LOADING_SCREEN_PERCENT_TEXT_STYLE,
      })
      .setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      this.targetProgress = value;
    });

    this.load.once("complete", () => {
      this.assetsLoaded = true;
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
    this.load.image(
      UIComponentKeys.BUTTON_SHADOW,
      "/ui-components/button-shadow.png",
    );
    this.load.image(UIComponentKeys.CROSS, "/ui-components/cross.png");
    this.load.image(
      UIComponentKeys.INSTRUCTIONS,
      "/ui-components/instructions.png",
    );

    // Load tiles
    this.load.image(TileKeys.GRASS, "/tiles/grass.png");
    this.load.image(TileKeys.TREE, "/tiles/tree.png");
    this.load.image(TileKeys.FLOWER_GRASS, "/tiles/flower_grass.png");

    // Load elements
    this.loadFruits();
  }

  create() {
    // delay to see the bar
    if (this.assetsLoaded) {
      this.time.delayedCall(2000, () => {
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
        this.percentText.destroy();

        this.createAnimations();

        this.scene.start(
          DEBUG_MODE_ACTIVE ? FIRST_SCENE_TO_PLAY : SceneKeys.MAIN_MENU,
        );
      });
    }
  }

  update() {
    const { centerX, centerY } = this.cameras.main;

    const speed = 0.05;
    this.currentProgress = Phaser.Math.Linear(
      this.currentProgress,
      this.targetProgress,
      speed,
    );

    this.progressBar.clear();
    this.progressBar.fillStyle(0x000000, 1);
    this.progressBar.fillRect(
      centerX - 230,
      centerY - 16,
      460 * this.currentProgress,
      32,
    );

    this.percentText.setText(`${Math.floor(this.currentProgress * 100)}%`);
  }

  private createAnimations() {
    Animations.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_UP,
      CharacterKeys.PLAYER,
      [0, 1, 2],
    );
    Animations.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_RIGHT,
      CharacterKeys.PLAYER,
      [3, 4, 5],
    );
    Animations.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_DOWN,
      CharacterKeys.PLAYER,
      [6, 7, 8],
    );
    Animations.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_LEFT,
      CharacterKeys.PLAYER,
      [9, 10, 11],
    );
  }

  private loadFruits() {
    this.load.spritesheet(
      ItemKeys.FRUITS.APPLE.ASSET_KEY,
      "/items/fruits/apple.png",
      {
        frameWidth: ItemKeys.FRUITS.APPLE.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.APPLE.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.APPLE.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.APPLE.END_FRAME,
      },
    );
    this.load.spritesheet(
      ItemKeys.FRUITS.BANANAS.ASSET_KEY,
      "/items/fruits/bananas.png",
      {
        frameWidth: ItemKeys.FRUITS.BANANAS.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.BANANAS.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.BANANAS.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.BANANAS.END_FRAME,
      },
    );
    this.load.spritesheet(
      ItemKeys.FRUITS.CHERRIES.ASSET_KEY,
      "/items/fruits/cherries.png",
      {
        frameWidth: ItemKeys.FRUITS.CHERRIES.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.CHERRIES.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.CHERRIES.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.CHERRIES.END_FRAME,
      },
    );
    this.load.spritesheet(
      ItemKeys.FRUITS.KIWI.ASSET_KEY,
      "/items/fruits/kiwi.png",
      {
        frameWidth: ItemKeys.FRUITS.KIWI.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.KIWI.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.KIWI.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.KIWI.END_FRAME,
      },
    );
    this.load.spritesheet(
      ItemKeys.FRUITS.MELON.ASSET_KEY,
      "/items/fruits/melon.png",
      {
        frameWidth: ItemKeys.FRUITS.MELON.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.MELON.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.MELON.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.MELON.END_FRAME,
      },
    );
    this.load.spritesheet(
      ItemKeys.FRUITS.ORANGE.ASSET_KEY,
      "/items/fruits/orange.png",
      {
        frameWidth: ItemKeys.FRUITS.ORANGE.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.ORANGE.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.ORANGE.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.ORANGE.END_FRAME,
      },
    );
    this.load.spritesheet(
      ItemKeys.FRUITS.PINEAPPLE.ASSET_KEY,
      "/items/fruits/pineapple.png",
      {
        frameWidth: ItemKeys.FRUITS.PINEAPPLE.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.PINEAPPLE.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.PINEAPPLE.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.PINEAPPLE.END_FRAME,
      },
    );
    this.load.spritesheet(
      ItemKeys.FRUITS.STRAWBERRY.ASSET_KEY,
      "/items/fruits/strawberry.png",
      {
        frameWidth: ItemKeys.FRUITS.STRAWBERRY.FRAME_WIDTH,
        frameHeight: ItemKeys.FRUITS.STRAWBERRY.FRAME_HEIGHT,
        startFrame: ItemKeys.FRUITS.STRAWBERRY.STAR_FRAME,
        endFrame: ItemKeys.FRUITS.STRAWBERRY.END_FRAME,
      },
    );
  }
}
