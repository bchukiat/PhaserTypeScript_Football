/**************************************************
 ** NODE.JS REQUIREMENTS
 **************************************************/
var util = require("util"), // Utility resources (logging, object inspection, etc)
  io = require("socket.io"), // Socket.IO
  Ball = require("./Ball").Ball
  Player = require("./Player").Player; // Player class


/**************************************************
 ** GAME VARIABLES
 **************************************************/
var socket, // Socket controller
  players, // Array of connected players
  ball;

/**************************************************
 ** GAME INITIALISATION
 **************************************************/
function init() {
  // Create an empty array to store players
  players = [];

  // Set up Socket.IO to listen on port 8000
  socket = io.listen(8120);

  // Configure Socket.IO
  socket.configure(function() {
    // Only use WebSockets
    socket.set("transports", ["websocket"]);

    // Restrict log output
    socket.set("log level", 2);
  });

  // Start listening for events
  setEventHandlers();
};


/**************************************************
 ** GAME EVENT HANDLERS
 **************************************************/
var setEventHandlers = function() {
  // Socket.IO
  socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
  util.log("New player has connected: " + client.id);

  // Listen for client disconnected
  client.on("disconnect", onClientDisconnect);

  // Listen for new player message
  client.on("new player", onNewPlayer);

  // Listen for move player message
  client.on("move player", onMovePlayer);

  client.on("move ball", onMoveBall);
};

// Socket client has disconnected
function onClientDisconnect() {
  util.log("Player has disconnected: " + this.id);

  var removePlayer = playerById(this.id);

  // Player not found
  if (!removePlayer) {
    util.log("Player not found: " + this.id);
    return;
  };

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  this.broadcast.emit("remove player", {
    id: this.id
  });
};

// New player has joined
function onNewPlayer(data) {
  // Create a new player
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;

  // Broadcast new player to connected socket clients
  this.broadcast.emit("new player", {
    id: newPlayer.id,
    x: newPlayer.getX(),
    y: newPlayer.getY()
  });

  // Send existing players to the new player
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    util.log(players[i]);
    this.emit("new player", {
      id: existingPlayer.id,
      x: existingPlayer.getX(),
      y: existingPlayer.getY()
    });
  };

  // Add new player to the players array
  players.push(newPlayer);

  var ballx = 0, bally = 0;
  if(ball){
    ballx = ball.getX();
    bally = ball.getY();
  }
  else {
    ballx = data.x;
    bally = data.y;
    ball = new Ball(ballx,bally);
  }
  // Emit to everyone include sender
  socket.sockets.emit("start ball", {
    x: ballx,
    y: bally
  });


  /*
  util.log(players.length);
  if(players.length == 1){
    util.log("create ball " + data.x + ":" + data.y);
    ball = new Ball(data.x, data.y);
  }
  else {
    util.log("ball has been already " + ball.getX() + ":" + ball.getY());
    this.broadcast.emit("move ball", {
      x: ball.getX(),
      y: ball.getY()
    });
  }*/

};

// Player has moved
function onMovePlayer(data) {
  // Find player in array
  var movePlayer = playerById(this.id);

  // Player not found
  if (!movePlayer) {
    util.log("Player not found: " + this.id);
    return;
  };

  // Update player position
  movePlayer.setX(data.x);
  movePlayer.setY(data.y);

  // Broadcast updated position to connected socket clients
  this.broadcast.emit("move player", {
    id: movePlayer.id,
    x: movePlayer.getX(),
    y: movePlayer.getY()
  });
};

function onMoveBall(data) {
  this.broadcast.emit("move ball", {
    x:data.x, y:data.y
  });
}


/**************************************************
 ** GAME HELPER FUNCTIONS
 **************************************************/
// Find player by ID
function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id == id)
      return players[i];
  };

  return false;
};


/**************************************************
 ** RUN THE GAME
 **************************************************/
init();
