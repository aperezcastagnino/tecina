export class MapLogicalGenerator {
  #map: number[][] = [];

  #row: number;

  #column: number;

  constructor(n: number, m: number) {
    this.#row = n;
    this.#column = m;
    this.#map = this.create_empty_map();
  }

  create_empty_map() {
    this.#map = new Array(this.#row);
    for (let i = 0; i < this.#row; i += 1) {
      this.#map[i] = new Array(this.#column).fill(0);
    }
    return this.#map;
  }

  add_path() {
    if (!this.#map) {
      throw new Error("Map is not initialized");
    }
    let x = Math.floor(this.#row / 2);
    let y = 0;

    this.#map[x]![y] = 7;

    while (y < this.#column - 1) {
      const direction = Math.floor(Math.random() * 3); // Randomly choose a direction

      if (direction === 0 && x > 0) {
        x -= 1; // 0 means up
      } else if (direction === 1 && x < this.#row - 1) {
        x += 1; // 1 means down
      }
      if (x >= 0 && x < this.#row && y >= 0 && y < this.#column) {
        // keeps it inside x and y
        this.#map[x]![y] = 7; // keep track of where you have been
        y += 1; // Always move down
        this.#map[x]![y] = 7;
      }
    }
  }

  contour_map() {
    if (!this.#map) {
      throw new Error("Map is not initialized");
    }

    // First border
    for (let i = 0; i < this.#row; i += 1) {
      this.#map[i]![0] = 1;
      this.#map[i]![this.#column - 1] = 1;
    }

    for (let j = 0; j < this.#column; j += 1) {
      this.#map[0]![j] = 1;
      this.#map[this.#row - 1]![j] = 1;
    }

    // Second border
    for (let i = 1; i < this.#row - 1; i += 1) {
      this.#map[i]![1] = Math.floor(Math.random() * 2);
      this.#map[i]![this.#column - 2] = Math.floor(Math.random() * 2);
    }

    for (let j = 1; j < this.#column - 1; j += 1) {
      this.#map[1]![j] = Math.floor(Math.random() * 2);
      this.#map[this.#row - 2]![j] = Math.floor(Math.random() * 2);
    }
  }

  fill_map() {
    const mapTiles = [0, 2, 3, 4, 5, 6, 8, 9];
    const frequency = [1, 20, 0, 1, 0, 0, 0, 1];

    const cumulativeFrequency =
      MapLogicalGenerator.calculateCumulativeFrequency(frequency);

    for (let i = 0; i < this.#row; i += 1) {
      for (let j = 0; j < this.#column; j += 1) {
        if (this.#map[i]![j] === 0) {
          const randomValue =
            Math.random() *
            cumulativeFrequency[cumulativeFrequency.length - 1]!;
          const selectedIndex = MapLogicalGenerator.getSelectedIndex(
            cumulativeFrequency,
            randomValue,
          );
          this.#map[i]![j] = mapTiles[selectedIndex]!;
        }
      }
    }
  }

  private static calculateCumulativeFrequency(frequency: number[]) {
    const cumulativeFrequency = [];
    let total = 0;

    frequency.reduce((acc, weight) => {
      total = acc + weight;
      cumulativeFrequency.push(total);
      return total;
    }, 0);
    cumulativeFrequency.push(total);
    return cumulativeFrequency;
  }

  private static getSelectedIndex(
    cumulativeFrequency: number[],
    randomValue: number,
  ) {
    return cumulativeFrequency.findIndex((weight) => randomValue < weight);
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

const mapLogicalGenerator = new MapLogicalGenerator(10, 10);
export { mapLogicalGenerator };
