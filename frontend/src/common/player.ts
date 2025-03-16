import type { Coordinate } from "types/coordinate";
import { DIRECTION, type Direction } from "common/player-keys";
import { AssetKeys } from "assets/asset-keys";

type PlayerConfig = {
  scene: Phaser.Scene;
  position: Coordinate;
  velocity: number;
  frame?: string | number;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private _direction: Direction = DIRECTION.NONE;

  private velocity: number;

  isMoving: boolean = false;

  get direction(): Direction {
    return this._direction;
  }

  set direction(direction: Direction) {
    this._direction = direction;
  }

  constructor(config: PlayerConfig) {
    super(
      config.scene,
      config.position.x,
      config.position.y,
      AssetKeys.CHARACTERS.PLAYER,
      config.frame,
    );

    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);

    (this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(config.velocity);
    this.velocity = config.velocity;
    this.setScale(0.8);
  }

  move(direction: Direction) {
    if (direction === DIRECTION.NONE) {
      this.isMoving = false;
      this.anims.stop();
      this.setVelocity(0);
    } else {
      switch (direction) {
        case DIRECTION.UP:
          this.setVelocity(0, -this.velocity);
          break;
        case DIRECTION.DOWN:
          this.setVelocity(0, this.velocity);
          break;
        case DIRECTION.LEFT:
          this.setVelocity(-this.velocity, 0);
          break;
        case DIRECTION.RIGHT:
          this.setVelocity(this.velocity, 0);
          break;
        default:
          this.setVelocity(0, 0);
      }

      this.isMoving = true;
      this._direction = direction;
      this.anims.play(`PLAYER_${this._direction}_ANIMATION`, true);
    }
  }
}
