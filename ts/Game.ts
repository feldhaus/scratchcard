//https://medium.com/@davidguandev/build-a-flappy-bird-copy-with-typescript-pixi-js-890f5a07931e
//https://github.com/EcutDavid/flappy-bird-pixijs/blob/master/entry.ts
//https://pixijs.github.io/examples/#/demos/mask-render-texture.js
//https://github.com/pixijs/pixi-tilemap
//https://tutorialzine.com/2016/07/learn-typescript-in-30-minutes
//http://codetuto.com/2017/03/start-developing-html5-games-phaser-using-typescript/

const VALUES = [
    {value: 0,      img: 'images/tile_scratched_freeplay@2x.png'},
    {value: 2,      img: 'images/tile_scratched_prize_01@2x.png'},
    {value: 5,      img: 'images/tile_scratched_prize_02@2x.png'},
    {value: 10,     img: 'images/tile_scratched_prize_03@2x.png'},
    {value: 50,     img: 'images/tile_scratched_prize_04@2x.png'},
    {value: 100,    img: 'images/tile_scratched_prize_05@2x.png'},
    {value: 500,    img: 'images/tile_scratched_prize_06@2x.png'},
    {value: 1000,   img: 'images/tile_scratched_prize_07@2x.png'},
    {value: 10000,  img: 'images/tile_scratched_prize_08@2x.png'},
    {value: 100000, img: 'images/tile_scratched_prize_max@2x.png'}
];

class Game {
    private stage:PIXI.Container;
    private tiles:Tile[];
    private btnPlay:SimpleButton;
    private currentPrize:number;

    static app:PIXI.Application;

    constructor() {
        Game.app = new PIXI.Application(800, 600, {
            backgroundColor: 0x333333,
            legacy: true
        });
        document.body.appendChild(Game.app.view);

        // set style
        Game.app.renderer.view.style.position = 'absolute';
        Game.app.renderer.view.style.margin = 'auto';
        Game.app.renderer.view.style.display = 'block';
        Game.app.renderer.view.style.left = '0';
        Game.app.renderer.view.style.right = '0';
        Game.app.renderer.view.style.top = '0';
        Game.app.renderer.view.style.bottom = '0';

        // set stage
        this.stage = Game.app.stage;
    }

    preload(): void {
        PIXI.loader.add('images/bg.jpg');
        PIXI.loader.add('images/tile_underlay.png');
        PIXI.loader.add('images/tile_bg_scratched_default.png');
        PIXI.loader.add('images/tile_bg_unscratched.png');

        for (let i = 0; i < VALUES.length; i++) {
            PIXI.loader.add(VALUES[i].img);
        }

        PIXI.loader.load(this.setup.bind(this));
    }

    setup(loader:PIXI.loaders.Loader, resources:any): void {
        let bg:PIXI.Sprite = PIXI.Sprite.fromImage('images/bg.jpg');
        this.stage.addChild(bg);

        // add tiles
        this.tiles = [];
        for (let i = 0; i < 9; i++) {
            let col = i % 3;
            let row = Math.floor(i / 3);
            let tile = new Tile(100, 100);
            tile.position.set(500 + 150 * col, 18 + 150 * row);
            tile.on('revealed', this.onTileRevealed, this);
            this.tiles.push(tile);
            this.stage.addChild(tile);
        }

        // set new values to the tiles
        this.newGame();

        // add button
        this.btnPlay = new SimpleButton(442, 50, 0xc3dc41);
        this.btnPlay.position.set(500, 480);
        this.btnPlay.on('pointerdown', this.onPointerDown, this);
        this.stage.addChild(this.btnPlay);

        // resize
        this.resize();
    }

    newGame(): void {
        let len:number = VALUES.length;
        let values:number[] = [];

        for (let i = 0; i < len; i++) {
            values.push(0);
        }

        let index = 0;
        let limit = 3;
        this.currentPrize = - 1;
        while (index < len-1) {
            let rnd = Math.floor(Math.random() * VALUES.length);
            if (values[rnd] < limit) { // max and only one
                this.tiles[index].setPrize(rnd);
                index++;

                values[rnd]++;
                if (values[rnd] === 3) {
                    this.currentPrize = rnd;
                    limit = 2; // change the limit
                }
            }
        }
    }

    revealAll(): void {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].reveal();
        }
    }

    resize(): void {
        // get the min ratio
        var ratio = Math.min(window.innerWidth / 960, window.innerHeight / 554);

        // scale stage
        this.stage.scale.set(ratio, ratio);

        // resize render
        Game.app.renderer.resize(960 * ratio, 554 * ratio);
    }

    onPointerDown(event:PIXI.interaction.InteractionEvent): void {
        this.btnPlay.text = 'Reveal All';
        if (this.isThereTileRemaining) {
            this.revealAll();
        } else {
            this.newGame();
        }
    }

    onTileRevealed(tile:Tile): void {
        if (!this.isThereTileRemaining) {
            this.btnPlay.text = 'Play next scratchcard';
            this.showResult();
        }
    }

    showResult(): void {
        if (this.currentPrize > -1) {
            for (let i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].prizeId === this.currentPrize) {
                    this.tiles[i].win();
                } else {
                    this.tiles[i].fail();
                }
            }
        }
    }

    get isThereTileRemaining(): boolean {
        return this.tiles.filter(x => x.interactive).length > 0;
    }
}

let game:Game = new Game();
game.preload();

window.addEventListener('resize', game.resize.bind(game));