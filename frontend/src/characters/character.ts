/* eslint-disable no-underscore-dangle */
import { DIRECTION, type Direction } from "../common/direction";
import type { Coordinate } from "../types/coordinate";
import { getTargetPosition } from "../utils/grid";

type CharacterIdleFrameConfig = {
  LEFT: number;
  RIGHT: number;
  DOWN: number;
  UP: number;
  NONE: number;
};

export type CharacterConfig = {
  scene: Phaser.Scene;
  origin: Coordinate;
  assetKey: string | Phaser.Textures.Texture;
  direction: Direction;
  position: Coordinate;
  idleFrameConfig: CharacterIdleFrameConfig;
  spriteGridMovementFinishedCallback?: () => void;
  collisionLayer?: Phaser.Tilemaps.TilemapLayer;
  otherCharactersToCheckForCollisionsWith?: Character[];
};

export class Character extends Phaser.GameObjects.Sprite {
  _scene: Phaser.Scene;

  _direction: Direction;

  _isMoving: boolean;

  _origin: Coordinate;

  _targetPosition: Coordinate;

  _previousTargetPosition: Coordinate;

  _spriteGridMovementFinishedCallback?: () => void;

  _idleFrameConfig: CharacterIdleFrameConfig;

  _collisionLayer?: Phaser.Tilemaps.TilemapLayer;

  _otherCharactersToCheckForCollisionsWith: Character[] = [];

  constructor(config: CharacterConfig) {
    super(config.scene, config.position.x, config.position.y, config.assetKey);

    this._scene = config.scene;
    this._direction = config.direction;
    this._isMoving = false;
    this._collisionLayer = config.collisionLayer;
    this.scene.add.existing(this);

    this._idleFrameConfig = config.idleFrameConfig;
    this._origin = config.origin ? config.origin : { x: 0, y: 0 };

    this._targetPosition = config.position;
    this._previousTargetPosition = config.position;
    this._spriteGridMovementFinishedCallback =
      config.spriteGridMovementFinishedCallback;
    this._otherCharactersToCheckForCollisionsWith =
      config.otherCharactersToCheckForCollisionsWith || [];

    this.setOrigin(this._origin.x, this._origin.y);
    this.setFrame(this._getIdleFrame());
  }

  get sprite() {
    return this;
  }

  get direction() {
    return this._direction;
  }

  get isMoving() {
    return this._isMoving;
  }

  moveCharacter(direction: Direction) {
    if (this._isMoving) {
      return;
    }

    this._moveSprite(direction);
  }

  addCharacterToCheckForCollisionsWith(character: Character) {
    this._otherCharactersToCheckForCollisionsWith.push(character);
  }

  update() {
    if (this._isMoving) {
      return;
    }

    const idleFrame = this.anims.currentAnim?.frames[1]?.frame.name;
    this.anims.stop();
    if (!idleFrame) {
      return;
    }

    switch (this._direction) {
      case DIRECTION.DOWN:
      case DIRECTION.LEFT:
      case DIRECTION.RIGHT:
      case DIRECTION.UP:
        this.setFrame(idleFrame);
        break;
      case DIRECTION.NONE:
      default:
        break;
    }
  }

  _isBlockingTile() {
    if (this._direction === DIRECTION.NONE) {
      return false;
    }

    const targetPosition = { ...this._targetPosition };
    const updatedPosition = getTargetPosition(
      targetPosition,
      this._direction
    );
;
    return (
      this.#doesPositionCollideWithCollisionLayer(updatedPosition) ||
      this.#doesPositionCollideWithOtherCharacter(updatedPosition)
    );
  }

  _getIdleFrame() {
    return this._idleFrameConfig[
      this._direction as keyof CharacterIdleFrameConfig
    ];
  }

  _moveSprite(direction: Direction) {
    this._direction = direction;
    if (this._isBlockingTile()) {
      return;
    }

    this._isMoving = true;
    this.#handleSpriteMovement();
  }

  #handleSpriteMovement() {
    if (this._direction === DIRECTION.NONE) {
      return;
    }

    const updatedPosition = getTargetPosition(
      this._targetPosition,
      this._direction
    );

    this._previousTargetPosition = { ...this._targetPosition };
    this._targetPosition.x = updatedPosition.x;
    this._targetPosition.y = updatedPosition.y;

    this._scene.tweens.add({
      delay: 0,
      duration: 600,
      y: {
        from: this.y,
        start: this.y,
        to: this._targetPosition.y,
      },
      x: {
        from: this.x,
        start: this.x,
        to: this._targetPosition.x,
      },
      targets: this,
      onComplete: () => {
        this._isMoving = false;
        this._previousTargetPosition = { ...this._targetPosition };
        if (this._spriteGridMovementFinishedCallback) {
          this._spriteGridMovementFinishedCallback();
        }
      },
    });
  }

  #doesPositionCollideWithCollisionLayer(position: Coordinate) {
    if (!this._collisionLayer) {
      return false;
    }

    const { x, y } = position;
    const tile = this._collisionLayer.getTileAtWorldXY(x, y, true);

    return tile.index !== -1;
  }

  #doesPositionCollideWithOtherCharacter(position: Coordinate) {
    const { x, y } = position;
    debugger
    if (this._otherCharactersToCheckForCollisionsWith.length === 0) {
      return false;
    }
debugger;
    const collidesWithACharacter =
      this._otherCharactersToCheckForCollisionsWith.some((character) => (
          (character._targetPosition.x === x &&
            character._targetPosition.y === y) ||
          (character._previousTargetPosition.x === x &&
            character._previousTargetPosition.y === y)
        ));
    return collidesWithACharacter;
  }
}
