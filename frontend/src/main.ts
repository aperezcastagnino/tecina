import { Game, type Types } from "phaser";
import { GAME_DIMENSIONS } from "./config/config";
import { Boot } from "./scenes/boot";
import { Level1 } from "./scenes/level1";
import { Level2 } from "./scenes/level2";
import { MainMenu } from "./scenes/main-menu";
import { MapLevel } from "./scenes/map-level";
import { Preloader } from "./scenes/preloader";

const config: Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: false, // averiguar
  backgroundColor: "#000F00",
  physics: {
    default: "arcade", // Motor de físicas arcade
    arcade: {
      gravity: { y: 0, x: 0 }, // Sin gravedad en el juego (es un top-down)
      debug: false, // Activa o desactiva el modo de depuración (útil para ver las colisiones)
    },
  },
  scale: {
    parent: "game-container",
    width: GAME_DIMENSIONS.WIDTH,
    height: GAME_DIMENSIONS.HEIGHT,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, Level1, MapLevel, Level2],
};

export default new Game(config);
