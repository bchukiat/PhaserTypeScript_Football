module GameModule.Sprite{
  export class Player extends Phaser.Sprite{
    game:Phaser.Game;
    state:Phaser.State;
    startx:number;
    starty:number;

    constructor(state:any, start_x:number, start_y:number, player_sprite:string){

      this.game = state.game;
      this.state = state;
      this.startx = start_x;
      this.starty = start_y;

      super(this.game,this.startx,this.starty,player_sprite);

      this.anchor.setTo(0.5, 0.5);
      this.animations.add('move', [0,1,2,3,4,5,6,7], 20, true);
      this.animations.add('stop', [3], 20, true);
      this.angle = this.game.rnd.angle();
      this.bringToTop();

      this.game.physics.enable(this,Phaser.Physics.ARCADE);

      return this;
    }

  }
}
