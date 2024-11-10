import type { MapType } from "types/map";
import {
  mapTiles,
  frequency,
  mapWidth,
  mapHeight,
} from "../../config/map-config";
import { TILE_SIZE } from "../../config/config";

export class MapLogicalGenerator {
  #map!: MapType;

  #row: number;

  #column: number;

  constructor(n: number, m: number) {
    this.#row = n;
    this.#column = m;
    this.#map = this.#createEmptyMap();
  }

  #createEmptyMap() {
    this.#map = {
      id: "map",
      blockSize: TILE_SIZE,
      mapTiles: new Array(this.#row)
        .fill([])
        .map(() => new Array(this.#column).fill(0)),
      frequency: [],
      mapWidth,
      mapHeight,
    };
    return this.#map;
  }

  #addPath() {
    let x = Math.floor(this.#row / 2);
    let y = 0;

    this.#map.mapTiles[x]![y] = 7;

    while (y < this.#column - 1) {
      const direction = Math.floor(Math.random() * 3); // Randomly choose a direction

      if (direction === 0 && x > 0) {
        x -= 1; // 0 means up
      } else if (direction === 1 && x < this.#row - 1) {
        x += 1; // 1 means down
      }
      if (x >= 0 && x < this.#row && y >= 0 && y < this.#column) {
        // keeps it inside x and y
        this.#map.mapTiles[x]![y] = 7; // keep track of where you have been
        y += 1; // Always move down
        this.#map.mapTiles[x]![y] = 7;
      }
    }
  }

  #contourMap() {
    // First border
    // This sets the border of the map to 1

    for (let i = 0; i < this.#row; i += 1) {
      this.#map.mapTiles[i]![0] = 1;
      this.#map.mapTiles[i]![this.#column - 1] = 1;
    }

    for (let j = 0; j < this.#column; j += 1) {
      this.#map.mapTiles[0]![j] = 1;
      this.#map.mapTiles[this.#row - 1]![j] = 1;
    }

    // Second border (inner border) with 1s randomly

    // Here we use Math.floor(Math.random() * 2) to randomly set the inner border to 1
    // Math.random() returns a random number between 0 and 1
    // If we do Math.floor(Math.random()) returns always 0
    // So we multiply by 2 to get a number between 0 and 2 and the floor returns 0 or 1

    for (let i = 1; i < this.#row - 1; i += 1) {
      this.#map.mapTiles[i]![1] = Math.floor(Math.random() * 2);
      this.#map.mapTiles[i]![this.#column - 2] = Math.floor(Math.random() * 2);
    }

    for (let j = 1; j < this.#column - 1; j += 1) {
      this.#map.mapTiles[1]![j] = Math.floor(Math.random() * 2);
      this.#map.mapTiles[this.#row - 2]![j] = Math.floor(Math.random() * 2);
    }
  }

  private fillMap() {
    const cumulativeFrequency = [];
    let total = 0;

    // Calculate the cumulative frequency
    // if the frequency is [5, 10, 20] the cumulative frequency is [5, 15, 35]

    // eslint-disable-next-line no-restricted-syntax
    for (const weight of frequency) {
      total += weight;
      cumulativeFrequency.push(total);
    }
    const maxFrequency = cumulativeFrequency[cumulativeFrequency.length - 1]!;

    for (let i = 0; i < this.#row; i += 1) {
      for (let j = 0; j < this.#column; j += 1) {
        // If the column is empty, fill it with a random value
        if (this.#map.mapTiles[i]![j] === 0) {
          // We pick the random value based on the cumulative frequency
          // We multiply by the maxFrequency to get a value between 0 and the maxFrequency
          const randomValue = Math.random() * maxFrequency;

          // Once we have the random value we find the index of the first weight that is greater than the random value
          // This is the weight that we will use to fill the map
          const selectedIndex = cumulativeFrequency.findIndex(
            (weight) => randomValue < weight,
          );

          // We fill the map with the selected number
          this.#map.mapTiles[i]![j] = mapTiles[selectedIndex]!;
        }
      }
    }
  }

  generate() {
    this.#createEmptyMap();
    this.#addPath();
    this.#contourMap();
    this.fillMap();
    console.log(this.#map);
    return this.#map;
  }
}
