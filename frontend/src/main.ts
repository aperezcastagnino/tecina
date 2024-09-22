import { GAME_DIMENSIONS } from "./config/config";
import { Boot } from "./scenes/Boot";
import { Level1 } from "./scenes/Level1";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: false, // averiguar
  backgroundColor: "#000F00",
  scale: {
    parent: "game-container",
    width: GAME_DIMENSIONS.WIDTH,
    height: GAME_DIMENSIONS.HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, Level1],
};

export default new Game(config);
