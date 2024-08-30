import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";

//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config: Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: false, // averiguar
  backgroundColor: "#000000",
  scale: {
    parent: "game-container",
    width: 1024,
    height: 768,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
};

export default new Game(config);
