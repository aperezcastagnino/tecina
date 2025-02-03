import { Game, type Types } from "phaser";
import { GAME_DIMENSIONS } from "config/config";
import { LevelDeprecated } from "./scenes/level-deprecated";
import { Boot } from "./scenes/boot";
import { Level1 } from "./scenes/level1";
import { MainMenu } from "./scenes/main-menu";
import { Preloader } from "./scenes/preloader";
import { GameOver } from "./scenes/game-over";
import LevelsMenu from "./scenes/levels-menu";
import { Level2 } from "./scenes/level2";

const config: Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  backgroundColor: "#000F00",
  physics: {
    default: "arcade",
  },
  scale: {
    parent: "game-container",
    width: GAME_DIMENSIONS.WIDTH,
    height: GAME_DIMENSIONS.HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    Level1,
    Level2,
    GameOver,
    LevelDeprecated,
    LevelsMenu,
  ],
};

export default new Game(config);
