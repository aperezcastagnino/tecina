import { FontSize, PRIMARY_FONT_FAMILY } from "./../assets/fonts";
import { AssetKeys } from "./../assets/asset-keys";
import { Colors } from "./../assets/colors";

export class HealthBar {


    _scene: Phaser.Scene;

    _leftCap!: Phaser.GameObjects.Image;
    _middle_green!: Phaser.GameObjects.Image;
    _middle_yellow!: Phaser.GameObjects.Image;
    _middle_red!: Phaser.GameObjects.Image;

    _middleShadow!: Phaser.GameObjects.Image;

    _scaleY!:number;
    _containerShadows!: Phaser.GameObjects.Container;
    _container!: Phaser.GameObjects.Container;

    _fullWidth!: number;
    _fullHeight!: number;

    constructor(scene: Phaser.Scene) {
        this._scene = scene;
        this._scaleY = 0.7;

        this._fullWidth = 300;
        this._fullHeight = 300; //si la imagen es de un tamaño adecuado, no esta bien poner esto, capaz se puede renderizar la imagen correctamente

        const x = 100;
        const y = 40;
        const text = "HEALTH"
        const textLength = 5 * text.length;

        this._containerShadows = this._scene.add.container(x, y, []);
        this._container = this._scene.add.container(x, y, []);

        this._scene.add.text(x - textLength, y, text, {
            ...{
              fontFamily: PRIMARY_FONT_FAMILY,
              color: Colors.White,
              fontSize: FontSize.EXTRA_LARGE,
              wordWrap: { width: 0 },
            },
            ...{ wordWrap: { width: this._fullHeight } },
          });
        this._createBarShadowImages(x,y);
        this._createBarImages(x, y);

    }
    _createBarShadowImages(x: number, y: number) {
         this._middleShadow = this._scene.add
          .image(x, y, AssetKeys.HEALTH_BAR.MIDDLE_SHADOW)
          .setOrigin(0, 0.5)
          .setScale(1, this._scaleY);
        this._middleShadow.displayWidth = this._fullWidth;
        this._middleShadow.displayHeight = this._fullHeight;
        this._containerShadows.add([this._middleShadow]);

      }


    _createBarImages(x: number, y: number) {
      // La idea es despues manejar 3 barras, la izquierda que siempre esta visible, 
      // la del medio que es la que se contrae y estira dependiendo de lo que pase y la derecha que se hace visible cuando esta completa
        this._middle_green = this._scene.add
        .image(x, y, AssetKeys.HEALTH_BAR.MIDDLE_GREEN)
        .setOrigin(0, 0.5)
        .setScale(1, 0);
        this._middle_green.displayHeight = this._fullHeight;
        this._middle_green.displayWidth = this._fullWidth;

        this._middle_yellow = this._scene.add
        .image(x, y, AssetKeys.HEALTH_BAR.MIDDLE_YELLOW)
        .setOrigin(0, 0.5)
        .setScale(1, 0);
        this._middle_yellow.displayHeight = this._fullHeight;
        this._middle_yellow.displayWidth = this._fullWidth;

        this._middle_red = this._scene.add
        .image(x, y, AssetKeys.HEALTH_BAR.MIDDLE_RED)
        .setOrigin(0, 0.5)
        .setScale(1, 0);
        this._middle_red.displayHeight = this._fullHeight;
        this._middle_red.displayWidth = this._fullWidth;

        this._updateBarGameObjects(1)
        this._container.add([this._middle_yellow, this._middle_green, this._middle_red]);

    }

    _setMeterPercentage(percent = 1) {
        const width = this._fullWidth * percent;
        // Animacion
        this._scene.tweens.add({
            targets: this._middle_green,
            displayWidth: width,
            duration: 1000,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: () => {
              this._updateBarGameObjects(percent);
            },
            // onComplete: callback, //Se puede pasar un callback y llamar cuando termena la animacion
          });
        }


      _updateBarGameObjects(percent : number) {
        const isVisible = this._middle_green.displayWidth > 0;
        this._middle_green.visible = isVisible;
        const constrainedWidth = Math.min(this._middle_green.displayWidth, this._fullWidth);

        if(percent > 0.2 && percent<0.5){
          this._middle_yellow.displayWidth = constrainedWidth;
          this._middle_yellow.visible = true;
          this._middle_green.visible = false;
          this._middle_red.visible = false;
          this._middle_green.setOrigin(0,0.5)
        }
        if(percent<0.2){
          this._middle_red.displayWidth = constrainedWidth;
          this._middle_yellow.visible = false;
          this._middle_green.visible = false;
          this._middle_red.visible = true;
        }
        if(percent>=0.5){
          this._middle_green.displayWidth = constrainedWidth;
          this._middle_yellow.visible = false;
          this._middle_green.visible = true;
          this._middle_red.visible = false;
        }
      }


}