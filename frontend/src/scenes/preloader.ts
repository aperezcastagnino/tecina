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
import { SceneKeys } from "./scene-keys";

export default class Preloader extends Scene {
  constructor() {
    super(SceneKeys.PRELOADER);
  }

  init(): void {
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
    this.createPlayerAnimations();

    this.scene.start(
      DEBUG_MODE_ACTIVE ? FIRST_SCENE_TO_PLAY : SceneKeys.MAIN_MENU,
    );
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
