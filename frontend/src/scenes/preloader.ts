import { Scene } from "phaser";
import { DEBUG_MODE_ACTIVE, FIRST_SCENE_TO_PLAY } from "config";
import { AnimationManager } from "managers/animation-manager";
import {
  ItemAssets,
  BackgroundKeys,
  CharacterAssets,
  TileKeys,
  UIComponentKeys,
  AnimalAssets,
  FruitAssets,
} from "assets/assets";
import { PlayerAnimationKeys } from "common/player";
import {
  LOADING_SCREEN_PERCENT_TEXT_STYLE,
  LOADING_SCREEN_TEXT_STYLE,
} from "styles/loading-styles";
import { SceneKeys } from "./scene-keys";

export default class Preloader extends Scene {
  private progressBar!: Phaser.GameObjects.Graphics;

  private percentText!: Phaser.GameObjects.Text;

  private currentProgress: number = 0;

  private targetProgress: number = 0;

  private PROGRESS_BAR_VELOCITY = 0.05;

  private assetsLoaded = false;

  constructor() {
    super(SceneKeys.PRELOADER);
  }

  init(): void {
    this.cameras.main.setBackgroundColor("#a6af48");

    const { centerX, centerY } = this.cameras.main;

    this.add
      .graphics()
      .fillStyle(0x222222, 0.2)
      .fillRect(centerX - 240, centerY - 20, 480, 40);
    this.progressBar = this.add.graphics();

    this.make
      .text({
        x: centerX,
        y: centerY - 50,
        text: "Cargando...",
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
    this.load.json("level_2", "/data/level_2.json");
    this.load.json("level_3", "/data/level_3.json");

    // Load Characters
    this.load.spritesheet(CharacterAssets.PLAYER, `characters/player.png`, {
      frameWidth: 64,
      frameHeight: 88,
    });
    this.load.spritesheet(CharacterAssets.NPC, `characters/characters.png`, {
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
    this.loadAnimals();
  }

  create(): void {
    // delay to see the bar
    this.time.delayedCall(2000, () => {
      this.createPlayerAnimations();

      this.scene.start(
        DEBUG_MODE_ACTIVE ? FIRST_SCENE_TO_PLAY : SceneKeys.MAIN_MENU,
      );
    });
  }

  update() {
    const { centerX, centerY } = this.cameras.main;

    this.currentProgress = Phaser.Math.Linear(
      this.currentProgress,
      this.targetProgress,
      this.PROGRESS_BAR_VELOCITY,
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

  private createPlayerAnimations() {
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_UP,
      CharacterAssets.PLAYER,
      [0, 1, 2],
    );
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_RIGHT,
      CharacterAssets.PLAYER,
      [3, 4, 5],
    );
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_DOWN,
      CharacterAssets.PLAYER,
      [6, 7, 8],
    );
    AnimationManager.createPlayerAnimation(
      this,
      PlayerAnimationKeys.PLAYER_LEFT,
      CharacterAssets.PLAYER,
      [9, 10, 11],
    );
  }

  private loadFruits() {
    const fruits = Object.keys(FruitAssets);
    fruits.forEach((fruit) =>
      this.loadContent("/items/fruits", fruit as keyof typeof FruitAssets),
    );
  }

  private loadAnimals() {
    const animals = Object.keys(AnimalAssets);
    animals.forEach((animal) =>
      this.loadContent("/items/animals", animal as keyof typeof AnimalAssets),
    );
  }

  private loadContent(
    pathFile: string,
    assetKey: keyof typeof ItemAssets,
  ): void {
    this.load.spritesheet(
      ItemAssets[assetKey].assetKey,
      `${pathFile}/${assetKey.toLowerCase()}.png`,
      {
        frameWidth: ItemAssets[assetKey].frameWidth,
        frameHeight: ItemAssets[assetKey].frameHeight,
        startFrame: ItemAssets[assetKey].starFrame,
        endFrame: ItemAssets[assetKey].endFrame,
      },
    );
  }
}
