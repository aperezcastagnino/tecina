import { AssetKeys } from "assets/asset-keys";
import { AnimationsKeys } from "assets/animation-keys";
import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";
import { TILE_SIZE } from "config/config";
import { GameObjects } from "phaser";
import { Awards } from "common-ui/awards";
import { MAP_WIDTH } from "config/map-config";

export class Level1 extends BaseScene {
  #total_oranges = 0;

  #collected_oranges = 0;

  #npc_1_show_first_message!: boolean;

  #npc_1_show_first_complete_collect_objects!: boolean;

  #npc_1_show_intermediate_message!: boolean;

  #has_object_in_the_bag!: boolean;

  #bag_objects!: Phaser.GameObjects.Sprite;

  #award!: Awards;

  constructor() {
    super(SceneKeys.LEVEL_1);

    this.#npc_1_show_first_message = true;
    this.#npc_1_show_first_complete_collect_objects = true;
    this.#npc_1_show_intermediate_message = false;
  }

  create() {
    super.create();

    this._hideElements(
      this._map.assetGroups.get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!,
    );
  }

  preload() {
    super.preload(SceneKeys.LEVEL_1);

    this.anims.create({
      key: AnimationsKeys.ORANGE,
      frames: this.anims.generateFrameNumbers(
        AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      ),
      frameRate: 19,
      repeat: -1,
    });
  }

  _defineBehaviors() {
    const treeGroup = this._map.assetGroups.get(AssetKeys.TILES.TREE)!;
    const orangeGroup = this._map.assetGroups.get(
      AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
    )!;
    const npcGroup = this._map.assetGroups.get(AssetKeys.CHARACTERS.NPC)!;

    this.physics.add.collider(this._player, treeGroup);

    this.#total_oranges = orangeGroup.getChildren().length;

    this.#award = new Awards({
      assetKey: AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
      frameRate: 19,
      padding: 0,
      scale: 2,
      scene: this,
      width: MAP_WIDTH * TILE_SIZE,
      spriteConfig: {
        startFrame: AssetKeys.ITEMS.FRUITS.ORANGE.STAR_FRAME,
        endFrame: AssetKeys.ITEMS.FRUITS.ORANGE.END_FRAME,
        frameWidth: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_WIDTH,
        frameHeight: AssetKeys.ITEMS.FRUITS.ORANGE.FRAME_HEIGHT,
      },
    });

    this.physics.add.collider(this._player, npcGroup, (_player, npc) => {
      const npcSprite = npc as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForNPCs(npcSprite);
    });
  }

  #defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite) {
    this.#total_oranges = this._map.assetGroups
      .get(AssetKeys.ITEMS.FRUITS.ORANGE.NAME)!
      .getLength();

    if (npc.name === "npc-1" && this.#has_object_in_the_bag) {
      this.#collected_oranges += 1;
      this.#award.setAwardsCount(this.#collected_oranges);
      this.#bag_objects.destroy();
      this.#has_object_in_the_bag = false;
      return;
    }
    if (this._controls.wasSpaceKeyPressed()) {
      if (npc.name === "npc-1") {
        const orangeGroup = this._map.assetGroups.get(
          AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
        )!;

        if (this.#npc_1_show_first_message) {
          this._dialog?.show(npc.name);
          this._showElements(orangeGroup!);
          this.physics.add.collider(
            this._player,
            orangeGroup,
            (_player, item) => {
              const itemObject = item as Phaser.GameObjects.Sprite;
              this.#defineBehaviorForItems(itemObject);
            },
          );
          this._dialog?.setMessageComplete(npc.name);
          this.#npc_1_show_first_message = false;
        } else if (this.#total_oranges > 0) {
          this._dialog?.show("npc-1");
          this.#npc_1_show_intermediate_message = true;
        } else {
          if (this.#npc_1_show_first_complete_collect_objects) {
            if (!this.#npc_1_show_intermediate_message) {
              this._dialog?.setMessageComplete(npc.name);
            }
            this.#npc_1_show_first_complete_collect_objects = false;
          }
          this._dialog?.show(npc.name);
        }
      }

      if (npc.name === "npc-2") {
        if (this.#total_oranges === 0) {
          this._dialog?.setMessageComplete(npc.name);
        }
        this._dialog?.show(npc.name);
      }
    }
  }

  #defineBehaviorForItems(item: Phaser.GameObjects.Sprite) {
    if (item.visible && !this.#has_object_in_the_bag) {
      this.#has_object_in_the_bag = true;
      this.#bag_objects = item;
      this.children.bringToTop(this.#bag_objects); // Este método mueve "top" al frente de la pila de renderizado
      if (item.body) {
        const body = item.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = true; // Deshabilitar las colisiones del objeto
      }
    }
  }

  update(): void {
    super.update();
    if (this.#has_object_in_the_bag) {
      if (this._controls.wasShiftPressed()) {
        const dropX = this._player.x + TILE_SIZE;
        const dropY = this._player.y;
        const cantDrop =
          this.physics
            .overlapRect(dropX, dropY, TILE_SIZE, TILE_SIZE, true, true)
            .filter(
              (ol) =>
                ol.gameObject instanceof GameObjects.Image &&
                (ol.gameObject.texture.key !== AssetKeys.TILES.TREE ||
                  ol.gameObject.texture.key !== AssetKeys.CHARACTERS.NPC),
            ).length > 0;
        if (cantDrop) {
          this.#bag_objects.setPosition(
            this._player.x + TILE_SIZE,
            this._player.y,
          );
          this.#has_object_in_the_bag = false;
          if (this.#bag_objects.body) {
            const body = this.#bag_objects.body as Phaser.Physics.Arcade.Body;
            body.checkCollision.none = false;
            body.updateFromGameObject();
          }
        }
      } else {
        this.#bag_objects.setPosition(this._player.x, this._player.y);
      }
    }
  }
}
