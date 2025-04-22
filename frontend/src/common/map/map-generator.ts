/* eslint-disable no-param-reassign */
import {
  TileType,
  type MapConfiguration,
  type TileConfig,
  type MapStructure,
} from "types/map.d";

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
  static create(config: MapConfiguration): MapStructure {
    /**
    The idea behind this algorithm is as follows:
    1) The screen is divided into partitions using recursion.
    2) Then, rooms are assigned to the different leaves of the partition tree.
       At this point, we have a partition tree where the leaves represent rooms.
    3) Next, the rooms are filled with usable space, where elements can be placed.
    Additionally, the rooms are connected to each other.
    4) **TilesConfig** objects are placed inside the rooms.
    These objects will later determine what should be rendered.
    5) NPCs, or more precisely, immovable interactive objectives,
    are placed at the center of each room.
    */

    if (
      config.dimensions.width < config.minPartitionSize * 2 ||
      config.dimensions.height < config.minPartitionSize * 2
    ) {
      throw new Error(
        "Map dimensions must be at least twice the minimum partition size",
      );
    }

    if (config.minRoomSize > config.minPartitionSize) {
      throw new Error(
        "Minimum room size must be smaller than minimum partition size",
      );
    }

    if (!config.tilesConfig.length) {
      throw new Error("Tiles configuration cannot be empty");
    }

    const map: MapStructure = MapGenerator.createMapStructure(
      config.name,
      config.dimensions.width,
      config.dimensions.height,
    );
    map.initialParameters = config;

    const rootPartition = this.createPartitions(
      {
        x: 0,
        y: 0,
        width: config.dimensions.width,
        height: config.dimensions.height,
      },
      config.minPartitionSize,
    );
    this.assignRooms(rootPartition, config.minRoomSize);

    const matrix = new Array(config.dimensions.width)
      .fill([])
      .map(() => new Array(config.dimensions.height).fill(UNUSED_CELL));

    this.fillAndConnectRooms(matrix, rootPartition);
    this.assignTiles(map, matrix, config.tilesConfig);

    const privateStaticObjects = config.tilesConfig.filter(
      (t) => t.tile.type === TileType.INTERACTIVE_STATIC_OBJECT,
    );
    this.assignInteractiveStaticObject(
      map,
      rootPartition,
      privateStaticObjects,
    );
    this.calculateStartPosition(map);

    return map;
  }

  private static createMapStructure(
    name: string,
    rows: number,
    columns: number,
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

  private static createPartitions(
    partition: Partition,
    minPartitionSize: number,
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
          minPartitionSize,
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
          minPartitionSize,
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

    const leftPartition = this.createPartitions(left, minPartitionSize);
    const rightPartition = this.createPartitions(right, minPartitionSize);

    return {
      x: partition.x,
      y: partition.y,
      height,
      width,
      left: leftPartition,
      right: rightPartition,
    };
  }

  private static assignRooms(
    partition: Partition,
    minRoomSize: number,
  ): Partition {
    if (!partition.left && !partition.right) {
      const updatedPartition = this.createRoom(partition, minRoomSize);
      partition.room = updatedPartition.room;
    } else {
      if (partition.left) {
        partition.left = this.assignRooms(partition.left, minRoomSize);
      }
      if (partition.right) {
        partition.right = this.assignRooms(partition.right, minRoomSize);
      }
    }
    return partition;
  }

  private static createRoom(
    partition: Partition,
    minRoomSize: number,
  ): Partition {
    const roomWidth = Math.floor(
      Math.random() * (partition.width - minRoomSize) + minRoomSize,
    );
    const roomHeight = Math.floor(
      Math.random() * (partition.height - minRoomSize) + minRoomSize,
    );
    const roomX = Math.floor(
      Math.random() * (partition.width - roomWidth) + partition.x,
    );
    const roomY = Math.floor(
      Math.random() * (partition.height - roomHeight) + partition.y,
    );

    partition.room = {
      x: roomX,
      y: roomY,
      width: roomWidth,
      height: roomHeight,
    };

    return partition;
  }

  private static fillAndConnectRooms(
    matrix: number[][],
    partition: Partition,
  ): void {
    if (partition.room) {
      const { x, y, width, height } = partition.room;
      for (let i = y; i < y + height; i += 1) {
        for (let j = x; j < x + width; j += 1) {
          matrix[i]![j] = USED_CELL;
        }
      }
    }

    if (partition.left && partition.right) {
      const leftRoom = this.findRoom(partition.left);
      const rightRoom = this.findRoom(partition.right);

      if (leftRoom && rightRoom) {
        this.connectRooms(matrix, leftRoom, rightRoom);
      }

      this.fillAndConnectRooms(matrix, partition.left);
      this.fillAndConnectRooms(matrix, partition.right);
    }
  }

  private static findRoom(partition: Partition): Room | undefined {
    if (partition.room) return partition.room;
    if (partition.left) return this.findRoom(partition.left);
    if (partition.right) return this.findRoom(partition.right);
    return undefined;
  }

  private static connectRooms(
    matrix: number[][],
    roomA: Room,
    roomB: Room,
  ): number[][] {
    const pointA = {
      x: Math.floor(roomA.x + roomA.width / 2),
      y: Math.floor(roomA.y + roomA.height / 2),
    };
    const pointB = {
      x: Math.floor(roomB.x + roomB.width / 2),
      y: Math.floor(roomB.y + roomB.height / 2),
    };

    while (pointA.x !== pointB.x) {
      matrix[pointA.y]![pointA.x] = USED_CELL;
      pointA.x += pointA.x < pointB.x ? 1 : -1;
    }

    while (pointA.y !== pointB.y) {
      matrix[pointA.y]![pointA.x] = USED_CELL;
      pointA.y += pointA.y < pointB.y ? 1 : -1;
    }

    return matrix;
  }

  private static assignTiles(
    map: MapStructure,
    matrix: number[][],
    tilesConfig: TileConfig[],
  ): void {
    const [
      interactivefrequencyTiles,
      obstaclefrequencyTiles,
      fixedQuantityInteractiveTiles,
    ] = this.prepareTileConfigs(tilesConfig);

    matrix.forEach((row, rowIndex) => {
      row.forEach((element, columnIndex) => {
        if (element === USED_CELL) {
          map.tiles[rowIndex]![columnIndex] = this.getTileBasedOnFrequency(
            interactivefrequencyTiles!.frequencies!,
            interactivefrequencyTiles!.tiles,
          );
        } else if (element === UNUSED_CELL) {
          map.tiles[rowIndex]![columnIndex] = this.getTileBasedOnFrequency(
            obstaclefrequencyTiles!.frequencies!,
            obstaclefrequencyTiles!.tiles,
          );
        }
      });
    });

    const unusedCells = matrix
      .flatMap((row, i) =>
        row.map((value, j) => (value === USED_CELL ? [i, j] : null)),
      )
      .filter(Boolean) as [number, number][];

    fixedQuantityInteractiveTiles?.quantities!.forEach(
      (interactiveObject, index) => {
        for (let i = 0; i < interactiveObject; i += 1) {
          if (unusedCells.length === 0) break;

          const position = this.getTileBasedOnFrequency(
            new Array(unusedCells.length).fill(1),
            unusedCells,
          );
          const [y, x] = position;

          map.tiles[y]![x] = fixedQuantityInteractiveTiles.tiles[index]!;

          const idx = unusedCells.findIndex(([j, k]) => j === y && k === x);
          if (idx !== -1) unusedCells.splice(idx, 1);
        }
      },
    );
  }

  private static calculateStartPosition(map: MapStructure) {
    const result = map.tiles
      .flatMap((row, y) => row.map((tile, x) => ({ tile, x, y })))
      .find(({ tile }) => tile.type === TileType.WALKABLE_SPACE);
    if (!result) {
      throw new Error("No walkable space found for start position");
    }
    map.startPosition.x = result.x;
    map.startPosition.y = result.y;
  }

  private static prepareTileConfigs(tilesConfig: TileConfig[]) {
    const interactiveTiles = tilesConfig.filter(
      (f) =>
        (f.frequency && f.tile.type === TileType.INTERACTIVE_OBJECT) ||
        f.tile.type === TileType.WALKABLE_SPACE,
    );

    const obstacleTiles = tilesConfig.filter(
      (f) => f.frequency && f.tile.type === TileType.OBSTACLE,
    );

    const fixedQuantityInteractiveTiles = tilesConfig.filter(
      (f) =>
        (f.quantity && f.tile.type === TileType.INTERACTIVE_OBJECT) ||
        f.tile.type === TileType.WALKABLE_SPACE,
    );

    return [
      {
        frequencies: interactiveTiles.map((m) => m.frequency || 0),
        tiles: interactiveTiles.map((m) => m.tile!),
      },
      {
        frequencies: obstacleTiles.map((m) => m.frequency || 0),
        tiles: obstacleTiles.map((m) => m.tile),
      },
      {
        quantities: fixedQuantityInteractiveTiles.map((m) => m.quantity || 0),
        tiles: fixedQuantityInteractiveTiles.map((m) => m.tile),
      },
    ];
  }

  private static getTileBasedOnFrequency<T>(
    frequencies: number[],
    tiles: T[],
  ): T {
    const totalFrequency = frequencies.reduce((a, b) => a + b, 0);
    const randomValue = Math.random() * totalFrequency;

    let cumulative = 0;
    for (let i = 0; i < frequencies.length; i += 1) {
      cumulative += frequencies[i]!;
      if (randomValue < cumulative) {
        return tiles[i]!;
      }
    }

    return tiles[0]!;
  }

  private static assignInteractiveStaticObject(
    map: MapStructure,
    partition: Partition,
    tiles: TileConfig[],
  ) {
    const rooms = this.getAllRooms(partition);

    tiles.forEach((tile) => {
      for (let i = 0; i < (tile.quantity || 0); i += 1) {
        const room = this.getTileBasedOnFrequency(
          new Array(rooms.length).fill(1),
          rooms,
        );

        rooms.splice(rooms.indexOf(room), 1);

        map.tiles[room.y + Math.floor(room.width / 2)]![
          room.x + Math.floor(room.height / 2)
        ] = tile.tile;
      }
    });
  }

  private static getAllRooms(partition: Partition | undefined): Room[] {
    if (!partition) return [];

    const rooms: Room[] = [];
    if (partition.room) {
      rooms.push(partition.room);
    }

    rooms.push(...this.getAllRooms(partition.left));
    rooms.push(...this.getAllRooms(partition.right));

    return rooms;
  }
}
