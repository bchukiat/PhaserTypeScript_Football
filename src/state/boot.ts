module GameModule.State{
  export class Boot extends Phaser.State{
    game: Phaser.Game;

    constructor(game:Phaser.Game) {
      super();
      this.game = game;
      Main.score=0;
      Main.music=null;
      Main.orientated=false;
    }

    preload(){
      this.game.load.image('preloaderBar', 'asset/image/loader.png');
      var titleimg  = this.game.load.image('phaser', 'asset/image/phaser.png');
    }

    create(){
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.input.maxPointers = 1;

      if (this.game.device.desktop){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 320;
        this.scale.minHeight = 240;
        this.scale.maxWidth = 640;
        this.scale.maxHeight = 480;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.refresh();
      }
      else{
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = 480;
        this.scale.minHeight = 260;
        this.scale.maxWidth = 1024;
        this.scale.maxHeight = 768;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(true, false);
        this.scale.setResizeCallback(this.gameResized, this);
        this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        this.game.scale.refresh();
      }
      this.game.state.start('Preloader');
    }

    gameResized(width, height){

    }
    enterIncorrectOrientation(){
        Main.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    }
    leaveIncorrectOrientation(){
        Main.orientated = true;
        document.getElementById('orientation').style.display = 'none';
    }
  }
}
