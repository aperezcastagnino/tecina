import { Scene, GameObjects } from "phaser";
import { AssetKeys } from "../assets/asset-keys";
import { MAP_HEIGHT, MAP_WIDTH } from "../config/map-config";
import { MapGenerator } from "../common/map/map-generator";
import type { Map } from "../types/map";
import { MapRenderer } from "../common/map/map-renderer";
import { loadLevelData } from "../utils/data-util";
import { SceneKeys } from "./scene-keys";
import { GAME_DIMENSIONS } from "../config/config";
import { Controls } from "../common/controls";
import { Player } from "../common/player";
import { Dialog } from "../common-ui/dialog";

export class Level1 extends Scene {
  #player!: Player;

  #controls!: Controls;

  #dialog: Dialog | undefined;

  #map!: Map;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  preload() {
    this.#map = MapGenerator.newMap(SceneKeys.LEVEL_1, MAP_HEIGHT, MAP_WIDTH);

    this.anims.create({
      key: "OrangeAnim",
      frames: this.anims.generateFrameNumbers(
        AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      ),
      frameRate: 19,
      repeat: -1,
    });
  }

  create() {
    MapRenderer.renderer(this, this.#map);

    console.log(this.#map);

    this.#createPlayer();

    this.#createDialogs();

    // this.#hideElements(this.#awardGroup);

    this.#defineBehaviors();

    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update() {
    const directionSelected = this.#controls.getDirectionKeyPressed();
    this.#player.move(directionSelected);

    if (this.#controls.wasSpaceKeyPressed()) {
      this.#handlePlayerInteraction();
    }
  }

  #handlePlayerInteraction() {
    if (this.#dialog) {
      if (this.#dialog.isVisible) {
        this.#dialog.showNextMessage();
      }
    }
  }

  #showElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(true);
      (child as Phaser.GameObjects.Sprite).setVisible(true);
      return true;
    });
  }

  #hideElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(false);
      (child as Phaser.GameObjects.Sprite).setVisible(false);
      return true;
    });
  }

  #defineBehaviors() {
    this.physics.add.collider(this.#player, this.#map.assetGroups[1]!);
    // this.physics.add.collider(this.#player, this.#npcGroup, (_player, npc) => {
    //   const npcSprite = npc as Phaser.GameObjects.Sprite;
    //   this.#defineBehaviorForNPCs(npcSprite);
    // });

    // this.physics.add.collider(
    //   this.#player,
    //   this.#awardGroup,
    //   (_player, award) => {
    //     const awardSprite = award as Phaser.GameObjects.Sprite;
    //     this.#defineBehaviorForAwards(awardSprite);
    //   },
    // );
  }

  // #defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite) {
  //   if (this.#controls.wasSpaceKeyPressed()) {
  //     this.#dialog?.show(npc.name);
  //     this.#showElements(this.#awardGroup);
  //   }
  // }

  // #defineBehaviorForAwards(award: Phaser.GameObjects.Sprite) {
  //   award.destroy();
  // }

  // #createNPCs(tilemap: Phaser.Tilemaps.Tilemap) {
  //   const npcsLayer = tilemap.objects.find((f) => f.name === "objs_npcs");

  //   npcsLayer!.objects.forEach(
  //     (npcObject: Phaser.Types.Tilemaps.TiledObject) => {
  //       const npcSprite = this.physics.add.sprite(
  //         npcObject.x!,
  //         npcObject.y!,
  //         AssetKeys.UI.NPCS.BASKETMAN.NAME,
  //       );
  //       npcSprite.setOrigin(0.5, 0.5);
  //       npcSprite.setImmovable(true);

  //       if (this.#npcGroup.getLength() === 0) {
  //         npcSprite.name = "npc-1";
  //       } else npcSprite.name = "npc-2";

  //       this.#npcGroup.add(npcSprite);
  //     },
  //   );
  // }

  // #createAwards(tilemap: Phaser.Tilemaps.Tilemap) {
  //   const awardsLayer = tilemap.objects.find((f) => f.name === "objs_awards");

  //   awardsLayer!.objects.forEach((element) => {
  //     const spriteAward = this.physics.add.sprite(
  //       element.x!,
  //       element.y!,
  //       AssetKeys.UI.AWARD.EYE.NAME,
  //     );
  //     spriteAward.setOrigin(0.5, 0.5);
  //     spriteAward.setImmovable(true);

  //     this.#awardGroup.add(spriteAward);
  //   });
  // }

  #createDialogs() {
    const levelData = loadLevelData(this, SceneKeys.LEVEL_1.toLowerCase());

    this.#dialog = new Dialog({ scene: this, data: levelData.dialogs });
  }

  #createPlayer() {
    this.#player = new Player({
      scene: this,
      position: {
        x: this.#map.startPosition.x + 190,
        y: this.#map.startPosition.y + GAME_DIMENSIONS.HEIGHT / 2 + 40,
      },
      velocity: 700,
    });

    this.#controls = new Controls(this);
  }
}
