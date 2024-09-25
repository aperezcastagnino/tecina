import { Character, type CharacterConfig } from "./character.js";
import { AssetKeys } from "../assets/asset-keys";
import { DIRECTION, type Direction } from "../common/direction";

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
      origin: { x: 0, y: 0 },
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
    this.setScale(3);
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
        this.setFrame(this._idleFrameConfig.UP).setFlipX(false);
        break;
      case DIRECTION.LEFT:
        this.setFrame(this._idleFrameConfig.RIGHT).setFlipX(false);
        break;
      case DIRECTION.RIGHT:
        this.setFrame(this._idleFrameConfig.LEFT).setFlipX(true);
        break;
      case DIRECTION.UP:
        this.setFrame(this._idleFrameConfig.DOWN).setFlipX(false);
        break;
      case DIRECTION.NONE:
      default:
        break;
    }
  }
}
