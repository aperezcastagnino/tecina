import { AssetKeys } from "../assets/asset-keys";
import { type Direction, DIRECTION } from "../common/player-keys";

import { Character, type CharacterConfig } from "./character";

type PlayerConfig = Omit<
  CharacterConfig,
  "assetKey" | "idleFrameConfig" | "origin"
>;

export class Player extends Character {
  constructor(config: PlayerConfig) {
    super({
      ...config,
      assetKey: AssetKeys.CHARACTERS.PLAYER,
      origin: { x: 0.9, y: 0.9 },
      idleFrameConfig: {
        LEFT: 10,
        RIGHT: 4,
        DOWN: 7,
        UP: 1,
        NONE: 7,
      },
    });

    this.setScale(0.8);
  }

  setCaractersToCollideWith(characters: Character[]) {
    this._otherCharactersToCheckForCollisionsWith = characters;
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
          this.anims.currentAnim?.key !== `PLAYER_${this._direction}`
        ) {
          this.anims.play(`PLAYER_${this._direction}`);
        }
        break;
      case DIRECTION.NONE:
      default:
        break;
    }
  }
}
