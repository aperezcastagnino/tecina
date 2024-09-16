import { AssetKeys } from "../assets/AssetKeys";
import { Direction, DIRECTION } from "../common/Direction";

import { Character, CharacterConfig } from "./Character";

type PlayerConfig = Omit<CharacterConfig, "texture" | "frame">;

export class Player extends Character {
  constructor(config: PlayerConfig) {
    super({
      ...config,
      texture: AssetKeys.CHARACTERS.PLAYER,
      frame: 3,
    });
  }

  moveCharacter(direction: Direction) {
    super.moveCharacter(direction);

    switch (this._direction) {
      case DIRECTION.DOWN:
        (this as unknown as Phaser.Physics.Arcade.Sprite).setVelocity(-150, 0)
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
      case DIRECTION.UP:
        (this as unknown as Phaser.Physics.Arcade.Sprite).setVelocity(150, 0)

        if (
          !this.anims.isPlaying ||
          this.anims.currentAnim?.key !==
            `${AssetKeys.CHARACTERS.PLAYER}_${this._direction}`
        ) {
          this.anims.play(`${AssetKeys.CHARACTERS.PLAYER}_${this._direction}`);
        }
        break;
      case DIRECTION.NONE:
        this.anims.stop();
        break;
    }
  }
}
