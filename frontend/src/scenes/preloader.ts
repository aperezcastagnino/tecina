import { Scene } from "phaser";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { DebugConfig } from "../config/debug-config";
import { getAnimations } from "../utils/data-utils";

export class Preloader extends Scene {
  constructor() {
    super(SceneKeys.PRELOADER);
  }

  // init() {
  //   //  We loaded this image in our Boot Scene, so we can display it here
  //   this.add.image(512, 384, "background");

  //   //  A simple progress bar. This is the outline of the bar.
  //   this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

  //   //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
  //   const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

  //   //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
  //   this.load.on("progress", (progress: number) => {
  //     //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
  //     bar.width = 4 + 460 * progress;
  //   });
  // }

  preload() {
    console.log(`[${Preloader.name}:preload] INVOKED`);
    this.load.setPath("assets");

    this.load.image(
      AssetKeys.BACKGROUNDS.MAIN_MENU,
      `/backgrounds/main-menu-background.png`,
    );

    // load characters
    this.load.spritesheet(
      AssetKeys.CHARACTERS.PLAYER,
      `characters/player.png`,
      {
        frameWidth: 64,
        frameHeight: 88,
      },
    );

    // load json data
    this.load.json(AssetKeys.DATA.ANIMATIONS, "/data/animations.json");

    // level 1
    this.load.tilemapTiledJSON(AssetKeys.MAPS.LEVEL_1, `/maps/level1.json`);
    this.load.image(
      AssetKeys.LEVELS.TILESET,
      `/tilesets/tileset_sunnysideworld_16px.png`,
    );

    this.load.image(AssetKeys.UI.CURSOR, `/images/cursor.png`);

    // HealthBar
    this.load.image(
      AssetKeys.HEALTH_BAR.MIDDLE_SHADOW,
      "/healthBar/BarBackground.png",
    );
    this.load.image(
      AssetKeys.HEALTH_BAR.MIDDLE_GREEN,
      "/healthBar/GreenBar.png",
    );
    this.load.image(
      AssetKeys.HEALTH_BAR.MIDDLE_YELLOW,
      "/healthBar/YellowBar.png",
    );
    this.load.image(AssetKeys.HEALTH_BAR.MIDDLE_RED, "/healthBar/RedBar.png");
  }

  create() {
    this.#createAnimations();

    this.scene.start(
      DebugConfig.DEBUG_MODE_ACTIVE
        ? DebugConfig.FIRST_SCENE_TO_PLAY
        : SceneKeys.MAIN_MENU,
    );
  }

  #createAnimations() {
    const animations = getAnimations(this);
    animations.forEach((animation) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, {
            frames: animation.frames,
          })
        : this.anims.generateFrameNumbers(animation.assetKey);
      this.anims.create({
        key: animation.key,
        frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
        delay: animation.delay,
        yoyo: animation.yoyo,
      });
    });
  }
}
