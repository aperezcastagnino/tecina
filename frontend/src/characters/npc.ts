import { AssetKeys } from "../assets/asset-keys";
import { Character, CharacterConfig } from "./character";

type NPCConfig = Omit<CharacterConfig, "assetKey" | "idleFrameConfig" | "origin"> & { frame: number };

export class NPC extends Character {
  constructor(config: NPCConfig) {
    super({
      ...config,
      assetKey: AssetKeys.CHARACTERS.NPC,
      origin: { x:0, y: 0},
      idleFrameConfig: {
        LEFT: config.frame + 2,
        RIGHT: config.frame + 2,
        DOWN: config.frame,
        UP: config.frame + 1,
        NONE: config.frame,
      }
    });

    this.setScale(4);
  }
};
