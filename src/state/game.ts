module GameModule.State{
  export class Game extends Phaser.State{
    game: Phaser.Game;
    socket:SocketIOClient.Socket;
    opt:any;
    land:Phaser.TileSprite;
    //player:GameModule.Sprite.Player;
    player:Phaser.Sprite;
    players:Phaser.Group;
    enemies:GameModule.RemotePlayer[];
    cursors:Phaser.CursorKeys;
    currentSpeed:number = 0;

    constructor(game:Phaser.Game) {
      super();
      this.game = game;
    }

    create(){
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.opt = {port: 8120, transports: ["websocket"]};
      this.socket = io.connect("http://localhost", this.opt);

      //  Resize our game world to be a 2000 x 2000 square
      this.game.world.setBounds(-500, -500, 1000, 1000);

      //  Our tiled scrolling background
      this.land = this.game.add.tileSprite(0, 0, 800, 600, 'earth');
      this.land.fixedToCamera = true;

      //  The base of our player
      var startx = Math.abs(Math.round(Math.random()*(1000)-500));
      var starty = Math.abs(Math.round(Math.random()*(1000)-500));

      // Using group to add created player sprite to state
      this.players = this.add.group();
      this.player = new GameModule.Sprite.Player(this, startx, starty, 'dude');
      this.players.add(this.player);

      this.player.body.maxVelocity.setTo(400, 400);
      this.player.body.collideWorldBounds = true;

      this.enemies = [];
      this.game.camera.follow(this.player);
      this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
      this.game.camera.focusOnXY(0, 0);
      this.cursors = this.game.input.keyboard.createCursorKeys();

      // Socket connection successful
      this.socket.on("connect",()=>{
        console.log("Connected to socket server");

        // Send local player data to the game server
        this.socket.emit("new player", {x: this.player.x, y:this.player.y});
      });

      // Socket disconnection
      this.socket.on("disconnect",()=>{
        console.log("Disconnected from socket server");
      });

      // New player message received
      this.socket.on("new player",(data:socket_data)=>{
        console.log("New player connected: " + data.id);
        console.log(data);
        // Add new player to the remote players array
        var remoteplayer = new GameModule.RemotePlayer(data.id, this.game, this.player, data.x, data.y);
        this.players.add(remoteplayer.player);
        this.enemies.push(remoteplayer);
      });

      // Player move message received
      this.socket.on("move player",(data:socket_data)=>{
        var movePlayer = this.playerById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log("Player not found: "+data.id);
            return;
        };

        // Update player position
        movePlayer.player.x = data.x;
        movePlayer.player.y = data.y;
      });

      // Player removed message received
      this.socket.on("remove player",(data:socket_data)=>{
        var removePlayer = this.playerById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log("Player not found: "+data.id);
            return;
        };

        removePlayer.player.kill();

        // Remove player from array
        this.enemies.splice(this.enemies.indexOf(removePlayer), 1);
      });

    }

    playerById(id:string):GameModule.RemotePlayer{
      for (var i = 0; i < this.enemies.length; i++) {
          if (this.enemies[i].player.name == id){
              return this.enemies[i];
          }
      };

      return null;
    }

    update(){
      for (var i = 0; i < this.enemies.length; i++)
      {
          if (this.enemies[i].alive)
          {
              this.enemies[i].update();
              this.game.physics.arcade.collide(this.player, this.enemies[i].player);
          }
      }

      if (this.cursors.left.isDown)
      {
          this.player.angle -= 4;
      }
      else if (this.cursors.right.isDown)
      {
          this.player.angle += 4;
      }

      if (this.cursors.up.isDown)
      {
          //  The speed we'll travel at
          this.currentSpeed = 300;
      }
      else
      {
          if (this.currentSpeed > 0)
          {
              this.currentSpeed -= 4;
          }
      }

      if (this.currentSpeed > 0)
      {
          this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity);
          this.player.animations.play('move');
      }
      else
      {
          this.player.animations.play('stop');
      }

      this.land.tilePosition.x = -this.game.camera.x;
      this.land.tilePosition.y = -this.game.camera.y;

      if (this.game.input.activePointer.isDown)
      {
          if (this.game.physics.arcade.distanceToPointer(this.player) >= 10) {
              this.currentSpeed = 300;
              this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
          }
      }

      this.socket.emit("move player", {x: this.player.x, y:this.player.y});

    }

    render(){

    }

  }

  interface socket_data {
      id:string;
      x:number;
      y:number;
  }

}
