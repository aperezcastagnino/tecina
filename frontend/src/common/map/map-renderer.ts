import type { Scene } from "phaser";
import { AssetKeys } from "../../assets/asset-keys";
import type { Map } from "../../types/map";
import { TILE_SIZE } from "../../config/config";
import { MAP_TILES_ASSETS } from "../../config/map-config";
import type { Coordinate } from "../../types/coordinate";

export class MapRenderer {
  static renderer(scene: Scene, map: Map) {
    const { rows: numberOfRows, columns: numberOfColumns } = map;
    const startPosition: Coordinate = { x: 0, y: 0 };

    for (let row = 0; row < numberOfRows; row += 1) {
      for (let column = 0; column < numberOfColumns; column += 1) {
        const assetRef = map.mapTiles[row]?.[column] ?? 0;

        const x = startPosition.x + column * TILE_SIZE;
        const y = startPosition.y + row * TILE_SIZE;

        const assetName = MAP_TILES_ASSETS[assetRef]!;
        if (assetName === "Orange") {
          const spriteAward = scene.add.sprite(
            x,
            y,
            AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
          );
          spriteAward.anims.play("OrangeAnim", true);

          if (map.assetGroups[assetRef] === undefined) {
            const group = scene.physics.add.staticGroup();
            // eslint-disable-next-line no-param-reassign
            map.assetGroups[assetRef] = group;
            group.name = assetName;
          }
          map.assetGroups[assetRef]?.add(spriteAward);
        } else {
          const tileImage = scene.add
            .image(x, y, assetName)
            .setDisplaySize(TILE_SIZE, TILE_SIZE);

          if (map.assetGroups[assetRef] === undefined) {
            const group = scene.physics.add.staticGroup();
            // eslint-disable-next-line no-param-reassign
            map.assetGroups[assetRef] = group;
            group.name = assetName;
          }
          map.assetGroups[assetRef]?.add(tileImage);
        }
      }
    }
  }
}
