import { Game, type Types } from "phaser";
import { GAME_DIMENSIONS } from "config";
import MainMenu from "./scenes/main-menu";
import LevelsMenu from "./scenes/levels-menu";
import Level1 from "./scenes/levels/level1";
import Level2 from "./scenes/levels/level2";
import Level3 from "./scenes/levels/level3";
import Level4 from "./scenes/levels/level4";
import Level5 from "./scenes/levels/level5";
import Level6 from "./scenes/levels/level6";
import Preloader from "./scenes/preloader";
import GameOver from "./scenes/game-over";
import WinScene from "./scenes/win-scene";

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
    Preloader,
    MainMenu,
    LevelsMenu,
    Level1,
    Level2,
    Level3,
    Level4,
    Level5,
    Level6,
    GameOver,
    WinScene,
  ],
};

export default new Game(config);
