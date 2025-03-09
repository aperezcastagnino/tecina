import type { Scene } from "phaser";
import { AssetKeys } from "assets/asset-keys";
import { TileType, type MapStructure } from "types/map.d";
import { TILE_SIZE } from "config/config";

const DEFAULT_FLOOR_ASSET = AssetKeys.TILES.GRASS;

export class MapRenderer {
  static render(scene: Scene, map: MapStructure): void {
    const { rows: numberOfRows, columns: numberOfColumns } = map;

    for (let row = 0; row < numberOfRows; row += 1) {
      for (let column = 0; column < numberOfColumns; column += 1) {
        const x = TILE_SIZE + column * TILE_SIZE;
        const y = TILE_SIZE + row * TILE_SIZE;

        const tile = map.tiles[row]![column]!;

        this.#ensureAssetGroup(scene, map, tile.asset, tile.type);
        this.#renderTile(scene, map, x, y, tile.asset, tile.type);
      }
    }
  }

  static #ensureAssetGroup(
    scene: Scene,
    map: MapStructure,
    assetName: string,
    type: TileType,
  ): void {
    if (type !== TileType.WALKABLE_SPACE && !map.assetGroups.has(assetName)) {
      const group = scene.physics.add.staticGroup();
      group.name = assetName;
      map.assetGroups.set(assetName, group);
    }
  }

  static #renderTile(
    scene: Scene,
    map: MapStructure,
    x: number,
    y: number,
    assetName: string,
    type: TileType,
  ): void {
    switch (type) {
      case TileType.WALKABLE_SPACE:
        this.#renderWalkableSpace(scene, x, y, assetName);
        break;
      case TileType.INTERACTIVE_OBJECT:
        this.#renderInteractiveObject(scene, map, x, y, assetName);
        break;
      case TileType.INTERACTIVE_IMMOVABLE_OBJECT:
        this.#renderInteractiveImmovableObject(scene, map, x, y, assetName);
        break;
      default:
        this.#renderObstacle(scene, map, x, y, assetName);
    }
  }

  static #renderWalkableSpace(
    scene: Scene,
    x: number,
    y: number,
    assetName: string,
  ): void {
    scene.add.image(x, y, assetName).setDisplaySize(TILE_SIZE, TILE_SIZE);
  }

  static #renderInteractiveObject(
    scene: Scene,
    map: MapStructure,
    x: number,
    y: number,
    assetName: string,
  ): void {
    scene.add
      .image(x, y, DEFAULT_FLOOR_ASSET)
      .setDisplaySize(TILE_SIZE, TILE_SIZE);

    const sprite = scene.add.sprite(x, y, assetName);
    sprite.setScale(2);
    sprite.anims.play(`${assetName}_ANIMATION`, true);

    const group = map.assetGroups.get(assetName);
    if (!group) throw new Error(`Missing asset group for ${assetName}`);
    group.add(sprite);
  }

  static #renderInteractiveImmovableObject(
    scene: Scene,
    map: MapStructure,
    x: number,
    y: number,
    assetName: string,
  ): void {
    scene.add
      .image(x, y, DEFAULT_FLOOR_ASSET)
      .setDisplaySize(TILE_SIZE, TILE_SIZE);

    const sprite = scene.add.image(x, y, AssetKeys.CHARACTERS.NPC, assetName);
    sprite.setScale(3);
    sprite.name = `npc-${Math.floor(Math.random() * 1000)}`;

    const group = map.assetGroups.get(assetName);
    if (!group) throw new Error(`Missing asset group for ${assetName}`);
    group.add(sprite);
  }

  static #renderObstacle(
    scene: Scene,
    map: MapStructure,
    x: number,
    y: number,
    assetName: string,
  ): void {
    const image = scene.add
      .image(x, y, assetName)
      .setDisplaySize(TILE_SIZE, TILE_SIZE);

    const group = map.assetGroups.get(assetName);
    if (!group) throw new Error(`Missing asset group for ${assetName}`);
    group.add(image);
  }
}
