import { Game, type Types } from "phaser";
import { GAME_DIMENSIONS } from "config/config";
import { Boot } from "./scenes/boot";
import { MainMenu } from "./scenes/main-menu";
import LevelsMenu from "./scenes/levels-menu";
import { Level1 } from "./scenes/level1";
import { Preloader } from "./scenes/preloader";
import { GameOver } from "./scenes/game-over";

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
  scene: [Boot, Preloader, MainMenu, LevelsMenu, Level1, GameOver],
};

export default new Game(config);
