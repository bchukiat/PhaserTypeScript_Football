module GameModule{
  export class RemotePlayer {
    game:Phaser.Game;
    x:number;
    y:number;
    index:string;
    health:number;
    alive:boolean;
    player:Phaser.Sprite;
    lastPosition:position2d;

    constructor(index:string, game:Phaser.Game, player:Phaser.Sprite, startX:number, startY:number){
      this.game = game;
      this.index = index;
      this.x = startX;
      this.y = startY;
      this.health = 3;
      this.alive = true;
      this.player = player;

      this.player = new GameModule.Sprite.Player(this, this.x, this.y, 'enemy');
      this.player.name = index.toString();
      this.player.body.immovable = true;
      this.lastPosition = { x: this.x, y: this.y };

      return this;
    }

    update(){
      if(this.player.x != this.lastPosition.x || this.player.y != this.lastPosition.y) {
        this.player.play('move');
        this.player.rotation = Math.PI + this.game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y);
      }
      else {
        this.player.play('stop');
      }

      this.lastPosition.x = this.player.x;
      this.lastPosition.y = this.player.y;
    }



  }

  interface position2d {
      x:number;
      y:number;
  }
}
