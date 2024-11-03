import type { MapType } from "types/map";
import { mapTiles, frequency, mapWidth, mapHeight } from "../assets/constants";
import { TILE_SIZE } from "../config/config";

export class MapLogicalGenerator {
  #map: MapType = {
    blockSize: 0,
    mapTiles: [],
    frequency: [],
    mapWidth: 0,
    mapHeight: 0,
  };

  #row: number;

  #column: number;

  constructor(n: number, m: number) {
    this.#row = n;
    this.#column = m;
    this.#map = this.create_empty_map();
  }

  create_empty_map() {
    this.#map = {
      blockSize: TILE_SIZE,
      mapTiles: new Array(this.#row)
        .fill([])
        .map(() => new Array(this.#column).fill(0)),
      frequency: [],
      mapWidth,
      mapHeight,
    };
    for (let i = 0; i < this.#row; i += 1) {
      this.#map.mapTiles[i] = new Array(this.#column).fill(0);
    }
    return this.#map;
  }

  add_path() {
    if (!this.#map) {
      throw new Error("Map is not initialized");
    }
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

  contour_map() {
    if (!this.#map) {
      throw new Error("Map is not initialized");
    }

    // First border
    for (let i = 0; i < this.#row; i += 1) {
      this.#map.mapTiles[i]![0] = 1;
      this.#map.mapTiles[i]![this.#column - 1] = 1;
    }

    for (let j = 0; j < this.#column; j += 1) {
      this.#map.mapTiles[0]![j] = 1;
      this.#map.mapTiles[this.#row - 1]![j] = 1;
    }

    // Second border with random values
    for (let i = 1; i < this.#row - 1; i += 1) {
      this.#map.mapTiles[i]![1] = Math.floor(Math.random() * 2);
      this.#map.mapTiles[i]![this.#column - 2] = Math.floor(Math.random() * 2);
    }

    for (let j = 1; j < this.#column - 1; j += 1) {
      this.#map.mapTiles[1]![j] = Math.floor(Math.random() * 2);
      this.#map.mapTiles[this.#row - 2]![j] = Math.floor(Math.random() * 2);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  calculateCumulativeFrequency(frequencies: number[]) {
    const cumulativeFrequency = [];
    let total = 0;

    frequencies.reduce((acc, weight) => {
      // this is the same as the for loop
      total = acc + weight; // total is the sum of all the weights
      cumulativeFrequency.push(total);
      return total;
    }, 0);
    cumulativeFrequency.push(total); // cumulativeFrequency is the sum of all the weights
    return cumulativeFrequency;
  }

  // eslint-disable-next-line class-methods-use-this
  getSelectedIndex(cumulativeFrequency: number[], randomValue: number) {
    return cumulativeFrequency.findIndex((weight) => randomValue < weight);
  }

  fill_map() {
    const cumulativeFrequency = this.calculateCumulativeFrequency(frequency);

    for (let i = 0; i < this.#row; i += 1) {
      for (let j = 0; j < this.#column; j += 1) {
        if (this.#map.mapTiles[i]![j] === 0) {
          const randomValue =
            Math.random() *
            cumulativeFrequency[cumulativeFrequency.length - 1]!;
          const selectedIndex = this.getSelectedIndex(
            cumulativeFrequency,
            randomValue,
          );
          this.#map.mapTiles[i]![j] = mapTiles[selectedIndex]!;
        }
      }
    }
  }

  run() {
    this.create_empty_map();
    this.add_path();
    this.contour_map();
    this.fill_map();
    console.log(this.#map);
    return this.#map;
  }
}
