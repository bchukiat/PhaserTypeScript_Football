module GameModule.State{
  export class Preloader extends Phaser.State{
    game: Phaser.Game;

    background: Phaser.Sprite = null;
    preloadBar: Phaser.Sprite = null;
    ready:boolean = false;

    constructor(game:Phaser.Game) {
      super();
      this.game = game;
    }

    preload(){
      var bg = this.game.add.image(0, 0, 'phaser');
      bg.height = this.game.height;
      bg.width=this.game.width;

      var preloadbar:Phaser.Image = this.game.cache.getImage('preloaderBar');
      var xpos:number=0;
      var ypos:number=0;
      xpos=this.game.width/2- (preloadbar ? preloadbar.width/2 : 200);
      ypos=this.game.height/2- (preloadbar ? preloadbar.height/2 : 25);
      this.preloadBar = this.game.add.sprite(xpos>0?xpos:0, ypos>0?ypos:0,  'preloaderBar');
      this.game.load.setPreloadSprite(this.preloadBar);

      this.game.load.image('earth', 'asset/image/light_sand.png');
      this.game.load.spritesheet('dude', 'asset/image/dude.png', 64, 64);
      this.game.load.spritesheet('enemy', 'asset/image/dude.png', 64, 64);
      //console.log("preload");
    }

    create(){
		    this.game.state.start('Game');
    }

  }
}
