import { Scene } from "phaser";
import { SceneKeys } from "./scene-keys";
import { TILE_SIZE } from "../config/config";
import { Controls } from "../common/controls";
import { mapWidth, mapHeight } from "../config/map-config";
import { mapColors } from "../assets/colors";
import { MapLogicalGenerator } from "../map/map-logical-generation";
import { AssetKeys } from "../assets/asset-keys";
// import { Player } from "../characters/player";
// import { Controls } from "../utils/controls";
// import { DialogUi } from "../common/dialog-ui";

export class Level2 extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;

  #controls!: Controls;

  cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Variable to store the keys

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
    const mapLogicalGenerator = new MapLogicalGenerator(mapWidth, mapHeight);
    const map = mapLogicalGenerator.run();

    const rows = map.length;
    const columns = map[0]?.length || 0;

    // Calculate start position for centering the map on screen
    const startX = (this.scale.width - columns * TILE_SIZE) / 2;
    const startY = (this.scale.height - rows * TILE_SIZE) / 2;

    this.cursors = this.input.keyboard!.createCursorKeys(); // Load the cursor keys (arrows)

    for (let n = 0; n < rows; n += 1) {
      for (let m = 0; m < columns; m += 1) {
        const hexa = map[n]?.[m] ?? 0; // Get the tile value
        const color = mapColors[hexa] || 0xffffff; // Get the tile color

        // Calculate the tile position
        const x = startX + m * TILE_SIZE;
        const y = startY + n * TILE_SIZE;

        // Add a rectangle for each tile
        const tile = this.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, color);

        // Enable physics on each tile
        this.physics.add.existing(tile, true); // true makes it static

        if (hexa === 1) {
          // Make tiles with `1` in the matrix collidable
          this.collisionGroup.add(tile); // Add to collision group
          console.log("Water tile added to collision group"); // Debugging log
        }
      }
    }

    this.createPlayer();

    // Player setup

    this.#controls = new Controls(this);

    // Adjust the camera to follow the player
    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Set up collision between the player and collision group
    this.physics.add.collider(this.player, this.collisionGroup);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(
      250,
      300,
      AssetKeys.CHARACTERS.PLAYER,
    );
  }

  update() {
    // Check if the player is touching any object to hide
    const velocity = 500;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-velocity);
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
