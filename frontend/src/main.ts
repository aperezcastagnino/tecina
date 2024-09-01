import { Boot } from "./scenes/Boot";
import { Level1 } from "./scenes/Level1";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";

//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

const config: Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  pixelArt: false, // averiguar
  backgroundColor: "#000F00",
  scale: {
    parent: "game-container",
    width: 1920,
    height: 1040,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, Level1],
};

export default new Game(config);
