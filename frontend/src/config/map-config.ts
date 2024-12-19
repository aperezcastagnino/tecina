import { AssetKeys } from "assets/asset-keys";

export type MapParameters = {
  rows: number;
  columns: number;
  tiles: Tiles[];
  frequency: number[];
  number_of_elements: number[];
  number_of_npcs: number;
};

export enum MapTileType {
  // ESTOS SE COLOCAN SOBRE CAMINO CAMINABLE DEL NPC
  EMPTY_SPACE = "EMPTY_SPACE", // ESTO ES LUGAR DONDE CAMINA EL PLAYER
  FREE_SPACE = "FREE_SPACE", // ESTO ES LUGAR DONDE SE COLOCAN LOS NPC'S
  INTERACTABLE_OBJECT = "INTERACTABLE_OBJECT", // ESTO SON LAS NARANJAS, MANZANAS ETC
  // FREE_SPACE GARANTIZO DE QUE SEA ALCANZABLE
  // INTERACTABLE_OBJECT ES ALCANZABLE PERO PUEDE SER OBSTACULIZADO POR OTRO OBJETO DEL MISMO TIPO

  // ESTO SON LUGARES NO CAMINABLES DEL NPC
  NO_INTERACTABLE_OBJECT = "NO_INTERACTABLE_OBJECT", // ESTO SON ARBOLES O DEMAS OBJETOS QUE CHOCA EL PLAYER
}

export enum Tiles {
  FREE_SPACE = 0,
  GRASS = 1,
  TREE = 2,
  FLOWER_GRASS = 3,
  ORANGE = 4,
  NPC = 5,
}

export type TilesToUseConfig = {
  Type: MapTileType;
  Asset: Tiles;
  Frecuency?: number;
  Quantity?: number;
};

export const TILES_TO_USE: TilesToUseConfig[] = [
  {
    Type: MapTileType.FREE_SPACE, // NECESITO 2 NPC'S
    Asset: Tiles.FREE_SPACE,
    Quantity: 2,
  },
  {
    Type: MapTileType.EMPTY_SPACE, // EL 100% DE MI CAMINO CAMINABLE ES PASTO
    Asset: Tiles.GRASS,
    Frecuency: 50,
  },
  {
    Type: MapTileType.EMPTY_SPACE, // EL 100% DE MI CAMINO CAMINABLE ES PASTO
    Asset: Tiles.FLOWER_GRASS,
    Frecuency: 50,
  },
  {
    Type: MapTileType.NO_INTERACTABLE_OBJECT, // EL 100% DE LOS OBJETOS INTERACTUABL SON ARBOLES
    Asset: Tiles.TREE,
    Frecuency: 50,
  },
  {
    Type: MapTileType.NO_INTERACTABLE_OBJECT, // EL 100% DE LOS OBJETOS INTERACTUABL SON ARBOLES
    Asset: Tiles.TREE,
    Frecuency: 50,
  },
  {
    Type: MapTileType.INTERACTABLE_OBJECT, // EL 100% DE LOS OBJETOS INTERACTUABLE SON NARANJAS
    Asset: Tiles.ORANGE,
    Frecuency: 10,
  },
];

export const MAP_WIDTH = 10;
export const MAP_HEIGHT = 10;
export const MIN_PARTITION_SIZE = 4;
export const MIN_ROOM_SIZE = 4;

export const MAP_TILES_ASSETS: { [key: number]: string } = {
  0: AssetKeys.TILES.GRASS,
  1: AssetKeys.TILES.TREE, // Only 1s are collidable
  2: AssetKeys.TILES.GRASS,
};
