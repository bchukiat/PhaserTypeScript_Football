module GameModule{
  export class Main extends Phaser.Game{
    game: Phaser.Game;

    static score: number = 0;
    static music: Phaser.Sound = null;
    static orientated: boolean = false;

    constructor() {
        super(800, 600, Phaser.CANVAS, 'game');
        this.state.add('Boot', State.Boot, false);
        this.state.add('Preloader', State.Preloader, false);
        this.state.add('MainMenu', State.MainMenu, false);
        this.state.add('Game', State.Game, false);

        this.state.start('Boot');
    }
  }
}

window.onload = () => {
  var game = new GameModule.Main();
}
