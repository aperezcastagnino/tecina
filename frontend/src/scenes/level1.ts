import { GameObjects, Scene } from "phaser";
import { loadLevelData } from "utils/data-util";
import { AssetKeys } from "assets/asset-keys";
import { Player } from "common/player";
import { TILE_SIZE } from "config/config";
import { Controls } from "common/controls";
import { Dialog } from "common-ui/dialog";
import { DialogWithOptions } from "common-ui/dialog-with-options";
import { SceneKeys } from "./scene-keys";

export class Level1 extends Scene {
  #player!: Player;

  #controls!: Controls;

  #dialog: Dialog | undefined;

  #dialogWithOptions: DialogWithOptions | undefined;

  #npcGroup!: GameObjects.Group;

  #awardGroup!: GameObjects.Group;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  create() {
    this.#levelData = loadLevelData(this, SceneKeys.LEVEL_1.toLowerCase());
    this.cameras.main.setBounds(0, 0, 1280, 2176);

    const tilemap = this.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });
    const tileset = tilemap.addTilesetImage(
      "tileset_sunnysideworld",
      AssetKeys.LEVELS.TILESET,
    );
    if (!tileset) {
      console.error(
        `[${Level1.name}:create] encountered error while assigning tileset to the map`,
      );
      return;
    }

    this.#createPlayer(collisionLayer);

    this.#createDialogs();

    this.#createNPCs(tilemap);

    this.#createAwards(tilemap);

    this.#hideElements(this.#awardGroup);

    this.#defineBehaviors();

    this.cameras.main.setBounds(0, 0, 1280, 2176);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update() {
    const directionSelected = this.#controls.getDirectionKeyPressed();
    this.#player.move(directionSelected);

    if (this.#controls.wasSpaceKeyPressed() && !this.#player.isMoving) {
      this.#handlePlayerInteraction();
    }

    if (this.#controls.wasShiftPressed()) {
      this.#dialog?.setMessageComplete("npc-1");
      this.#dialogWithOptions?.show("npc-1");
    }

    if (this.#dialogWithOptions?.isVisible) {
      this.#dialogWithOptions!.handlePlayerInput(
        this.#controls.getKeyPressed()
      );
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
    this.physics.add.collider(this.#player, this.#npcGroup, (_player, npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForNPCs(npcSprite);
    });

    this.physics.add.collider(
      this.#player,
      this.#awardGroup,
      (_player, award) => {
        const awardSprite = award as Phaser.GameObjects.Sprite;
        this.#defineBehaviorForAwards(awardSprite);
      }
    );
  }

  #defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite) {
    if (this.#controls.wasSpaceKeyPressed()) {
      this.#dialog?.show(npc.name);
      this.#showElements(this.#awardGroup);
    }
  }

  #defineBehaviorForAwards(award: Phaser.GameObjects.Sprite) {
    award.destroy();
  }

  #createNPCs(tilemap: Phaser.Tilemaps.Tilemap) {
    const npcsLayer = tilemap.objects.find((f) => f.name === "objs_npcs");

    npcsLayer!.objects.forEach(
      (npcObject: Phaser.Types.Tilemaps.TiledObject) => {
        const npcSprite = this.physics.add.sprite(
          npcObject.x!,
          npcObject.y!,
          AssetKeys.UI.NPCS.BASKETMAN.NAME
        );
        npcSprite.setOrigin(0.5, 0.5);
        npcSprite.setImmovable(true);

        if (this.#npcGroup.getLength() === 0) {
          npcSprite.name = "npc-1";
        } else npcSprite.name = "npc-2";

        this.#npcGroup.add(npcSprite);
      }
    );
  }

  #createAwards(tilemap: Phaser.Tilemaps.Tilemap) {
    const awardsLayer = tilemap.objects.find((f) => f.name === "objs_awards");

    awardsLayer!.objects.forEach((element) => {
      const spriteAward = this.physics.add.sprite(
        element.x!,
        element.y!,
        AssetKeys.UI.AWARD.EYE.NAME
      );
      spriteAward.setOrigin(0.5, 0.5);
      spriteAward.setImmovable(true);

      this.#awardGroup.add(spriteAward);
    });
  }

  #createDialogs() {
    const levelData = loadLevelData(this, SceneKeys.LEVEL_1.toLowerCase());

    this.#dialog = new Dialog({ scene: this, data: levelData.dialogs });
    this.#dialogWithOptions = new DialogWithOptions({
      scene: this,
      data: levelData.dialogs,
      callback: (optionSelected: string) => {
        console.log("Option selected: ", optionSelected);
      },
    });
  }

  #createPlayer(collisionLayer: Phaser.Tilemaps.TilemapLayer) {
    this.#player = new Player({
      scene: this,
      position: {
        x: 2 * TILE_SIZE,
        y: 2 * TILE_SIZE,
      },
      velocity: 700,
    });
    this.physics.add.collider(this.#player, collisionLayer);

    this.#controls = new Controls(this);
  }

  #createMapFromTiled(
    scene: Scene
  ): [
    Phaser.Tilemaps.Tilemap | undefined,
    Phaser.Tilemaps.TilemapLayer | undefined,
  ] {
    const tilemap = scene.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });
    const tileset = tilemap.addTilesetImage(
      "tileset_sunnysideworld",
      AssetKeys.LEVELS.TILESET
    );
    if (!tileset) {
      console.error(
        `[${Level1.name}:create] encountered error while assigning tileset to the map`
      );
      return [undefined, undefined];
    }
    tilemap.createLayer(AssetKeys.LEVELS.GROUND, tileset);
    const collisionLayer = tilemap.createLayer(
      AssetKeys.LEVELS.ELEMENTS,
      tileset
    );
    if (!collisionLayer) {
      console.error(
        `[${Level1.name}:create] encountered error while creating collision layer using data from tiled`
      );
      return [undefined, undefined];
    }
    collisionLayer.setCollisionByExclusion([-1]);

    return [tilemap, collisionLayer];
  }
}
