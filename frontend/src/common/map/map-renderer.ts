import type { Scene } from "phaser";
import { AssetKeys } from "assets/asset-keys";
import type { MapStructure } from "types/map";
import { TILE_SIZE } from "config/config";
import { Tiles } from "config/map-config";
import { AnimationsKeys } from "assets/animation-keys";

export class MapRenderer {
  static renderer(scene: Scene, map: MapStructure) {
    const { rows: numberOfRows, columns: numberOfColumns } = map;
    const startPosition = { x: 0, y: 0 };

    let numberOfNPCs = 2;
    const assetNPC = [0, 20];

    for (let row = 0; row < numberOfRows; row += 1) {
      for (let column = 0; column < numberOfColumns; column += 1) {
        const x = startPosition.x + TILE_SIZE + column * TILE_SIZE;
        const y = startPosition.y + TILE_SIZE + row * TILE_SIZE;

        const assetRef = (map.tiles[row]?.[column] as Tiles) ?? 0;
        const assetName = Tiles[assetRef]!;

        if (!map.assetGroups.has(assetName) && assetRef !== Tiles.FREE_SPACE) {
          const group = scene.physics.add.staticGroup();
          group.name = assetName;
          map.assetGroups.set(assetName, group);
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
          sprite.setVisible(false);
          sprite.anims.play(AnimationsKeys.ORANGE, true);

          map.assetGroups.get(assetName)!.add(sprite);
        } else if (assetRef === Tiles.STRAWBERRY) {
          scene.add
            .image(x, y, AssetKeys.TILES.GRASS)
            .setDisplaySize(TILE_SIZE, TILE_SIZE);

          const sprite = scene.add.sprite(
            x,
            y,
            AssetKeys.ITEMS.FRUITS.STRAWBERRY.NAME,
          );
          sprite.setScale(2);
          sprite.setVisible(false);
          sprite.anims.play(AnimationsKeys.STRAWBERRY, true);

          map.assetGroups.get(assetName)!.add(sprite);
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

            if (!map.assetGroups.has("NPC")) {
              const group = scene.physics.add.staticGroup();
              group.name = "NPC";
              map.assetGroups.set("NPC", group);
            }

            map.assetGroups.get("NPC")!.add(sprite);
            numberOfNPCs -= 1;
          }
        } else {
          const image = scene.add
            .image(x, y, assetName)
            .setDisplaySize(TILE_SIZE, TILE_SIZE);
          map.assetGroups.get(assetName)!.add(image);
        }
      }
    }
  }
}
