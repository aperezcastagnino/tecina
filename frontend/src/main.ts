import { Game, type Types } from "phaser";
import { GAME_DIMENSIONS } from "config";
import { Level2 } from "scenes/levels/level2";
import { Level3 } from "scenes/levels/level3";
import { Level4 } from "scenes/levels/level4";
import { Level5 } from "scenes/levels/level5";
import { Boot } from "scenes/boot";
import { MainMenu } from "scenes/main-menu";
import LevelsMenu from "scenes/levels-menu";
import { Level1 } from "scenes/levels/level1";
import { Preloader } from "scenes/preloader";
import { GameOver } from "scenes/game-over";

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
    LevelsMenu,
    Level1,
    Level2,
    Level3,
    Level4,
    Level5,
    GameOver,
  ],
};

export default new Game(config);
