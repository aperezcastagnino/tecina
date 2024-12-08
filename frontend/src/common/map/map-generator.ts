import type { MapStructure } from "types/map";
import { TILES_TO_USE, FREQUENCY } from "config/map-config";

export class MapGenerator {
  #map!: MapStructure;

  constructor(sceneKey: string, rows: number, columns: number) {
    this.#createEmptyMap(sceneKey, rows, columns);
    this.#addPath();
    this.#contourMap();
    this.#fillMap();
  }

  #createEmptyMap(sceneKey: string, rows: number, columns: number) {
    this.#map = {
      id: `MAP-${sceneKey}`,
      tiles: new Array(rows).fill([]).map(() => new Array(columns).fill(0)),
      rows,
      columns,
      startPosition: { x: 0, y: 0 },
      finishPosition: { x: 0, y: 0 },
      assetGroups: new Map(),
    };
  }

  #addPath() {
    let x = Math.floor(this.#map.rows / 2);
    let y = 2;

    this.#map.startPosition = { x, y };
    this.#map.finishPosition = {
      x: this.#map.rows - 1,
      y: this.#map.columns - 1,
    };
    this.#map.tiles[x]![y] = 4;

    while (y < this.#map.columns - 3) {
      const direction = Math.floor(Math.random() * 2); // Randomly choose a direction

      if (direction === 0 && x > 0) {
        x -= 1; // 0 means up
      } else if (direction === 1 && x < this.#map.rows - 1) {
        x += 1; // 1 means down
      }

      // keeps it inside x and y
      if (x >= 3 && x < this.#map.rows - 3 && y >= 0 && y < this.#map.columns) {
        this.#map.tiles[x]![y] = 1; // keep track of where you have been
        y += 1; // Always move right
        this.#map.tiles[x]![y] = 1;
      }
    }
  }

  #contourMap() {
    // First border
    // This sets the border of the map to 1

    for (let i = 0; i < this.#map.rows; i += 1) {
      this.#map.tiles[i]![0] = 1;
      this.#map.tiles[i]![this.#map.columns - 1] = 1;
    }

    for (let j = 0; j < this.#map.columns; j += 1) {
      this.#map.tiles[0]![j] = 1;
      this.#map.tiles[this.#map.rows - 1]![j] = 1;
    }

    // Second border (inner border) with 1s randomly

    // Here we use Math.floor(Math.random() * 2) to randomly set the inner border to 1
    // Math.random() returns a random number between 0 and 1
    // If we do Math.floor(Math.random()) returns always 0
    // So we multiply by 2 to get a number between 0 and 2 and the floor returns 0 or 1

    for (let i = 1; i < this.#map.rows - 1; i += 1) {
      this.#map.tiles[i]![1] = Math.floor(Math.random() * 2);
      this.#map.tiles[i]![this.#map.columns - 2] = Math.floor(
        Math.random() * 2,
      );
    }

    for (let j = 1; j < this.#map.columns - 1; j += 1) {
      this.#map.tiles[1]![j] = Math.floor(Math.random() * 2);
      this.#map.tiles[this.#map.rows - 2]![j] = Math.floor(
        Math.random() * 2,
      );
    }
  }

  #fillMap() {
    const cumulativeFrequency = [];
    let total = 0;

    // Calculate the cumulative frequency
    // if the frequency is [5, 10, 20] the cumulative frequency is [5, 15, 35]

    // eslint-disable-next-line no-restricted-syntax
    for (const weight of FREQUENCY) {
      total += weight;
      cumulativeFrequency.push(total);
    }
    const maxFrequency = cumulativeFrequency[cumulativeFrequency.length - 1]!;

    for (let i = 0; i < this.#map.rows; i += 1) {
      for (let j = 0; j < this.#map.columns; j += 1) {
        // If the column is empty, fill it with a random value
        if (this.#map.tiles[i]![j] === 0) {
          // We pick the random value based on the cumulative frequency
          // We multiply by the maxFrequency to get a value between 0 and the maxFrequency
          const randomValue = Math.random() * maxFrequency;

          // Once we have the random value we find the index of the first weight that is greater than the random value
          // This is the weight that we will use to fill the map
          const selectedIndex = cumulativeFrequency.findIndex(
            (weight) => randomValue < weight,
          );

          // We fill the map with the selected number
          this.#map.tiles[i]![j] = TILES_TO_USE[selectedIndex]!;
        }
      }
    }
  }

  static newMap(sceneKey: string, rows: number, columns: number): MapStructure {
    const generator = new MapGenerator(sceneKey, rows, columns);
    return generator.#map;
  }
}
