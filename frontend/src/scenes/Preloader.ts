import { Scene } from "phaser";
import { SceneKeys } from "./SceneKeys";
import { AssetKeys } from "../assets/AssetKeys";
import { DIRECTION } from "../common/Direction";
import { DebugConfig } from "../config/DebugConfig";

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
      `/backgrounds/main-menu-background.png`
    );

    // load characters
    this.load.spritesheet(
      AssetKeys.CHARACTERS.PLAYER,
      `characters/player.png`,
      {
        frameWidth: 64,
        frameHeight: 88,
      }
    );

    // level 1
    this.load.tilemapTiledJSON(AssetKeys.MAPS.LEVEL_1, `/maps/level1.json`);
    this.load.image(
      AssetKeys.LEVELS.TILESET,
      `/tilesets/tileset_sunnysideworld_16px.png`
    );
  }

  create() {
    this.#createPlayerAnimations();

    this.scene.start(
      DebugConfig.DEBUG_MODE_ACTIVE
        ? DebugConfig.FIRST_SCENE_TO_PLAY
        : SceneKeys.MAIN_MENU
    );
  }

  #createPlayerAnimations() {
    const frameRate = 1;

    this.anims.create({
      key: `${AssetKeys.CHARACTERS.PLAYER}_${DIRECTION.LEFT}`,
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 9,
        end: 11,
      }),
      frameRate: frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: `${AssetKeys.CHARACTERS.PLAYER}_${DIRECTION.RIGHT}`,
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 3,
        end: 5,
      }),
      frameRate: frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: `${AssetKeys.CHARACTERS.PLAYER}_${DIRECTION.UP}`,
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 0,
        end: 2,
      }),
      frameRate: frameRate,
      repeat: -1,
    });
    this.anims.create({
      key: `${AssetKeys.CHARACTERS.PLAYER}_${DIRECTION.DOWN}`,
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 6,
        end: 8,
      }),
      frameRate: frameRate,
      repeat: -1,
    });
  }
}
