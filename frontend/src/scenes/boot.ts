import { Scene } from "phaser";
import { SceneKeys } from "./scene-keys";

export class Boot extends Scene {
  constructor() {
    super(SceneKeys.BOOT);
  }

  preload() {
    this.time.delayedCall(10, () => {});
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
  }

  create() {
    this.scene.start(SceneKeys.PRELOADER);
  }
}
