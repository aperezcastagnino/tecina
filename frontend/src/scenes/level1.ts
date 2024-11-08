import { Scene } from "phaser";
import { SceneKeys } from "./scene-keys";
import { AssetKeys } from "../assets/asset-keys";
import { Dialog } from "../common-ui/dialog";
// import { Awards } from "../utils/awards.js";

export class Level1 extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  
  private tilemap!: Phaser.Tilemaps.Tilemap;
  
  private tileset!: Phaser.Tilemaps.Tileset | null;
  
  private collisionLayer!: Phaser.Tilemaps.TilemapLayer | null;
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Variable para almacenar las teclas
  
  private waitingSpaceKeyboard!: boolean;
  
  private objectsToDispose!: Phaser.GameObjects.Sprite[]; // Cambiamos a un array
  
  private spriteName!: string; // Cambiamos a un array
  
  private startDialog!: Dialog;
  
  private endDialog!: Dialog;
  
  private timeOutStartDialogCompleted: boolean;
  
  private timeOutEndDialogCompleted: boolean;
  
  private award: Awards;
  
  private awardCount: number;

  private npcsColide: { Id: number; enable: boolean }[];
  private npcCounts: number;
  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  preload() {
    this.awardCount = 0;
    this.award = new Awards({
      assetKey: AssetKeys.UI.AWARD.EYE.NAME,
      frameRate: 10,
      padding: AssetKeys.UI.AWARD.EYE.frameWidth,
      scene: this,
      spriteConfig: {
        frameWidth: AssetKeys.UI.AWARD.EYE.frameWidth,
        frameHeight: AssetKeys.UI.AWARD.EYE.frameHeight,
        startFrame: AssetKeys.UI.AWARD.EYE.startFrame,
        endFrame: AssetKeys.UI.AWARD.EYE.endFrame,
      },
      width: this.cameras.main.width,
      scale: 0.5,
    });
    this.anims.create({
      key: "KeyAnim",
      frames: this.anims.generateFrameNumbers(AssetKeys.UI.NPCS.BASKETMAN.NAME),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "KeyAnim-Award",
      frames: this.anims.generateFrameNumbers(AssetKeys.UI.AWARD.EYE.NAME),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 3,
        end: 5,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 9,
        end: 11,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 0,
        end: 2,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers(AssetKeys.CHARACTERS.PLAYER, {
        start: 6,
        end: 8,
      }), // Asume que los frames 0 a 3 son la animación
      frameRate: 10, // Velocidad de la animación (fotogramas por segundo)
      repeat: -1, // Repetir indefinidamente
    });
  }

  create() {
    this.timeOutStartDialogCompleted = this.timeOutEndDialogCompleted = false;
    this.npcsColide = [];

    this.waitingSpaceKeyboard = false;
    this.tilemap = this.make.tilemap({ key: AssetKeys.MAPS.LEVEL_1 });

    // Vincular el tileset con el nombre que se usó en Tiled
    this.tileset = this.tilemap.addTilesetImage(
      AssetKeys.LEVELS.TILESET.TILESETIMAGE,
      AssetKeys.LEVELS.TILESET.KEY,
    );

    // Crear las capas del mapa
    const fondoLayer = this.tilemap.createLayer("ground", this.tileset!, 0, 0);
    this.collisionLayer = this.tilemap.createLayer(
      "elements",
      this.tileset!,
      0,
      0,
    );

    // Habilitar la colisión en la capa 'Colision'
    this.collisionLayer!.setCollisionByProperty({ colisionable: true });
    this.createPlayer();
    this.physics.add.collider(this.player, this.collisionLayer!);
    this.collisionLayer!.setCollisionByExclusion([-1]);
    this.cursors = this.input.keyboard!.createCursorKeys(); // Carga las teclas del cursor (flechas)
    var npcLayer = this.tilemap.objects.find((f) => f.name == "objs_npcs"); // Accede a la capa de objetos
    var awardsLayer = this.tilemap.objects.find((f) => f.name == "objs_awards");
    this.objectsToDispose = [];
    this.startDialog = new Dialog({
      scene: this,
    });
    this.startDialog.setMessages([
      "Wachin me vas a buscar las estrellas porfa?, bien de vago el pibe",
    ]);
    this.endDialog = new Dialog({
      scene: this,
    });
    this.endDialog.setMessages([
      "Claro mi rey, te quiero mucho, Me voy pa mi casa, portate bien hace todos los deberes",
    ]);
    this.startDialog.show();
    this.endDialog.show();
    this.startDialog.getContainer().setVisible(false);
    this.endDialog.getContainer().setVisible(false);
    var sprite = null;
    this.npcCounts = npcLayer?.objects.length!;
    npcLayer!.objects.forEach((objeto, index) => {
      sprite = this.physics.add.sprite(
        objeto.x!,
        objeto.y!,
        AssetKeys.UI.NPCS.BASKETMAN.NAME,
      );

      sprite.setOrigin(0.5, 0.5);

      sprite.name = objeto.properties
        .find((f) => f.name == "Id")
        .value.toString();
      this.npcsColide.push({
        Id: objeto.properties.find((f) => f.name == "Id").value,
        enable: false,
      });
      sprite.setImmovable(true);
      sprite.anims.play("KeyAnim", true);
      sprite.body.setSize(
        AssetKeys.UI.NPCS.BASKETMAN.frameWidth,
        AssetKeys.UI.NPCS.BASKETMAN.frameHeight,
      );
      this.children.moveBelow(this.startDialog.getContainer(), sprite);

      this.physics.add.collider(this.player, sprite, (a, b) => {
        //Colision entre player y npc
        const spriteB = b as Phaser.GameObjects.Sprite;
        var npcColide = this.npcsColide.find(
          (f) => f.Id.toString() == spriteB.name.toString(),
        );
        if (this.cursors.space.isDown && !npcColide?.enable) {
          this.npcsColide.find(
            (f) => f.Id.toString() == spriteB.name.toString(),
          )!.enable = true;
          var objectsFromNPC = awardsLayer?.objects.filter(
            (element) =>
              element.properties
                ?.find((prop) => prop.name == "IdNPC")
                ?.value.toString() == spriteB.name.toString(),
          );
          var objectsCount = objectsFromNPC!.length;
          this.timeOutStartDialogCompleted = false;
          this.startDialog.getContainer().setVisible(true);
          setTimeout(() => {
            this.timeOutStartDialogCompleted = true;
            // this.startDialog.hide()
          }, 2000);

          objectsFromNPC!.forEach((element) => {
            const id = element.id.toString();
            var spriteAward = this.physics.add.sprite(
              element.x!,
              element.y!,
              AssetKeys.UI.AWARD.EYE.NAME,
            );
            spriteAward.setOrigin(0.5, 0.5);
            spriteAward.setImmovable(true);
            spriteAward.anims.play("KeyAnim-Award", true);
            spriteAward.body.setSize(
              AssetKeys.UI.AWARD.EYE.frameWidth,
              AssetKeys.UI.AWARD.EYE.frameHeight,
            );
            this.children.moveBelow(
              this.startDialog.getContainer(),
              spriteAward,
            );
            this.physics.add.collider(
              this.player,
              spriteAward,
              (player, sprite) => {
                //Colision entre player y el award
                objectsCount!--;
                sprite.destroy();
                this.awardCount++;
                this.award.setAwardsCount(this.awardCount);
                if (objectsCount == 0) {
                  this.timeOutEndDialogCompleted = false;
                  this.endDialog.getContainer().setVisible(true);
                  setTimeout(() => {
                    this.timeOutEndDialogCompleted = true;
                    spriteB.destroy();
                    this.npcCounts--;
                    if (this.npcCounts == 0) {
                      this.scene.start(SceneKeys.GAME_OVER);
                    }
                  }, 2000);

                  console.log(
                    "Ya encontraste todos bien wachin, sos un kapo papu, tkm",
                  );
                }
              },
            );
          });
        }
      });
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(
      100,
      100,
      AssetKeys.CHARACTERS.PLAYER,
    );
    // this.cameras.main.startFollow(this.player);
  }

  update() {
    // Verificamos si el jugador está tocando algún objeto a ocultar
    var velocity = 200;
    if (this.cursors.shift.isDown) {
      velocity = velocity * 2;
    }
    if (this.cursors.left.isDown) {
      this.player.setVelocity(-velocity, 0);
      this.player.anims.play("walk-left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocity(velocity, 0);
      this.player.anims.play("walk-right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocity(0, -velocity);
      this.player.anims.play("walk-up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocity(0, velocity);
      this.player.anims.play("walk-down", true);
    } else if (this.cursors.space.isDown) {
      if (this.timeOutStartDialogCompleted) {
        this.startDialog.getContainer().setVisible(false);
      }
      if (this.timeOutEndDialogCompleted) {
        this.endDialog.getContainer().setVisible(false);
      }
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.stop();
    }
  }
}
