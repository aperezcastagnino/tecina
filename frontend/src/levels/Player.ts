import { AssetKeys } from "../assets/AssetKeys";
import { Direction, DIRECTION } from "../common/Direction";

import { Character, CharacterConfig } from "./Character";

type PlayerConfig = Omit<CharacterConfig, "texture" | "idleFrameConfig">;

export class Player extends Character {
  constructor(config: PlayerConfig) {
    super({
      ...config,
      texture: AssetKeys.CHARACTERS.PLAYER,
      origin: { x:0.9, y: 0.9},
      idleFrameConfig: {
        LEFT: 10,
        RIGHT: 4,
        DOWN: 7,
        UP: 1,
        NONE: 7,
      }
    });
  }

  moveCharacter(direction: Direction) {
    super.moveCharacter(direction);

    switch (this._direction) {
      case DIRECTION.DOWN:
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
      case DIRECTION.UP:
        if (
          !this.anims.isPlaying ||
          this.anims.currentAnim?.key !==
            `PLAYER_${this._direction}`
        ) {
          this.anims.play(`PLAYER_${this._direction}`);
        }
        break;
      case DIRECTION.NONE:
        break;
    }
  }
}
