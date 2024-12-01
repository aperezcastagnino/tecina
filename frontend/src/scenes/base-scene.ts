import { Scene, GameObjects } from "phaser";
import { loadLevelData } from "../utils/data-util";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { TILE_SIZE } from "../config/config";
import { Controls } from "../common/controls";
import { Player } from "../common/player";
import { Dialog } from "../common-ui/dialog";
import { DialogWithOptions } from "../common-ui/dialog-with-options";

export class BaseScene extends Scene {
  _player!: Player;

  _controls!: Controls;

  _dialog: Dialog | undefined;

  _dialogWithOptions: DialogWithOptions | undefined;

  _npcGroup!: GameObjects.Group;

  _awardGroup!: GameObjects.Group;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(sceneKey: string) {
    super(sceneKey);
  }

  create() {
    this._npcGroup = this.add.group();
    this._awardGroup = this.add.group();

    const [tilemap, collisionLayer] = this.#createMapFromTiled(this);
    if (tilemap === undefined || collisionLayer === undefined) {
      console.error(`ERROR CREATING MAP FROM TILED: ${SceneKeys.LEVEL_1}`);
      return;
    }

    this.#createPlayer(collisionLayer);

    this.#createDialogs();

    this.#createNPCs(tilemap);

    this.#createAwards(tilemap);

    this._defineBehaviors();

    this._hideElements(this._awardGroup);

    this._defineBehaviors();

    this.cameras.main.startFollow(this._player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, 1280, 2176);
    this.cameras.main.fadeIn(1000, 0, 0, 0);
  }

  update() {
    const directionSelected = this._controls.getDirectionKeyPressed();
    this._player.move(directionSelected);

    if (this._controls.wasSpaceKeyPressed()) {
      this.#handlePlayerInteraction();
    }

    if (this._controls.wasShiftPressed()) {
      this._dialog?.setMessageComplete("npc-1");
      this._dialogWithOptions?.show("npc-1");
    }

    if (this._dialogWithOptions?.isVisible) {
      this._dialogWithOptions!.handlePlayerInput(
        this._controls.getKeyPressed(),
      );
    }
  }

  _showElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(true);
      (child as Phaser.GameObjects.Sprite).setVisible(true);
      return true;
    });
  }

  _hideElements(group: GameObjects.Group) {
    group.children.iterate((child) => {
      child.setActive(false);
      (child as Phaser.GameObjects.Sprite).setVisible(false);
      return true;
    });
  }

  #handlePlayerInteraction() {
    if (this._dialog) {
      if (this._dialog.isVisible) {
        this._dialog.showNextMessage();
      }
    }
  }

  _defineBehaviors() {
    this.physics.add.collider(this._player, this._npcGroup, (_player, npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      this._defineBehaviorForNPCs(npcSprite);
    });

    this.physics.add.collider(
      this._player,
      this._awardGroup,
      (_player, award) => {
        const awardSprite = award as Phaser.GameObjects.Sprite;
        this._defineBehaviorForAwards(awardSprite);
      },
    );
  }

  _defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite) {
    if (this._controls.wasSpaceKeyPressed()) {
      this._dialog?.show(npc.name);
      this._showElements(this._awardGroup);
    }
  }

  _defineBehaviorForAwards(award: Phaser.GameObjects.Sprite) {
    award.destroy();
  }

  #createNPCs(tilemap: Phaser.Tilemaps.Tilemap) {
    const npcsLayer = tilemap.objects.find((f) => f.name === "objs_npcs");

    npcsLayer!.objects.forEach(
      (npcObject: Phaser.Types.Tilemaps.TiledObject) => {
        const npcSprite = this.physics.add.sprite(
          npcObject.x!,
          npcObject.y!,
          AssetKeys.UI.NPCS.BASKETMAN.NAME,
        );
        npcSprite.setOrigin(0.5, 0.5);
        npcSprite.setImmovable(true);

        if (this._npcGroup.getLength() === 0) {
          npcSprite.name = "npc-1";
        } else npcSprite.name = "npc-2";

        this._npcGroup.add(npcSprite);
      },
    );
  }

  #createAwards(tilemap: Phaser.Tilemaps.Tilemap) {
    const awardsLayer = tilemap.objects.find((f) => f.name === "objs_awards");

    awardsLayer!.objects.forEach((element) => {
      const spriteAward = this.physics.add.sprite(
        element.x!,
        element.y!,
        AssetKeys.UI.AWARD.EYE.NAME,
      );
      spriteAward.setOrigin(0.5, 0.5);
      spriteAward.setImmovable(true);

      this._awardGroup.add(spriteAward);
    });
  }

  #createDialogs() {
    const levelData = loadLevelData(this, this.scene.key.toLowerCase());

    this._dialog = new Dialog({ scene: this, data: levelData.dialogs });
    this._dialogWithOptions = new DialogWithOptions({
      scene: this,
      data: levelData.dialogs,
      callback: (optionSelected: string) => {
        console.log("Option selected: ", optionSelected);
      },
    });
  }

  #createPlayer(collisionLayer: Phaser.Tilemaps.TilemapLayer) {
    this._player = new Player({
      scene: this,
      position: {
        x: 2 * TILE_SIZE,
        y: 2 * TILE_SIZE,
      },
      velocity: 700,
    });
    this.physics.add.collider(this._player, collisionLayer);

    this._controls = new Controls(this);
  }

  #createMapFromTiled(
    scene: Scene,
  ): [
    Phaser.Tilemaps.Tilemap | undefined,
    Phaser.Tilemaps.TilemapLayer | undefined,
  ] {
    const tilemap = scene.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });
    const tileset = tilemap.addTilesetImage(
      "tileset_sunnysideworld",
      AssetKeys.LEVELS.TILESET,
    );
    if (!tileset) {
      console.error(
        `[${this.scene.key}:create] encountered error while assigning tileset to the map`,
      );
      return [undefined, undefined];
    }
    tilemap.createLayer(AssetKeys.LEVELS.GROUND, tileset);
    const collisionLayer = tilemap.createLayer(
      AssetKeys.LEVELS.ELEMENTS,
      tileset,
    );
    if (!collisionLayer) {
      console.error(
        `[${this.scene.key}:create] encountered error while creating collision layer using data from tiled`,
      );
      return [undefined, undefined];
    }
    collisionLayer.setCollisionByExclusion([-1]);

    return [tilemap, collisionLayer];
  }
}
