import {
  TileType,
  TilesAsset,
  type MapConfiguration,
  type TileConfig,
  type MapStructure,
} from "types/map";

type Room = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Partition = {
  x: number;
  y: number;
  width: number;
  height: number;
  left?: Partition;
  right?: Partition;
  room?: Room;
};

const UNUSED_CELL = -2;
const USED_CELL = -1;

export class MapGenerator {
  static #createEmptyMap(
    name: string,
    rows: number,
    columns: number
  ): MapStructure {
    return {
      id: `MAP-${name}`,
      tiles: new Array(rows)
        .fill([])
        .map(() => new Array(columns).fill(UNUSED_CELL)),
      rows,
      columns,
      startPosition: { x: 0, y: 0 },
      assetGroups: new Map(),
    };
  }

  static #splitPartition(
    partition: Partition,
    minPartitionSize: number
  ): Partition {
    const { height, width } = partition;

    const canSplitHorizontally = height > minPartitionSize * 2;
    const canSplitVertically = width > minPartitionSize * 2;

    if (!canSplitHorizontally && !canSplitVertically) {
      return partition;
    }

    const splitHorizontally =
      canSplitHorizontally && (!canSplitVertically || Math.random() < 0.5);

    let left;
    let right;

    if (splitHorizontally) {
      const splitY = Math.floor(
        Math.random() * (height - 2 * minPartitionSize) +
          partition.y +
          minPartitionSize
      );
      left = {
        x: partition.x,
        y: partition.y,
        width,
        height: splitY - partition.y,
      };
      right = {
        x: partition.x,
        y: splitY,
        width,
        height: partition.y + partition.height - splitY,
      };
    } else {
      const splitX = Math.floor(
        Math.random() * (partition.width - 2 * minPartitionSize) +
          partition.x +
          minPartitionSize
      );
      left = {
        x: partition.x,
        y: partition.y,
        width: splitX - partition.x,
        height,
      };
      right = {
        x: splitX,
        y: partition.y,
        width: partition.x + partition.width - splitX,
        height,
      };
    }

    const leftPartition = this.#splitPartition(left, minPartitionSize);
    const rightPartition = this.#splitPartition(right, minPartitionSize);

    return {
      x: partition.x,
      y: partition.y,
      height,
      width,
      left: leftPartition,
      right: rightPartition,
    };
  }

  static #assignRooms(partition: Partition, minRoomSize: number): Partition {
    const newPartition = { ...partition };

    if (!partition.left && !partition.right) {
      const updatedPartition = this.#createRoom(partition, minRoomSize);
      newPartition.room = updatedPartition.room;
    } else {
      if (partition.left) {
        newPartition.left = this.#assignRooms(partition.left, minRoomSize);
      }
      if (partition.right) {
        newPartition.right = this.#assignRooms(partition.right, minRoomSize);
      }
    }
    return newPartition;
  }

  static #createRoom(partition: Partition, minRoomSize: number): Partition {
    const newPartition = { ...partition };
    const roomWidth = Math.floor(
      Math.random() * (partition.width - minRoomSize) + minRoomSize
    );
    const roomHeight = Math.floor(
      Math.random() * (partition.height - minRoomSize) + minRoomSize
    );
    const roomX = Math.floor(
      Math.random() * (partition.width - roomWidth) + partition.x
    );
    const roomY = Math.floor(
      Math.random() * (partition.height - roomHeight) + partition.y
    );

    newPartition.room = {
      x: roomX,
      y: roomY,
      width: roomWidth,
      height: roomHeight,
    };

    return newPartition;
  }

  static #fillMap(
    map: TilesAsset[][],
    matrix: number[][],
    partition: Partition
  ): void {
    const matrixCopy = { ...matrix };
    if (partition.room) {
      const { x, y, width, height } = partition.room;
      for (let i = y; i < y + height; i += 1) {
        for (let j = x; j < x + width; j += 1) {
          matrixCopy[i]![j] = USED_CELL;
        }
      }
    }

    if (partition.left && partition.right) {
      const leftRoom = this.#findRoom(partition.left);
      const rightRoom = this.#findRoom(partition.right);

      if (leftRoom && rightRoom) {
        this.#connectRooms(matrixCopy, leftRoom, rightRoom);
      }

      this.#fillMap(map, matrixCopy, partition.left);
      this.#fillMap(map, matrixCopy, partition.right);
    }
  }

  static #findRoom(partition: Partition): Room | undefined {
    if (partition.room) return partition.room;
    if (partition.left) return this.#findRoom(partition.left);
    if (partition.right) return this.#findRoom(partition.right);
    return undefined;
  }

  static #connectRooms(
    matrix: number[][],
    roomA: Room,
    roomB: Room
  ): number[][] {
    const matrixCopy = { ...matrix };
    const pointA = {
      x: Math.floor(roomA.x + roomA.width / 2),
      y: Math.floor(roomA.y + roomA.height / 2),
    };
    const pointB = {
      x: Math.floor(roomB.x + roomB.width / 2),
      y: Math.floor(roomB.y + roomB.height / 2),
    };

    while (pointA.x !== pointB.x) {
      matrixCopy[pointA.y]![pointA.x] = USED_CELL;
      pointA.x += pointA.x < pointB.x ? 1 : -1;
    }

    while (pointA.y !== pointB.y) {
      matrixCopy[pointA.y]![pointA.x] = USED_CELL;
      pointA.y += pointA.y < pointB.y ? 1 : -1;
    }

    return matrixCopy;
  }

  static #generateMapTile(
    map: MapStructure,
    matrix: number[][],
    tilesConfig: TileConfig[]
  ): void {
    const mapCopy = { ...map };

    const frequencyInteractiveAndEmptySpace = tilesConfig
      .filter(
        (f) =>
          f.type === TileType.INTERACTIVE_OBJECT ||
          f.type === TileType.EMPTY_SPACE
      )
      .map((m) => m.frequency!);

    const assetsInteractiveAndEmptySpace = tilesConfig
      .filter(
        (f) =>
          f.type === TileType.INTERACTIVE_OBJECT ||
          f.type === TileType.EMPTY_SPACE
      )
      .map((m) => m.asset);

    const frequencyNoInteractiveObject = tilesConfig
      .filter((f) => f.type === TileType.OBSTACLE)
      .map((m) => m.frequency!);

    const assetsNoInteractiveObject = tilesConfig
      .filter((f) => f.type === TileType.OBSTACLE)
      .map((m) => m.asset);

    matrix.forEach((column, columnIndex) => {
      column.forEach((element, rowIndex) => {
        if (element === USED_CELL) {
          mapCopy.tiles[columnIndex]![rowIndex] =
            this.#getRandomBasedOnFrequency(
              frequencyInteractiveAndEmptySpace,
              assetsInteractiveAndEmptySpace
            );
          if (map.startPosition.x === 0 && map.startPosition.y === 0) {
            mapCopy.startPosition.x = columnIndex + 1;
            mapCopy.startPosition.y = rowIndex + 1;
          }
        }
        if (element === UNUSED_CELL) {
          mapCopy.tiles[columnIndex]![rowIndex] =
            this.#getRandomBasedOnFrequency(
              frequencyNoInteractiveObject,
              assetsNoInteractiveObject
            );
        }
      });
    });
  }

  static #getRandomBasedOnFrequency<T>(
    frequency: number[],
    arrayOfTiles: T[]
  ): T {
    const totalFrequency = frequency.reduce((a, b) => a + b, 0);
    const randomValue = Math.random() * totalFrequency;

    let cumulative = 0;
    for (let i = 0; i < frequency.length; i += 1) {
      cumulative += frequency[i]!;
      if (randomValue < cumulative) {
        return arrayOfTiles[i]!; // Starts in 3
      }
    }

    return arrayOfTiles[0]!;
  }

  static #fillFreeSpace(
    map: MapStructure,
    partition: Partition,
    quantityOfFreeSpace: number
  ) {
    const mapCopy = { ...map };
    const rooms = this.#getAllRooms(partition);
    for (let i = 0; i < quantityOfFreeSpace; i += 1) {
      const room = this.#getRandomBasedOnFrequency(
        new Array(rooms.length).fill(1),
        rooms
      ) as Room;

      const index = rooms.indexOf(room);
      rooms.splice(index, 1);

      mapCopy.tiles[room.x + Math.trunc(room.width / 2)]![
        room.y + Math.trunc(room.height / 2)
      ] = TilesAsset.FREE_SPACE;
    }
  }

  static #getAllRooms(partition: Partition | undefined): Room[] {
    if (!partition) return [];

    const rooms: Room[] = [];
    if (partition.room) {
      rooms.push(partition.room);
    }

    rooms.push(...this.#getAllRooms(partition.left));
    rooms.push(...this.#getAllRooms(partition.right));

    return rooms;
  }

  static create(config: MapConfiguration): MapStructure {
    const map = MapGenerator.#createEmptyMap(
      config.name,
      config.mapWidth,
      config.mapHeight
    );
    map.initialParameters = config;

    let rootPartition: Partition = {
      x: 0,
      y: 0,
      width: config.mapWidth,
      height: config.mapHeight,
    };
    rootPartition = this.#splitPartition(
      rootPartition,
      config.minPartitionSize
    )!;
    rootPartition = this.#assignRooms(
      rootPartition,
      config.minRoomSize
    );

    const matrix = new Array(config.mapWidth)
      .fill([])
      .map(() => new Array(config.mapHeight).fill(UNUSED_CELL));
    this.#fillMap(map.tiles, matrix, rootPartition);
    this.#generateMapTile(map, matrix, config.tilesConfig);

    const quantityOfFreeSpace =
      config.tilesConfig
        .filter((t) => t.type === TileType.FREE_SPACE)
        .map((m) => m.quantity)[0] ?? 0;
    this.#fillFreeSpace(map, rootPartition, quantityOfFreeSpace);

    return map;
  }
}
