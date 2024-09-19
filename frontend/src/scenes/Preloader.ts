import { Scene } from "phaser";
import { SceneKeys } from "./SceneKeys";
import { AssetKeys } from "../assets/AssetKeys";
import { DIRECTION } from "../common/Direction";
import { DebugConfig } from "../config/DebugConfig";

export class Preloader extends Scene {
  constructor() {
    super(SceneKeys.PRELOADER);
  }

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
    this.load.image(AssetKeys.UI_ASSET_KEYS.CURSOR, `/images/cursor.png`);
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
