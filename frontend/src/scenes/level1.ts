import { Scene } from "phaser";
import type { LevelData } from "types/level-data";
import { loadLevelData } from "../utils/data-util";
import { DEBUG_MODE_ACTIVE } from "../config/debug-config";
import { arePositionsNear, getNextPosition } from "../utils/location-utils";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { Player } from "../characters/player";
// import { DIRECTION } from "../common/direction";
import { TILE_SIZE } from "../config/config";
// import { Controls } from "../utils/controls";
// import { DialogUi } from "../common/dialog-ui";

export class Level1 extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private tilemap!: Phaser.Tilemaps.Tilemap;
  private tileset!: Phaser.Tilemaps.Tileset | null;
  private collisionLayer!: Phaser.Tilemaps.TilemapLayer | null;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Variable para almacenar las teclas
  private waitingSpaceKeyboard!: boolean;
  private objectsToDispose!: Phaser.GameObjects.Sprite[]; // Cambiamos a un array
  private spriteName!: string; // Cambiamos a un array

  #levelData: LevelData | undefined;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  preload() {
    this.anims.create({
      key: "KeyAnim",
      frames: this.anims.generateFrameNumbers(
        AssetKeys.UI.HALLOWEEN_EYE_AWARD.NAME,
      ),
      frameRate: 30,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 3,
        end: 5,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 9,
        end: 11,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 0,
        end: 2,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 6,
        end: 8,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
  }

  create() {
    this.waitingSpaceKeyboard = false;
    this.tilemap = this.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });

    // Vincular el tileset con el nombre que se usó en Tiled
    this.tileset = this.tilemap.addTilesetImage(
      AssetKeys.LEVELS.TILESET.TILESETIMAGE,
      AssetKeys.LEVELS.TILESET.KEY,
    );

    // Crear las capas del mapa
    const fondoLayer = this.tilemap.createLayer("ground", this.tileset!, 0, 0);
    this.collisionLayer = this.tilemap.createLayer(
      "elements",
      this.tileset!,
      0,
      0,
    );

    // Habilitar la colisión en la capa 'Colision'
    this.collisionLayer!.setCollisionByProperty({ colisionable: true });
    this.createPlayer();
    this.physics.add.collider(this.player, this.collisionLayer!);
    this.collisionLayer!.setCollisionByExclusion([-1]);
    this.cursors = this.input.keyboard!.createCursorKeys(); // Carga las teclas del cursor (flechas)
    var capaObjetos = this.tilemap.objects.find(
      (f) => f.name == "Capa de Objetos 1",
    ); // Accede a la capa de objetos
    this.objectsToDispose = [];

    var sprite = null;
    capaObjetos!.objects.forEach((objeto, index) => {
      sprite = this.physics.add.sprite(
        objeto.x!,
        objeto.y!,
        AssetKeys.CHARACTERS.NPC,
      );
      sprite.setOrigin(0.5, 0.5);

      sprite.name = "Key-" + index;
      sprite.setImmovable(true);
      sprite.anims.play("KeyAnim", true);
      sprite.body.setSize(
        AssetKeys.UI.HALLOWEEN_EYE_AWARD.frameWidth,
        AssetKeys.UI.HALLOWEEN_EYE_AWARD.frameHeight,
      );

      this.objectsToDispose.push(sprite);
      this.physics.add.collider(this.player, sprite, (a, b) => {
        if (this.cursors.space.isDown) {
          b.destroy();
        }
      });
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(
      100,
      100,
      AssetKeys.CHARACTERS.PLAYER,
    );
  }

  update() {
    // Verificamos si el jugador está tocando algún objeto a ocultar
    const velocity = 100;
    if (this.cursors.left.isDown) {
      this.player.setmainityX(-velocity);
      this.player.anims.play("walk-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(velocity);
      this.player.anims.play("walk-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-velocity);
      this.player.anims.play("walk-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(velocity);
      this.player.anims.play("walk-down", true);
    } else {
      this.player.setVelocity(0);
      this.player.anims.stop();
    }
  }
}
