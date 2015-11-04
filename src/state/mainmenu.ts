module GameModule.State{
  export class MainMenu extends Phaser.State{
    game: Phaser.Game;
    music:Phaser.Sound = null;
  	playButton = null;

    constructor(game:Phaser.Game) {
      super();
      this.game = game;
    }

    create(){
      var titleimage:Phaser.Image = this.game.cache.getImage('titlepage');
      var xpos=this.game.width/2- (titleimage ? titleimage.width/2 : 200);
      var ypos=this.game.height/2- (titleimage ? titleimage.height/2 : 25);
      this.add.sprite(xpos>0?xpos:0, ypos>0?ypos:0, 'titlepage');
      this.game.input.onDown.addOnce(this.startGame, this);
    }

    startGame(){
      this.game.state.start('Game');
    }
  }
}
