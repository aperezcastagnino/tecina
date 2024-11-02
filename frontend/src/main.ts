import { Game, type Types } from "phaser";
import { GAME_DIMENSIONS } from "./config/config";
import { Boot } from "./scenes/boot";
import { Level1 } from "./scenes/level1";
import { MainMenu } from "./scenes/main-menu";
import { MapLevel } from "./scenes/map-level";
import { Preloader } from "./scenes/preloader";

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
  scene: [Boot, Preloader, MainMenu, Level1, MapLevel],
};

export default new Game(config);
