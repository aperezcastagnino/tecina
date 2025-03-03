import type { MapStructure } from "types/map";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  MIN_PARTITION_SIZE,
  MIN_ROOM_SIZE,
  MapTileType,
  TILES_TO_USE,
  Tiles,
} from "config/map-config";

type Room = {
  x: number;
  y: number;
  width: number;
  height: number;
  interactiveObject?: InteractiveObject;
};

interface InteractiveObject {
  x: number;
  y: number;
}

interface Partition {
  x: number;
  y: number;
  width: number;
  height: number;
  left?: Partition;
  right?: Partition;
  room?: Room;
}

const UNUSED_CELL = -2;
const USED_CELL = -1;

export class MapGenerator {
  #map!: MapStructure;

  #matrix!: number[][];

  #root!: Partition;

  private quantityOfFreeSpace: number;

  constructor(sceneKey: string) {
    this.quantityOfFreeSpace =
      TILES_TO_USE.filter((f) => f.Type === MapTileType.FREE_SPACE).map(
        (m) => m.Quantity,
      )[0] ?? 0;

    this.#createEmptyMap(sceneKey, MAP_WIDTH, MAP_HEIGHT);
    this.#root = {
      x: 0,
      y: 0,
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
    };

    this.#root = this.splitPartition(this.#root)!;
    this.#root = this.assignRooms(this.#root);
    this.fillMap(this.#map.tiles, this.#root);

    this.generateMapTile();
    this.fillFreeSpace(this.#root);
  }

  #createEmptyMap(sceneKey: string, rows: number, columns: number) {
    this.#matrix = new Array(rows)
      .fill([])
      .map(() => new Array(columns).fill(UNUSED_CELL));
    this.#map = {
      id: `MAP-${sceneKey}`,
      tiles: new Array(rows)
        .fill([])
        .map(() => new Array(columns).fill(UNUSED_CELL)),
      rows,
      columns,
      startPosition: { x: 0, y: 0 },
      assetGroups: new Map(),
    };
  }

  splitPartition(partition: Partition): Partition {
    const partitionCopy = { ...partition };

    const canSplitHorizontally = partitionCopy.height > MIN_PARTITION_SIZE * 2;
    const canSplitVertically = partitionCopy.width > MIN_PARTITION_SIZE * 2;

    if (!canSplitHorizontally && !canSplitVertically) {
      return partitionCopy;
    }

    const splitHorizontally =
      canSplitHorizontally && (!canSplitVertically || Math.random() < 0.5);

    let left;
    let right;

    if (splitHorizontally) {
      const splitY = Math.floor(
        Math.random() * (partitionCopy.height - 2 * MIN_PARTITION_SIZE) +
          partitionCopy.y +
          MIN_PARTITION_SIZE,
      );
      left = {
        x: partitionCopy.x,
        y: partitionCopy.y,
        width: partitionCopy.width,
        height: splitY - partitionCopy.y,
      };
      right = {
        x: partitionCopy.x,
        y: splitY,
        width: partitionCopy.width,
        height: partitionCopy.y + partitionCopy.height - splitY,
      };
    } else {
      const splitX = Math.floor(
        Math.random() * (partitionCopy.width - 2 * MIN_PARTITION_SIZE) +
          partitionCopy.x +
          MIN_PARTITION_SIZE,
      );
      left = {
        x: partitionCopy.x,
        y: partitionCopy.y,
        width: splitX - partitionCopy.x,
        height: partitionCopy.height,
      };
      right = {
        x: splitX,
        y: partitionCopy.y,
        width: partitionCopy.x + partitionCopy.width - splitX,
        height: partitionCopy.height,
      };
    }

    const leftPartition = this.splitPartition(left);
    const rightPartition = this.splitPartition(right);

    return {
      x: partition.x,
      y: partition.y,
      height: partition.height,
      width: partition.width,
      left: leftPartition,
      right: rightPartition,
    };
  }

  createRoom(partition: Partition): Partition {
    const newPartition = { ...partition };
    const roomWidth = Math.floor(
      Math.random() * (partition.width - MIN_ROOM_SIZE) + MIN_ROOM_SIZE,
    );
    const roomHeight = Math.floor(
      Math.random() * (partition.height - MIN_ROOM_SIZE) + MIN_ROOM_SIZE,
    );
    const roomX = Math.floor(
      Math.random() * (partition.width - roomWidth) + partition.x,
    );
    const roomY = Math.floor(
      Math.random() * (partition.height - roomHeight) + partition.y,
    );

    newPartition.room = {
      x: roomX,
      y: roomY,
      width: roomWidth,
      height: roomHeight,
    };

    return newPartition;
  }

  assignRooms(partition: Partition): Partition {
    const newPartition = { ...partition };

    if (!partition.left && !partition.right) {
      const updatedPartition = this.createRoom(partition);
      newPartition.room = updatedPartition.room; // Assign the room to the original object
    } else {
      if (partition.left) {
        newPartition.left = this.assignRooms(partition.left);
      }
      if (partition.right) {
        newPartition.right = this.assignRooms(partition.right);
      }
    }
    return newPartition;
  }

  getRandomBasedOnFrequency(frequency: number[], arrayOfTiles: any[]): any {
    const totalFrequency = frequency.reduce((a, b) => a + b, 0);
    const randomValue = Math.random() * totalFrequency;

    let cumulative = 0;
    for (let i = 0; i < frequency.length; i += 1) {
      cumulative += frequency[i]!;
      if (randomValue < cumulative) {
        return arrayOfTiles[i]!; // Starts in 3
      }
    }
    return arrayOfTiles[0];
  }

  fillMap(map: Tiles[][], partition: Partition): void {
    if (partition.room) {
      const { x, y, width, height } = partition.room;
      for (let i = y; i < y + height; i += 1) {
        for (let j = x; j < x + width; j += 1) {
          this.#matrix[i]![j] = USED_CELL;
        }
      }
    }

    if (partition.left && partition.right) {
      const leftRoom = this.findRoom(partition.left);
      const rightRoom = this.findRoom(partition.right);

      if (leftRoom && rightRoom) {
        this.connectRooms(leftRoom, rightRoom);
      }

      this.fillMap(map, partition.left);
      this.fillMap(map, partition.right);
    }
  }

  getAllRooms(partition: Partition | undefined): Room[] {
    if (!partition) return [];

    const rooms: Room[] = [];

    if (partition.room) {
      rooms.push(partition.room);
    }

    rooms.push(...this.getAllRooms(partition.left));
    rooms.push(...this.getAllRooms(partition.right));

    return rooms;
  }

  fillFreeSpace(partition: Partition) {
    const rooms = this.getAllRooms(partition);
    for (let i = 0; i < this.quantityOfFreeSpace; i += 1) {
      const room = this.getRandomBasedOnFrequency(
        new Array(rooms.length).fill(1),
        rooms,
      ) as Room;
      const index = rooms.indexOf(room);
      rooms.splice(index, 1);

      this.#map.tiles[room.x + Math.trunc(room.width / 2)]![
        room.y + Math.trunc(room.height / 2)
      ] = Tiles.FREE_SPACE;
    }
  }

  generateMapTile() {
    const frequencyInteractiveAndEmptySpace = TILES_TO_USE.filter(
      (f) =>
        f.Type === MapTileType.INTERACTIVE_OBJECT ||
        f.Type === MapTileType.EMPTY_SPACE,
    ).map((m) => m.Frequency!);
    const assetsInteractiveAndEmptySpace = TILES_TO_USE.filter(
      (f) =>
        f.Type === MapTileType.INTERACTIVE_OBJECT ||
        f.Type === MapTileType.EMPTY_SPACE,
    ).map((m) => m.Asset);

    const frequencyNoInteractiveObject = TILES_TO_USE.filter(
      (f) => f.Type === MapTileType.NO_INTERACTIVE_OBJECT,
    ).map((m) => m.Frequency!);
    const assetsNoInteractiveObject = TILES_TO_USE.filter(
      (f) => f.Type === MapTileType.NO_INTERACTIVE_OBJECT,
    ).map((m) => m.Asset);

    this.#matrix.forEach((column, columnIndex) => {
      column.forEach((element, rowIndex) => {
        if (element === USED_CELL) {
          this.#map.tiles[columnIndex]![rowIndex] =
            this.getRandomBasedOnFrequency(
              frequencyInteractiveAndEmptySpace,
              assetsInteractiveAndEmptySpace,
            );
          if (
            this.#map.startPosition.x === 0 &&
            this.#map.startPosition.y === 0
          ) {
            this.#map.startPosition.x = columnIndex + 1;
            this.#map.startPosition.y = rowIndex + 1;
          }
        }
        if (element === UNUSED_CELL) {
          this.#map.tiles[columnIndex]![rowIndex] =
            this.getRandomBasedOnFrequency(
              frequencyNoInteractiveObject,
              assetsNoInteractiveObject,
            );
        }
      });
    });
  }

  findRoom(partition: Partition): Room | undefined {
    if (partition.room) return partition.room;
    if (partition.left) return this.findRoom(partition.left);
    if (partition.right) return this.findRoom(partition.right);
    return undefined;
  }

  connectRooms(roomA: Room, roomB: Room): void {
    const pointA = {
      x: Math.floor(roomA.x + roomA.width / 2),
      y: Math.floor(roomA.y + roomA.height / 2),
    };
    const pointB = {
      x: Math.floor(roomB.x + roomB.width / 2),
      y: Math.floor(roomB.y + roomB.height / 2),
    };

    while (pointA.x !== pointB.x) {
      // this.#map.tiles[pointA.y]![pointA.x] = this.getRandomBasedOnFrequency(frequency, assets);
      this.#matrix[pointA.y]![pointA.x] = USED_CELL;

      pointA.x += pointA.x < pointB.x ? 1 : -1;
    }

    while (pointA.y !== pointB.y) {
      // map[pointA.y]![pointA.x] = this.getRandomBasedOnFrequency(frequency, assets);
      this.#matrix[pointA.y]![pointA.x] = USED_CELL;
      pointA.y += pointA.y < pointB.y ? 1 : -1;
    }
  }

  static newMap(sceneKey: string): MapStructure {
    const generator = new MapGenerator(sceneKey);
    return generator.#map;
  }
}
