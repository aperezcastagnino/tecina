import type { Scene } from "phaser";
import { TileType, type MapStructure, type TileConfig } from "types/map.d";
import { TILE_SIZE } from "config";
import { TileKeys } from "assets/assets";

const DEFAULT_FLOOR_ASSET = TileKeys.GRASS;

export class MapRenderer {
  static render(scene: Scene, map: MapStructure): void {
    const { rows: numberOfRows, columns: numberOfColumns } = map;

    for (let row = 0; row < numberOfRows; row += 1) {
      for (let column = 0; column < numberOfColumns; column += 1) {
        const x = TILE_SIZE / 2 + column * TILE_SIZE;
        const y = TILE_SIZE / 2 + row * TILE_SIZE;

        const tile: TileConfig = map.tiles[row]![column]!;

        this.ensureAssetGroup(scene, map, tile.type, tile.assetKey);
        this.renderTile(scene, map, x, y, tile.type, tile.assetKey, tile.frame);
      }
    }
  }

  private static ensureAssetGroup(
    scene: Scene,
    map: MapStructure,
    type: TileType,
    assetName: string,
  ): void {
    if (type !== TileType.WALKABLE_SPACE && !map.assetGroups.has(assetName)) {
      const group = scene.physics.add.staticGroup();
      group.name = assetName;
      map.assetGroups.set(assetName, group);
    }
  }

  private static renderTile(
    scene: Scene,
    map: MapStructure,
    x: number,
    y: number,
    type: TileType,
    assetName: string,
    frame: number = 0,
  ): void {
    switch (type) {
      case TileType.WALKABLE_SPACE:
        this.renderWalkableSpace(scene, x, y, assetName);
        break;
      case TileType.INTERACTIVE_OBJECT:
        this.renderInteractiveObject(scene, map, x, y, assetName);
        break;
      case TileType.INTERACTIVE_STATIC_OBJECT:
        this.renderInteractiveStaticObject(scene, map, x, y, assetName, frame);
        break;
      default:
        this.renderObstacle(scene, map, x, y, assetName);
    }
  }

  private static renderWalkableSpace(
    scene: Scene,
    x: number,
    y: number,
    assetName: string,
  ): void {
    scene.add.image(x, y, assetName).setDisplaySize(TILE_SIZE, TILE_SIZE);
  }

  private static renderInteractiveObject(
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

  static renderInteractiveStaticObject(
    scene: Scene,
    map: MapStructure,
    x: number,
    y: number,
    assetName: string,
    frame: number,
  ): void {
    scene.add
      .image(x, y, DEFAULT_FLOOR_ASSET)
      .setDisplaySize(TILE_SIZE, TILE_SIZE);

    const sprite = scene.add.image(x, y, assetName, frame);
    sprite.setScale(3);
    sprite.name = `${assetName}_${frame}`;

    const group = map.assetGroups.get(assetName);
    if (!group) throw new Error(`Missing asset group for ${assetName}`);
    group.add(sprite);
  }

  private static renderObstacle(
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
