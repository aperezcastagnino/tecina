import { Game, type Types } from "phaser";
import { GAME_DIMENSIONS } from "./config/config";
import { Boot } from "./scenes/boot";
import { Level1 } from "./scenes/level1";
import { Level2 } from "./scenes/level2";
import { MainMenu } from "./scenes/main-menu";
import { Preloader } from "./scenes/preloader";
import { GameOver } from "./scenes/game-over";

const config: Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: false,
  backgroundColor: "#000F00",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scale: {
    parent: "game-container",
    width: GAME_DIMENSIONS.WIDTH,
    height: GAME_DIMENSIONS.HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, GameOver, Level1, Level2],
};

export default new Game(config);
