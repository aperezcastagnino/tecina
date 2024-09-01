import { Scene } from "phaser";
import { SceneKeys } from "./SceneKeys";
import { AssetKeys } from "../assets/AssetKeys";
import { TextButton } from "../common/TextButton";

export class MainMenu extends Scene {
  startGameButton: TextButton;

  constructor() {
    super(SceneKeys.MAIN_MENU);
  }

  create() {
    console.log(`[${MainMenu.name}:created] INVOKED`);
    this.add.image(0, 0, AssetKeys.BACKGROUNDS.MAIN_MENU).setOrigin(0);

    const startGameButton = new TextButton(
      this,
      100,
      100,
      "Comenzar a jugar",
      { color: "#0f0" },
      () => this.startGame()
    );
    const loadPreviousGameButton = new TextButton(
      this,
      100,
      200,
      "Cargar partida",
      { color: "#0f0" },
      () => this.startGame()
    );

    this.add.existing(startGameButton);
    this.add.existing(loadPreviousGameButton);
  }

  startGame() {
    this.scene.start(SceneKeys.LEVEL_1);
  }

}
