import { Scene } from "phaser";
import { DEBUG_MODE_ACTIVE, FIRST_SCENE_TO_PLAY } from "../config/debug-config";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { getAnimations } from "../utils/data-utils";

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
    this.load.spritesheet(
      AssetKeys.CHARACTERS.NPC,
      `characters/characters.png`,
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    // load json data
    this.load.json(AssetKeys.DATA.ANIMATIONS, "/data/animations.json");

    // level 1
    this.load.tilemapTiledJSON(AssetKeys.MAPS.LEVEL_2, `/maps/level1.json`);
    this.load.image(
      AssetKeys.LEVELS.TILESET.KEY,
      `/tilesets/tileset_sunnysideworld_16px.png`,
    );

    this.load.image(AssetKeys.UI.CURSOR, `/images/cursor.png`);

    this.load.spritesheet(
      AssetKeys.UI.HALLOWEEN_EYE_AWARD.NAME,
      "/objects/anim_eye.png",
      {
        frameWidth: 150,
        frameHeight: 150,
        startFrame: 0,
        endFrame: 15,
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
