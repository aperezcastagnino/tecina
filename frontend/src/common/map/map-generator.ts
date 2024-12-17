import type { MapStructure } from "types/map";
import { MAP_HEIGHT, MAP_WIDTH, MIN_PARTITION_SIZE, MIN_ROOM_SIZE, MapTileType, TILES_TO_USE, Tiles } from "config/map-config";

type Room = {
  x: number;
  y: number;
  width: number;
  height: number;
  interactuableObject?: InteractuableObject;
};

interface InteractuableObject {
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
const FREE_SPACE = -3;

//#endregion

export class MapGenerator {
  #map!: MapStructure;
  #matrix!: number[][];

  private quantityOfFreeSpace: number;
  private assetOfFreeSpace: Tiles | undefined;

  constructor(sceneKey: string, rows: number, columns: number) {
    this.quantityOfFreeSpace = TILES_TO_USE.filter(f => f.Type == MapTileType.FREE_SPACE).map(m => m.Quantity)[0] ?? 0;
    this.assetOfFreeSpace = TILES_TO_USE.filter(f => f.Type == MapTileType.FREE_SPACE).map(m => m.Asset)[0];

    this.#createEmptyMap(sceneKey, MAP_WIDTH, MAP_HEIGHT);
    const root: Partition = { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT };

    this.splitPartition(root);
    this.assignRooms(root);
    this.fillMap(this.#map.tiles, root);

    this.generateMapTile();
    console.log(root)
    this.fillFreeSpace(root)
    // this.replaceColisionablesWithFrequency(this.#map.tiles)
    console.log(this.#map.tiles)
  }

  #createEmptyMap(sceneKey: string, rows: number, columns: number) {
    this.#matrix = new Array(rows).fill([]).map(() => new Array(columns).fill(UNUSED_CELL)),
      this.#map = {
        id: `MAP-${sceneKey}`,
        tiles: new Array(rows).fill([]).map(() => new Array(columns).fill(UNUSED_CELL)),
        rows,
        columns,
        startPosition: { x: 0, y: 0 },
        finishPosition: { x: 0, y: 0 },
        assetGroups: new Map(),
      };
  }

  splitPartition(partition: Partition): void {
    const canSplitHorizontally = partition.height > MIN_PARTITION_SIZE * 2;
    const canSplitVertically = partition.width > MIN_PARTITION_SIZE * 2;

    if (!canSplitHorizontally && !canSplitVertically) return;

    const splitHorizontally = canSplitHorizontally && (!canSplitVertically || Math.random() < 0.5);

    if (splitHorizontally) {
      const splitY = Math.floor(
        Math.random() * (partition.height - 2 * MIN_PARTITION_SIZE) + partition.y + MIN_PARTITION_SIZE
      );
      partition.left = { x: partition.x, y: partition.y, width: partition.width, height: splitY - partition.y };
      partition.right = { x: partition.x, y: splitY, width: partition.width, height: partition.y + partition.height - splitY };
    } else {
      const splitX = Math.floor(
        Math.random() * (partition.width - 2 * MIN_PARTITION_SIZE) + partition.x + MIN_PARTITION_SIZE
      );
      partition.left = { x: partition.x, y: partition.y, width: splitX - partition.x, height: partition.height };
      partition.right = { x: splitX, y: partition.y, width: partition.x + partition.width - splitX, height: partition.height };
    }

    this.splitPartition(partition.left);
    this.splitPartition(partition.right);
  }
  createRoom(partition: Partition): void {
    const roomWidth = Math.floor(Math.random() * (partition.width - MIN_ROOM_SIZE) + MIN_ROOM_SIZE);
    const roomHeight = Math.floor(Math.random() * (partition.height - MIN_ROOM_SIZE) + MIN_ROOM_SIZE);
    const roomX = Math.floor(Math.random() * (partition.width - roomWidth) + partition.x);
    const roomY = Math.floor(Math.random() * (partition.height - roomHeight) + partition.y);

    partition.room = {
      x: roomX,
      y: roomY,
      width: roomWidth,
      height: roomHeight,
    };
    console.log(partition.room);
  }

  assignRooms(partition: Partition): void {
    if (!partition.left && !partition.right) {
      this.createRoom(partition);
    } else {
      if (partition.left) this.assignRooms(partition.left);
      if (partition.right) this.assignRooms(partition.right);
    }
  }


