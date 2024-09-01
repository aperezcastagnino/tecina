import { AssetKeys } from "../assets/AssetKeys";

import { Character, CharacterConfig } from "./Character";

type PlayerConfig = Omit<CharacterConfig, 'texture' | 'frame'>;

export class Player extends Character {
  constructor(config: PlayerConfig) {
    super({
      ...config,
      texture: AssetKeys.CHARACTERS.PLAYER,
      frame: 3
    });
  }
}
