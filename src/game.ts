import * as PIXI from 'pixi.js';

import { Tile } from './tile';
import { SimpleButton } from './button';
import { AnimatedCoins } from './animatedcoins';

import { PRIZES } from './prizes';

export class Game extends PIXI.Application {

    private tiles:Tile[];
    private btnPlay:SimpleButton;
    private currentPrize:number;
    private coins:AnimatedCoins;

    constructor () {
        super(960, 554, {backgroundColor: 0x333333, legacy: true});
        document.body.appendChild(this.view);

        // set stage
        this.stage = this.stage;

        // preload the assets
        this.preload();
    }

    private preload(): void {
        PIXI.loader.add('assets/images/bg.jpg');
        PIXI.loader.add('assets/images/brush.png');
        PIXI.loader.add('assets/images/coin.json');

        if (window.devicePixelRatio < 2) {
            PIXI.loader.add('assets/images/tiles.json');
        } else {
            PIXI.loader.add('assets/images/tiles@2x.json');
        }
        
        PIXI.loader.load(this.setup.bind(this));
    }

    private setup(loader:PIXI.loaders.Loader, resources:any): void {
        let bg:PIXI.Sprite = PIXI.Sprite.fromImage('assets/images/bg.jpg');
        this.stage.addChild(bg);

        // add tiles
        this.tiles = [];
        for (let i = 0; i < 9; i++) {
            let col = i % 3;
            let row = Math.floor(i / 3);
            let tile = new Tile(this.renderer);
            tile.position.set(500 + 150 * col, 18 + 150 * row);
            tile.on('revealed', this.onTileRevealed, this);
            this.tiles.push(tile);
            this.stage.addChild(tile);
        }

        // add button
        this.btnPlay = new SimpleButton(442, 50, 0xc3dc41);
        this.btnPlay.position.set(500, 480);
        this.btnPlay.on('pointerdown', this.onPointerDown, this);
        this.stage.addChild(this.btnPlay);

        // add animated coins
        this.coins = new AnimatedCoins();
        this.stage.addChild(this.coins);

        // resize
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));

        // set new values to the tiles
        this.newGame();
    }

    private newGame(): void {
        let len:number = PRIZES.length;
        let values:number[] = [];

        this.coins.pause();

        for (let i = 0; i < len; i++) {
            values.push(0);
        }

        let index = 0;
        let limit = 3;
        this.currentPrize = - 1;
        while (index < len-1) {
            let rnd = Math.floor(Math.random() * PRIZES.length);
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

    private revealAll(): void {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].reveal();
        }
    }

    private resize(): void {
        // get the min ratio
        var ratio = Math.min(window.innerWidth / 960, window.innerHeight / 554);

        // scale stage
        this.stage.scale.set(ratio, ratio);

        // resize render
        this.renderer.resize(960 * ratio, 554 * ratio);
    }

    private onPointerDown(event:PIXI.interaction.InteractionEvent): void {
        this.btnPlay.text = 'Reveal All';
        if (this.isThereTileRemaining) {
            this.revealAll();
        } else {
            this.newGame();
        }
    }

    private onTileRevealed(tile:Tile): void {
        if (!this.isThereTileRemaining) {
            this.btnPlay.text = 'Play next scratchcard';
            this.showResult();
        }
    }

    private showResult(): void {
        if (this.currentPrize > -1) {
            for (let i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].prizeId === this.currentPrize) {
                    this.tiles[i].win();
                    this.coins.play();
                } else {
                    this.tiles[i].fail();
                }
            }
        }
    }

    private get isThereTileRemaining(): boolean {
        return this.tiles.filter(x => x.interactive).length > 0;
    }
}

window.onload = () => {
    const game = new Game();
};