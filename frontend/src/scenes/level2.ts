

import { Scene } from "phaser";
import { DEBUG_MODE_ACTIVE } from "../config/debug-config";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { Player } from "../characters/player";
import { DIRECTION } from "../common/player-keys";
import { TILE_SIZE } from "../config/config";
import { Controls } from "../common/controls";
import { mapWidth, mapHeight } from "../assets/constants";
import { mapColors } from "../assets/colors";
import { MapLogicalGenerator } from "../map/map-logical-generation";

export class Level2 extends Scene {
  #player!: Player;
  
  #controls!: Controls;

  constructor() {
    super(SceneKeys.LEVEL_2);
  }

  private collisionGroup!: Phaser.Physics.Arcade.StaticGroup;

  create() {
     this.collisionGroup = this.physics.add.staticGroup();


    const mapLogicalGenerator = new MapLogicalGenerator(mapWidth, mapHeight);
    const map = mapLogicalGenerator.run();

    const rows = map.length;
    const columns = map[0]?.length || 0;

    // Calculates the start position of the board
    const startX = (this.scale.width - columns * TILE_SIZE) / 2;
    const startY = (this.scale.height - rows * TILE_SIZE) / 2;


    console.log("Drawing map..."); // Debugging log

    for (let n = 0; n < rows; n += 1) {
      for (let m = 0; m < columns; m += 1) {
        const hexa = map[n]?.[m] ?? 0; // Get the value of the logical map
        const color = mapColors[hexa] || 0xffffff; // Get the color

        // Calculate the position of the cell
        const x = startX + m * TILE_SIZE;
        const y = startY + n * TILE_SIZE;


        // Add a rectangle with the specified color
        const rect = this.add.rectangle(
          x + TILE_SIZE / 2, // where to start
          y + TILE_SIZE / 2, // where to start
          TILE_SIZE , // rectangle width
          TILE_SIZE , // rectangle height
          color,
        );

        if (hexa ===  1) { // 1 is the water
//          this.physics.add.existing(rect, true); // Add static physics to the tile
          this.collisionGroup.add(rect); // Add the rectangle to the collision group
        }
        
      }
    }

    // Player setup
    this.#player = new Player({
      scene: this,
      direction: DIRECTION.DOWN,
      position: { x: startX + TILE_SIZE, y: startY + TILE_SIZE },
    });


    this.#controls = new Controls(this);

    // Adjust the camera to follow the player
    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
    this.cameras.main.startFollow(this.#player.sprite);
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    this.physics.add.collider(this.#player.sprite, this.collisionGroup);

  }

  update() {
    const selectedDirection = this.#controls.getDirectionKeyPressedDown();
    if (selectedDirection !== DIRECTION.NONE) {
      this.#player.moveCharacter(selectedDirection);
    }
    this.#player.update();
  }
}
