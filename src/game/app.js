var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameModule;
(function (GameModule) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            _super.call(this, 800, 600, Phaser.CANVAS, 'game');
            this.state.add('Boot', GameModule.State.Boot, false);
            this.state.add('Preloader', GameModule.State.Preloader, false);
            this.state.add('MainMenu', GameModule.State.MainMenu, false);
            this.state.add('Game', GameModule.State.Game, false);
            this.state.start('Boot');
        }
        Main.score = 0;
        Main.music = null;
        Main.orientated = false;
        return Main;
    })(Phaser.Game);
    GameModule.Main = Main;
})(GameModule || (GameModule = {}));
window.onload = function () {
    var game = new GameModule.Main();
};
var GameModule;
(function (GameModule) {
    var RemotePlayer = (function () {
        function RemotePlayer(index, game, player, startX, startY) {
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
        RemotePlayer.prototype.update = function () {
            if (this.player.x != this.lastPosition.x || this.player.y != this.lastPosition.y) {
                this.player.play('move');
                this.player.rotation = Math.PI + this.game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y);
            }
            else {
                this.player.play('stop');
            }
            this.lastPosition.x = this.player.x;
            this.lastPosition.y = this.player.y;
        };
        return RemotePlayer;
    })();
    GameModule.RemotePlayer = RemotePlayer;
})(GameModule || (GameModule = {}));
var GameModule;
(function (GameModule) {
    var Sprite;
    (function (Sprite) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(state, start_x, start_y, player_sprite) {
                this.game = state.game;
                this.state = state;
                this.startx = start_x;
                this.starty = start_y;
                _super.call(this, this.game, this.startx, this.starty, player_sprite);
                this.anchor.setTo(0.5, 0.5);
                this.animations.add('move', [0, 1, 2, 3, 4, 5, 6, 7], 20, true);
                this.animations.add('stop', [3], 20, true);
                this.angle = this.game.rnd.angle();
                this.bringToTop();
                this.game.physics.enable(this, Phaser.Physics.ARCADE);
                return this;
            }
            return Player;
        })(Phaser.Sprite);
        Sprite.Player = Player;
    })(Sprite = GameModule.Sprite || (GameModule.Sprite = {}));
})(GameModule || (GameModule = {}));
var GameModule;
(function (GameModule) {
    var State;
    (function (State) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot(game) {
                _super.call(this);
                this.game = game;
                GameModule.Main.score = 0;
                GameModule.Main.music = null;
                GameModule.Main.orientated = false;
            }
            Boot.prototype.preload = function () {
                this.game.load.image('preloaderBar', 'asset/image/loader.png');
                var titleimg = this.game.load.image('phaser', 'asset/image/phaser.png');
            };
            Boot.prototype.create = function () {
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                this.game.input.maxPointers = 1;
                if (this.game.device.desktop) {
                    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    this.scale.minWidth = 320;
                    this.scale.minHeight = 240;
                    this.scale.maxWidth = 640;
                    this.scale.maxHeight = 480;
                    this.scale.pageAlignHorizontally = true;
                    this.scale.pageAlignVertically = true;
                    this.scale.refresh();
                }
                else {
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
            };
            Boot.prototype.gameResized = function (width, height) {
            };
            Boot.prototype.enterIncorrectOrientation = function () {
                GameModule.Main.orientated = false;
                document.getElementById('orientation').style.display = 'block';
            };
            Boot.prototype.leaveIncorrectOrientation = function () {
                GameModule.Main.orientated = true;
                document.getElementById('orientation').style.display = 'none';
            };
            return Boot;
        })(Phaser.State);
        State.Boot = Boot;
    })(State = GameModule.State || (GameModule.State = {}));
})(GameModule || (GameModule = {}));
var GameModule;
(function (GameModule) {
    var State;
    (function (State) {
        var Game = (function (_super) {
            __extends(Game, _super);
            function Game(game) {
                _super.call(this);
                this.currentSpeed = 0;
                this.game = game;
            }
            Game.prototype.create = function () {
                var _this = this;
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                this.opt = { port: 8120, transports: ["websocket"] };
                this.socket = io.connect("http://localhost", this.opt);
                this.game.world.setBounds(-500, -500, 1000, 1000);
                this.land = this.game.add.tileSprite(0, 0, 800, 600, 'earth');
                this.land.fixedToCamera = true;
                var startx = Math.abs(Math.round(Math.random() * (1000) - 500));
                var starty = Math.abs(Math.round(Math.random() * (1000) - 500));
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
                this.socket.on("connect", function () {
                    console.log("Connected to socket server");
                    _this.socket.emit("new player", { x: _this.player.x, y: _this.player.y });
                });
                this.socket.on("disconnect", function () {
                    console.log("Disconnected from socket server");
                });
                this.socket.on("new player", function (data) {
                    console.log("New player connected: " + data.id);
                    console.log(data);
                    var remoteplayer = new GameModule.RemotePlayer(data.id, _this.game, _this.player, data.x, data.y);
                    _this.players.add(remoteplayer.player);
                    _this.enemies.push(remoteplayer);
                });
                this.socket.on("move player", function (data) {
                    var movePlayer = _this.playerById(data.id);
                    if (!movePlayer) {
                        console.log("Player not found: " + data.id);
                        return;
                    }
                    ;
                    movePlayer.player.x = data.x;
                    movePlayer.player.y = data.y;
                });
                this.socket.on("remove player", function (data) {
                    var removePlayer = _this.playerById(data.id);
                    if (!removePlayer) {
                        console.log("Player not found: " + data.id);
                        return;
                    }
                    ;
                    removePlayer.player.kill();
                    _this.enemies.splice(_this.enemies.indexOf(removePlayer), 1);
                });
            };
            Game.prototype.playerById = function (id) {
                for (var i = 0; i < this.enemies.length; i++) {
                    if (this.enemies[i].player.name == id) {
                        return this.enemies[i];
                    }
                }
                ;
                return null;
            };
            Game.prototype.update = function () {
                for (var i = 0; i < this.enemies.length; i++) {
                    if (this.enemies[i].alive) {
                        this.enemies[i].update();
                        this.game.physics.arcade.collide(this.player, this.enemies[i].player);
                    }
                }
                if (this.cursors.left.isDown) {
                    this.player.angle -= 4;
                }
                else if (this.cursors.right.isDown) {
                    this.player.angle += 4;
                }
                if (this.cursors.up.isDown) {
                    this.currentSpeed = 300;
                }
                else {
                    if (this.currentSpeed > 0) {
                        this.currentSpeed -= 4;
                    }
                }
                if (this.currentSpeed > 0) {
                    this.game.physics.arcade.velocityFromRotation(this.player.rotation, this.currentSpeed, this.player.body.velocity);
                    this.player.animations.play('move');
                }
                else {
                    this.player.animations.play('stop');
                }
                this.land.tilePosition.x = -this.game.camera.x;
                this.land.tilePosition.y = -this.game.camera.y;
                if (this.game.input.activePointer.isDown) {
                    if (this.game.physics.arcade.distanceToPointer(this.player) >= 10) {
                        this.currentSpeed = 300;
                        this.player.rotation = this.game.physics.arcade.angleToPointer(this.player);
                    }
                }
                this.socket.emit("move player", { x: this.player.x, y: this.player.y });
            };
            Game.prototype.render = function () {
            };
            return Game;
        })(Phaser.State);
        State.Game = Game;
    })(State = GameModule.State || (GameModule.State = {}));
})(GameModule || (GameModule = {}));
var GameModule;
(function (GameModule) {
    var State;
    (function (State) {
        var MainMenu = (function (_super) {
            __extends(MainMenu, _super);
            function MainMenu(game) {
                _super.call(this);
                this.music = null;
                this.playButton = null;
                this.game = game;
            }
            MainMenu.prototype.create = function () {
                var titleimage = this.game.cache.getImage('titlepage');
                var xpos = this.game.width / 2 - (titleimage ? titleimage.width / 2 : 200);
                var ypos = this.game.height / 2 - (titleimage ? titleimage.height / 2 : 25);
                this.add.sprite(xpos > 0 ? xpos : 0, ypos > 0 ? ypos : 0, 'titlepage');
                this.game.input.onDown.addOnce(this.startGame, this);
            };
            MainMenu.prototype.startGame = function () {
                this.game.state.start('Game');
            };
            return MainMenu;
        })(Phaser.State);
        State.MainMenu = MainMenu;
    })(State = GameModule.State || (GameModule.State = {}));
})(GameModule || (GameModule = {}));
var GameModule;
(function (GameModule) {
    var State;
    (function (State) {
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader(game) {
                _super.call(this);
                this.background = null;
                this.preloadBar = null;
                this.ready = false;
                this.game = game;
            }
            Preloader.prototype.preload = function () {
                var bg = this.game.add.image(0, 0, 'phaser');
                bg.height = this.game.height;
                bg.width = this.game.width;
                var preloadbar = this.game.cache.getImage('preloaderBar');
                var xpos = 0;
                var ypos = 0;
                xpos = this.game.width / 2 - (preloadbar ? preloadbar.width / 2 : 200);
                ypos = this.game.height / 2 - (preloadbar ? preloadbar.height / 2 : 25);
                this.preloadBar = this.game.add.sprite(xpos > 0 ? xpos : 0, ypos > 0 ? ypos : 0, 'preloaderBar');
                this.game.load.setPreloadSprite(this.preloadBar);
                this.game.load.image('earth', 'asset/image/light_sand.png');
                this.game.load.spritesheet('dude', 'asset/image/dude.png', 64, 64);
                this.game.load.spritesheet('enemy', 'asset/image/dude.png', 64, 64);
            };
            Preloader.prototype.create = function () {
                this.game.state.start('Game');
            };
            return Preloader;
        })(Phaser.State);
        State.Preloader = Preloader;
    })(State = GameModule.State || (GameModule.State = {}));
})(GameModule || (GameModule = {}));
