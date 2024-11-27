import type { mapType } from "types/map";
import { Scene } from "phaser";
import { SceneKeys } from "./scene-keys";
import { TILE_SIZE, DEFAULT_VELOCITY, GAME_DIMENSIONS } from "../config/config";
import { Controls } from "../common/controls";
import { MAP_WIDTH, MAP_HEIGHT, MAP_TILES_ASSETS } from "../config/map-config";
import { MapLogicalGenerator } from "../common/map/map-logical-generation";
import { AssetKeys } from "../assets/asset-keys";

export class Level2 extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;

  #controls!: Controls;

  cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Variable to store the keys

  private map!: mapType;

  constructor() {
    super(SceneKeys.LEVEL_2);
  }

  private collisionGroup!: Phaser.Physics.Arcade.StaticGroup;

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
      }), // Assume that frames 0 to 3 are the animation
      frameRate: 10, // Animation speed (frames per second)
      repeat: -1, // Repeat indefinitely
    });
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 9,
        end: 11,
      }), // Assume that frames 0 to 3 are the animation
      frameRate: 10, // Animation speed (frames per second)
      repeat: -1, // Repeat indefinitely
    });
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 0,
        end: 2,
      }), // Assume that frames 0 to 3 are the animation
      frameRate: 10, // Animation speed (frames per second)
      repeat: -1, // Repeat indefinitely
    });
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 6,
        end: 8,
      }), // Assume that frames 0 to 3 are the animation
      frameRate: 10, // Animation speed (frames per second)
      repeat: -1, // Repeat indefinitely
    });
  }

  create() {
    // Initialize the collision group
    this.collisionGroup = this.physics.add.staticGroup();

    // Generate the logical map
    const mapLogicalGenerator = new MapLogicalGenerator(MAP_WIDTH, MAP_HEIGHT);
    this.map = mapLogicalGenerator.generate();

    const rows = this.map.mapTiles.length;
    const columns = this.map.mapTiles[0]?.length || 0;

    // Calculate start position for centering the map on screen
    const startX = (GAME_DIMENSIONS.WIDTH - MAP_WIDTH * 164) / 2; // This is forced to be centered
    const startY = (GAME_DIMENSIONS.HEIGHT - MAP_HEIGHT * 42) / 2;

    this.cursors = this.input.keyboard!.createCursorKeys(); // Load the cursor keys (arrows)

    for (let n = 0; n < rows; n += 1) {
      for (let m = 0; m < columns; m += 1) {
        const hexa = this.map.mapTiles[n]?.[m] ?? 0; // Get the tile value

        // Calculate the tile position
        const x = startX + m * TILE_SIZE;
        const y = startY + n * TILE_SIZE;

        // Add a image for each tile
        const tile = this.add
          .image(x, y, MAP_TILES_ASSETS[hexa]!)
          .setDisplaySize(TILE_SIZE, TILE_SIZE);

        // Enable physics on each tile
        this.physics.add.existing(tile, true); // true makes it static

        if (hexa === 1) {
          // Make tiles with `1` in the matrix collidable
          this.collisionGroup.add(tile); // Add to collision group
        }
      }
    }

    this.createPlayer();

    // Player setup

    this.#controls = new Controls(this);

    // Adjust the camera to follow the player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(
      0,
      0,
      MAP_WIDTH * TILE_SIZE * 400,
      MAP_HEIGHT * TILE_SIZE * 400,
      true,
    );
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Set up collision between the player and collision group
    this.physics.add.collider(this.player, this.collisionGroup);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(
      this.map.startColumn + 190,
      this.map.startRow + GAME_DIMENSIONS.HEIGHT / 2 + 40,
      AssetKeys.CHARACTERS.PLAYER,
    );
  }

  update() {
    // Check if the player is touching any object to hide
    const velocity = DEFAULT_VELOCITY;
    if (this.cursors.left.isDown) {
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.player.setVelocityX(-velocity);
      this.player.anims.play("walk-left", true);
    } else if (this.cursors.right.isDown) {
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

      this.player.setVelocityX(velocity);
      this.player.anims.play("walk-right", true);
    } else if (this.cursors.up.isDown) {
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

      this.player.setVelocityY(-velocity);
      this.player.anims.play("walk-up", true);
    } else if (this.cursors.down.isDown) {
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

      this.player.setVelocityY(velocity);
      this.player.anims.play("walk-down", true);
    } else {
      this.player.setVelocity(0);
      this.player.anims.stop();
    }
  }
}
