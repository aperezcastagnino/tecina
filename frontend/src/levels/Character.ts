import { Coordinate } from "../types/Coordinate";

export type CharacterConfig = {
  scene: Phaser.Scene;
  origin: Coordinate;
  texture: string | Phaser.Textures.Texture;
  frame: string | number | undefined;
  direction: string,
  collisionLayer: Phaser.Tilemaps.TilemapLayer;
};

export class Character extends Phaser.GameObjects.Sprite {
  _scene: Phaser.Scene;
  _direction: string;
  _collisionLayer: Phaser.Tilemaps.TilemapLayer;

  constructor(config: CharacterConfig) {
    super(
      config.scene,
      config.origin.x,
      config.origin.y,
      config.texture,
      config.frame,
    );

    this._scene = config.scene;
    this._direction = config.direction;
    this._collisionLayer = config.collisionLayer;
    this.scene.add.existing(this);
  }
}
