import * as PIXI from 'pixi.js';

import { Tile } from './tile';
import { SimpleButton } from './button';

export const VALUES = [
    {value: 0,      img: 'assets/images/tile_scratched_freeplay@2x.png'},
    {value: 2,      img: 'assets/images/tile_scratched_prize_01@2x.png'},
    {value: 5,      img: 'assets/images/tile_scratched_prize_02@2x.png'},
    {value: 10,     img: 'assets/images/tile_scratched_prize_03@2x.png'},
    {value: 50,     img: 'assets/images/tile_scratched_prize_04@2x.png'},
    {value: 100,    img: 'assets/images/tile_scratched_prize_05@2x.png'},
    {value: 500,    img: 'assets/images/tile_scratched_prize_06@2x.png'},
    {value: 1000,   img: 'assets/images/tile_scratched_prize_07@2x.png'},
    {value: 10000,  img: 'assets/images/tile_scratched_prize_08@2x.png'},
    {value: 100000, img: 'assets/images/tile_scratched_prize_max@2x.png'}
];

export class Game extends PIXI.Application {

    private tiles:Tile[];
    private btnPlay:SimpleButton;
    private currentPrize:number;

    constructor () {
        super(800, 600, {backgroundColor: 0x333333, legacy: true});
        document.body.appendChild(this.view);

        // set stage
        this.stage = this.stage;

        // preload the assets
        this.preload();
    }

    private preload(): void {
        PIXI.loader.add('assets/images/bg.jpg');
        PIXI.loader.add('assets/images/tile_underlay.png');
        PIXI.loader.add('assets/images/tile_bg_scratched_default.png');
        PIXI.loader.add('assets/images/tile_bg_unscratched.png');

        for (let i = 0; i < VALUES.length; i++) {
            PIXI.loader.add(VALUES[i].img);
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
            let tile = new Tile(100, 100, this.renderer);
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
        window.addEventListener('resize', this.resize.bind(this));
    }

    private newGame(): void {
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