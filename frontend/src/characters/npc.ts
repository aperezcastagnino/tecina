import { Character, type CharacterConfig } from "./character.js";
import { AssetKeys } from "../assets/asset-keys";
import { DIRECTION, type Direction } from "../common/player-keys.js";

type NPCConfig = Omit<
  CharacterConfig,
  | "assetKey"
  | "idleFrameConfig"
  | "origin"
> & { frame: number; messages: string[] };

export class NPC extends Character {
  #messages: string[];

  #talkingToPlayer: boolean;

  constructor(config: NPCConfig) {
    super({
      ...config,
      assetKey: AssetKeys.CHARACTERS.NPC,
      origin: { x: 2, y: 2 },
      idleFrameConfig: {
        DOWN: config.frame,
        UP: config.frame + 1,
        NONE: config.frame,
        LEFT: config.frame + 2,
        RIGHT: config.frame + 2,
      }
    });

    this.#messages = config.messages;
    this.#talkingToPlayer = false;
    this.setScale(3.5);
  }

  get messages() {
    return [...this.#messages];
  }

  get isTalkingToPlayer() {
    return this.#talkingToPlayer;
  }

  set isTalkingToPlayer(value: boolean) {
    this.#talkingToPlayer = value;
  }

  facePlayer(playerDirection: Direction) {
    switch (playerDirection) {
      case DIRECTION.DOWN:
        this.setFrame(this._idleFrameConfig.UP);
        break;
      case DIRECTION.LEFT:
        this.setFrame(this._idleFrameConfig.RIGHT);
        break;
      case DIRECTION.RIGHT:
        this.setFrame(this._idleFrameConfig.LEFT).setFlipX(true);
        break;
      case DIRECTION.UP:
        this.setFrame(this._idleFrameConfig.DOWN);
        break;
      case DIRECTION.NONE:
      default:
        break;
    }
  }
}
