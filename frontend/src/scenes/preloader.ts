import { Scene } from "phaser";
import { AssetKeys } from "assets/asset-keys";
import { AnimationsKeys } from "assets/animation-keys";
import { DEBUG_MODE_ACTIVE, FIRST_SCENE_TO_PLAY } from "config/config";
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
      AssetKeys.BACKGROUNDS.MAIN_MENU,
      `/backgrounds/main-menu-background.png`,
    );

    // Load data
    this.load.json("level_1", "/data/level_1.json");
    this.load.json("level_deprecated", "/data/level_deprecated.json");

    // Level 1

    // Load Characters
    this.load.spritesheet(
      AssetKeys.CHARACTERS.PLAYER,
      `characters/player.png`,
      {
        frameWidth: 64,
        frameHeight: 88,
      },
    );
    this.load.spritesheet(
      AssetKeys.CHARACTERS.NPC,
      `characters/characters.png`,
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    // Load UI Components
    this.load.image(
      AssetKeys.UI_COMPONENTS.CURSOR,
      `/ui-components/cursor.png`,
    );

    // Healthar
    this.load.image(
      AssetKeys.HEALTH_BAR.MIDDLE_SHADOW,
      "/health-bar/bar-background.png",
    );
    this.load.image(
      AssetKeys.HEALTH_BAR.MIDDLE_GREEN,
      "/health-bar/green-bar.png",
    );
    this.load.image(
      AssetKeys.HEALTH_BAR.MIDDLE_YELLOW,
      "/health-bar/yellow-bar.png",
    );
    this.load.image(AssetKeys.HEALTH_BAR.MIDDLE_RED, "/health-bar/red-bar.png");

    // Load tiles
    this.load.image(AssetKeys.TILES.GRASS, "/tiles/grass.png");
    this.load.image(AssetKeys.TILES.FLOWER, "/tiles/flower.png");
    this.load.image(AssetKeys.TILES.TREE, "/tiles/tree.png");
    this.load.image(AssetKeys.TILES.FLOWER_GRASS, "/tiles/flower_grass.png");

    // Load items
    this.load.spritesheet(
      AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      "/items/fruits/orange.png",
      {
        frameWidth: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_WIDTH,
        frameHeight: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_HEIGHT,
        startFrame: AssetKeys.ITEMS.FRUITS.ORANGE.STAR_FRAME,
        endFrame: AssetKeys.ITEMS.FRUITS.ORANGE.END_FRAME,
      },
    );

    this.load.spritesheet(
      AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      "/items/fruits/apple.png",
      {
        frameWidth: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_WIDTH,
        frameHeight: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_HEIGHT,
        startFrame: AssetKeys.ITEMS.FRUITS.ORANGE.STAR_FRAME,
        endFrame: AssetKeys.ITEMS.FRUITS.ORANGE.END_FRAME,
      },
    );

  }

  create() {
    this.#createAnimations();

    this.scene.start(
      DEBUG_MODE_ACTIVE ? FIRST_SCENE_TO_PLAY : SceneKeys.MAIN_MENU,
    );
  }

  #createAnimations() {
    this.#createPlayerAnimation(
      AnimationsKeys.PLAYER_UP,
      AssetKeys.CHARACTERS.PLAYER,
      [0, 1, 2],
    );
    this.#createPlayerAnimation(
      AnimationsKeys.PLAYER_RIGHT,
      AssetKeys.CHARACTERS.PLAYER,
      [3, 4, 5],
    );
    this.#createPlayerAnimation(
      AnimationsKeys.PLAYER_DOWN,
      AssetKeys.CHARACTERS.PLAYER,
      [6, 7, 8],
    );
    this.#createPlayerAnimation(
      AnimationsKeys.PLAYER_LEFT,
      AssetKeys.CHARACTERS.PLAYER,
      [9, 10, 11],
    );
  }

  #createPlayerAnimation(key: string, asseyKey: string, frames: number[]) {
    this.anims.create({
      key,
      frames: this.anims.generateFrameNumbers(asseyKey, {
        frames,
      }),
      frameRate: 6,
      repeat: -1,
      delay: 0,
      yoyo: true,
    });
  }
}
