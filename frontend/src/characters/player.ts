import type { Coordinate } from "types/coordinate";
import { DIRECTION, type Direction } from "../common/player-keys";
import { AssetKeys } from "../assets/asset-keys";

type PlayerConfig = {
  scene: Phaser.Scene;
  position: Coordinate;
  maxVelocity: number;
  frame?: string | number;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  #direction: Direction;

  #velocity: number;

  constructor(config: PlayerConfig) {
    super(
      config.scene,
      config.position.x,
      config.position.y,
      AssetKeys.CHARACTERS.PLAYER,
      config.frame
    );

    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    (this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(100);
    this.#direction = DIRECTION.NONE;
    this.#velocity = config.maxVelocity;
    this.setScale(0.8);
  }

  move(direction: Direction) {
    switch (direction) {
      case DIRECTION.UP:
        this.setVelocity(0, -this.#velocity);
        this.#direction = DIRECTION.UP;
        this.anims.play(`PLAYER_${this.#direction}`, true);
        break;
      case DIRECTION.DOWN:
        this.setVelocity(0, this.#velocity);
        this.#direction = DIRECTION.DOWN;
        this.anims.play(`PLAYER_${this.#direction}`, true);
        break;
      case DIRECTION.LEFT:
        this.setVelocity(-this.#velocity, 0);
        this.#direction = DIRECTION.LEFT;
        this.anims.play(`PLAYER_${this.#direction}`, true);
        break;
      case DIRECTION.RIGHT:
        this.setVelocity(this.#velocity, 0);
        this.#direction = DIRECTION.RIGHT;
        this.anims.play(`PLAYER_${this.#direction}`, true);
        break;
      case DIRECTION.NONE:
      default:
        this.setVelocity(0);
        this.anims.stop();
        break;
    }
  }
}