  getRandomBasedOnFrequency(frecuency: number[], arrayOfTiles: any[]): any {
    const totalFrequency = frecuency.reduce((a, b) => a + b, 0);
    const randomValue = Math.random() * totalFrequency;

    let cumulative = 0;
    for (let i = 0; i < frecuency.length; i++) {
      cumulative += frecuency[i]!;
      if (randomValue < cumulative) {
        return arrayOfTiles[i]!; // Inicia desde 3
      }
    }
  }
  replaceColisionablesWithFrequency(map: Tiles[][]): void {
    let frecuency = TILES_TO_USE.filter(f => f.Type == MapTileType.INTERACTABLE_OBJECT || f.Type == MapTileType.EMPTY_SPACE).map(m => m.Frecuency);
    let assets = TILES_TO_USE.filter(f => f.Type == MapTileType.INTERACTABLE_OBJECT || f.Type == MapTileType.EMPTY_SPACE).map(m => m.Asset);

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y]!.length; x++) {
        if (this.#map.tiles[y]![x] === UNUSED_CELL) {
          if (this.#map.startPosition.x == 0 && this.#map.startPosition.y == 0) {
            this.#map.startPosition.x = x;
            this.#map.startPosition.y = y;
          }
          this.#map.tiles[y]![x] = this.getRandomBasedOnFrequency(frecuency, assets); // Reemplaza solo celdas vacías
        }
      }
    }
  }


  fillMap(map: Tiles[][], partition: Partition): void {

    if (partition.room) {
      const { x, y, width, height } = partition.room;
      for (let i = y; i < y + height; i++) {
        for (let j = x; j < x + width; j++) {
          this.#matrix[i]![j] = USED_CELL;
        }
      }
    }

    if (partition.left && partition.right) {
      const leftRoom = this.findRoom(partition.left);
      const rightRoom = this.findRoom(partition.right);

      if (leftRoom && rightRoom) {
        this.connectRooms(map, leftRoom, rightRoom);
      }

      this.fillMap(map, partition.left);
      this.fillMap(map, partition.right);
    }
  }
  getAllRooms(partition: Partition | undefined): Room[] {
    if (!partition) return []; // Si la partición no existe, retorna un array vacío.
  
    const rooms: Room[] = [];
  
    // Si la partición actual tiene una habitación, la agregamos al array
    if (partition.room) {
      rooms.push(partition.room);
    }
  
    // Recorremos las particiones de la izquierda y la derecha recursivamente
    rooms.push(...this.getAllRooms(partition.left));
    rooms.push(...this.getAllRooms(partition.right));
  
    return rooms;
  }
  fillFreeSpace(partition: Partition) {
    // if (this.quantityOfFreeSpace > 0) {
      for (let i = 0; i <= this.quantityOfFreeSpace; i++) {
        var rooms = this.getAllRooms(partition);
        var room = this.getRandomBasedOnFrequency(new Array(rooms.length).fill(1), rooms) as Room;
        this.#map.tiles[room.x]![room.y] = Tiles.FREE_SPACE;
        this.quantityOfFreeSpace--;
      }
    // }
    // if (partition.room) {
    //   if (this.quantityOfFreeSpace > 0) {
    //     this.#map.tiles[partition.room.x]![partition.room.y] = Tiles.FREE_SPACE;
    //     this.#matrix[partition.room.x]![partition.room.y] = FREE_SPACE;
    //     this.quantityOfFreeSpace--;
    //   }
    // }
    // if (partition.left && this.quantityOfFreeSpace > 0) {
    //   this.fillFreeSpace(partition.left)
    // }
    // if (partition.right && this.quantityOfFreeSpace > 0) {
    //   this.fillFreeSpace(partition.right)
    // }
  }
  generateMapTile() {
    let frecuencyInteractuableAndEmptySpace = TILES_TO_USE.filter(f => f.Type == MapTileType.INTERACTABLE_OBJECT || f.Type == MapTileType.EMPTY_SPACE).map(m => m.Frecuency);
    let assetsInteractuableAndEmptySpace = TILES_TO_USE.filter(f => f.Type == MapTileType.INTERACTABLE_OBJECT || f.Type == MapTileType.EMPTY_SPACE).map(m => m.Asset);

    let frecuencyNoInteractueblaObject = TILES_TO_USE.filter(f => f.Type == MapTileType.NO_INTERACTABLE_OBJECT).map(m => m.Frecuency);
    let assetsNoInteractueblaObject = TILES_TO_USE.filter(f => f.Type == MapTileType.NO_INTERACTABLE_OBJECT).map(m => m.Asset);


    this.#matrix.forEach((column, columnIndex) => {
      column.forEach((element, rowIndex) => {
        if (element == USED_CELL) {
          this.#map.tiles[columnIndex][rowIndex] = this.getRandomBasedOnFrequency(frecuencyInteractuableAndEmptySpace, assetsInteractuableAndEmptySpace)
        }
        if (element == UNUSED_CELL) {
          this.#map.tiles[columnIndex][rowIndex] = this.getRandomBasedOnFrequency(frecuencyNoInteractueblaObject, assetsNoInteractueblaObject)
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

  connectRooms(map: Tiles[][], roomA: Room, roomB: Room): void {
    const pointA = { x: Math.floor(roomA.x + roomA.width / 2), y: Math.floor(roomA.y + roomA.height / 2) };
    const pointB = { x: Math.floor(roomB.x + roomB.width / 2), y: Math.floor(roomB.y + roomB.height / 2) };

    while (pointA.x !== pointB.x) {
      // this.#map.tiles[pointA.y]![pointA.x] = this.getRandomBasedOnFrequency(frecuency, assets);
      this.#matrix[pointA.y]![pointA.x] = USED_CELL;

      pointA.x += pointA.x < pointB.x ? 1 : -1;
    }

    while (pointA.y !== pointB.y) {
      // map[pointA.y]![pointA.x] = this.getRandomBasedOnFrequency(frecuency, assets);
      this.#matrix[pointA.y]![pointA.x] = USED_CELL;
      pointA.y += pointA.y < pointB.y ? 1 : -1;
    }
  }

  static newMap(sceneKey: string, rows: number, columns: number): MapStructure {
    const generator = new MapGenerator(sceneKey, rows, columns);
    return generator.#map;
  }
}
