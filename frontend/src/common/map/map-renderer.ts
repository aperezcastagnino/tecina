import type { Scene } from "phaser";
import { AssetKeys } from "assets/asset-keys";
import type { Map } from "types/map";
import { TILE_SIZE } from "config/config";
import { Tiles } from "config/map-config";
import type { Coordinate } from "types/coordinate";

export class MapRenderer {
  static renderer(scene: Scene, map: Map) {
    const { rows: numberOfRows, columns: numberOfColumns } = map;
    const startPosition: Coordinate = { x: 0, y: 0 };

    let numberOfNPCs = 2;
    const assetNPC = [0, 20];

    for (let row = 0; row < numberOfRows; row += 1) {
      for (let column = 0; column < numberOfColumns; column += 1) {
        const x = startPosition.x + column * TILE_SIZE;
        const y = startPosition.y + row * TILE_SIZE;

        const assetRef = (map.mapTiles[row]?.[column] as Tiles) ?? 0;
        const assetName = Tiles[assetRef]!;

        if (map.assetGroups[assetRef] === undefined) {
          const group = scene.physics.add.staticGroup();
          // eslint-disable-next-line no-param-reassign
          map.assetGroups[assetRef] = group;
          group.name = assetName;
        }

        if (assetRef === Tiles.ORANGE) {
          scene.add
            .image(x, y, AssetKeys.TILES.GRASS)
            .setDisplaySize(TILE_SIZE, TILE_SIZE);

          const sprite = scene.add.sprite(
            x,
            y,
            AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
          );
          sprite.setScale(2);
          sprite.anims.play(`${AssetKeys.ITEMS.FRUITS.ORANGE.NAME}Anim`, true);
          map.assetGroups[assetRef]?.add(sprite);
        } else if (assetRef === Tiles.FREE_SPACE) {
          scene.add
            .image(x, y, AssetKeys.TILES.GRASS)
            .setDisplaySize(TILE_SIZE, TILE_SIZE);

          if (numberOfNPCs > 0) {
            const sprite = scene.add.image(
              x,
              y,
              AssetKeys.CHARACTERS.NPC,
              assetNPC[numberOfNPCs - 1],
            );
            sprite.setScale(3);
            sprite.name = `npc-${numberOfNPCs}`;

            if (map.assetGroups[Tiles.NPC] === undefined) {
              const group = scene.physics.add.staticGroup();
              // eslint-disable-next-line no-param-reassign
              map.assetGroups[Tiles.NPC] = group;
              group.name = "NPC";
            }

            map.assetGroups[Tiles.NPC]?.add(sprite);
            numberOfNPCs -= 1;
          }
        } else {
          const image = scene.add
            .image(x, y, assetName)
            .setDisplaySize(TILE_SIZE, TILE_SIZE);
          map.assetGroups[assetRef]?.add(image);
        }
      }
    }
  }
}
