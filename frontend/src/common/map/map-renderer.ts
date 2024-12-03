import type { Scene } from "phaser";
import { AssetKeys } from "../../assets/asset-keys";
import type { Map } from "../../types/map";
import { TILE_SIZE } from "../../config/config";
import { MAP_COLORS, MAP_TILES_ASSETS } from "../../config/map-config";
import type { Coordinate } from "../../types/coordinate";

export class MapRenderer {
  static renderer(scene: Scene, map: Map) {
    const { rows: numberOfRows, columns: numberOfColumns } = map;
    const startPosition: Coordinate = { x: 0, y: 0 };

    console.log(map.mapTiles)
    for (let row = 0; row < numberOfRows; row += 1) {
      for (let column = 0; column < numberOfColumns; column += 1) {
        const assetRef = map.mapTiles[row]?.[column] ?? 0;

        const x = startPosition.x + column * TILE_SIZE;
        const y = startPosition.y + row * TILE_SIZE;

        const assetName = MAP_TILES_ASSETS[assetRef]!;
        const tileImage = scene.add
        .image(x, y, assetName)
        .setDisplaySize(TILE_SIZE, TILE_SIZE);
      
        let childObject = null;
      map.assetGroups[assetRef]?.add(tileImage);
      childObject = tileImage;
        
      if (MAP_COLORS[assetRef] == 0xffcc66) {
          const spriteAward = scene.add.sprite(
            x,
            y,
            AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
          );
          spriteAward.setScale(2)
          spriteAward.anims.play("OrangeAnim", true);
          childObject = spriteAward; //Sobreescribo childObject

        } 
        if(MAP_COLORS[assetRef]== 0x026440){
          const npcImage = scene.add.image(x,y,AssetKeys.CHARACTERS.NPC);  
          npcImage.setScale(3);
          childObject = npcImage;//Sobreescribo childObject
        }

        if (map.assetGroups[assetRef] === undefined) {
          const group = scene.physics.add.staticGroup();
          // eslint-disable-next-line no-param-reassign
          map.assetGroups[assetRef] = group;
          group.name = assetName;
        }
        map.assetGroups[assetRef]?.add(childObject);//Agrego childObject que puede ser el sprite, la imagen del npc o la imagen original.
      }
    }
  }
}
