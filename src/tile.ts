import { TweenMax } from 'gsap';
import { PRIZES } from './prizes';

// TweenMax Typescrypt fix: https://greensock.com/forums/topic/16395-gsap-business-green-in-angular-2/
declare module "gsap" {
    export interface TweenConfig {
        [p: string]: any;
    }
}

export class Tile extends PIXI.Container {

    private id:number;
    private renderer:PIXI.SystemRenderer;
    private renderTexture:PIXI.RenderTexture;
    
    private prize:PIXI.Sprite;
    private label:PIXI.Text;
    private dragging:boolean;
    private points:PIXI.Point[];

    readonly radius:number = 30;
    readonly limit:number = 4;

    static brush:PIXI.Sprite;
    static rect:PIXI.Graphics;

	constructor(renderer:PIXI.SystemRenderer) {
        super();

        this.renderer = renderer;

        // get the brush
        if (Tile.brush === undefined) {
            Tile.brush = PIXI.Sprite.fromImage('assets/images/brush.png');
            Tile.brush.width = 60;
            Tile.brush.height = 60;
            Tile.brush.anchor.set(0.5, 0.5);
        }

        // add cover (unscratched)
        let cover = PIXI.Sprite.fromFrame('tile_bg_unscratched.png');
        this.addChild(cover);

        if (Tile.rect === undefined) {
            Tile.rect = new PIXI.Graphics();
            Tile.rect.beginFill(0xffffff);
            Tile.rect.drawRect(0, 0, cover.width, cover.height);
            Tile.rect.endFill();
        }

        // add prize and value
        let main:PIXI.Container = new PIXI.Container();
        this.addChild(main);

        let bg:PIXI.Sprite = PIXI.Sprite.fromFrame('tile_underlay.png');
        main.addChild(bg);

        let scratched:PIXI.Sprite = PIXI.Sprite.fromFrame('tile_bg_scratched_default.png');
        main.addChild(scratched);

        this.prize = new PIXI.Sprite();
        this.prize.anchor.set(0.5, 0.5);
        this.prize.scale.set(0.7, 0.7);
        this.prize.position.set(cover.width * 0.5, cover.height * 0.5);
        main.addChild(this.prize);

        this.label = new PIXI.Text('', {
            fill: 0xffffff,
            fontSize: 20,
            stroke: 0x000000,
            strokeThickness: 3
        });
        this.label.anchor.set(0.5, 1);
        this.label.position.set(bg.width * 0.5, bg.height - 5);
        main.addChild(this.label);

        // add render texture to emulate the scratch
        this.renderTexture = PIXI.RenderTexture.create(cover.width, cover.height);
        let renderTextureSprite:PIXI.Sprite = new PIXI.Sprite(this.renderTexture);
        this.addChild(renderTextureSprite);
        main.mask = renderTextureSprite;
    
        // set as interactive and add listener
        this.points = [];
        this.dragging = false;
        this.interactive = true;
        this.on('pointermove', this.onPointerMove);
        this.on('pointerover', this.onPointerOver);
        this.on('pointerdown', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
        this.on('pointeroutside', this.onPointerOut);
        this.on('pointerup', this.onPointerOut);
    }

    private onPointerMove(event:PIXI.interaction.InteractionEvent): void {
        if (this.dragging) {
            let point:PIXI.Point = event.data.getLocalPosition(this);
            Tile.brush.rotation = Math.random() * Math.PI;
            Tile.brush.position.copy(point);
            this.renderer.render(Tile.brush, this.renderTexture, false, null, false);

            if (this.points.length === 0) {
                this.points.push(point);
            } else {
                let len:number = this.points.length;
                let flag:number = 0;
                for (let i = 0; i < len; i++) {
                    if (!this.pointInCircle(this.points[i], point, this.radius)) {
                        flag++;
                    }
                }
                if (flag === len) {
                    this.points.push(point);
                    if (len >= this.limit) {
                        this.reveal();
                    }
                }
            }
        }
    }

    private onPointerOver(event:PIXI.interaction.InteractionEvent): void {
        this.dragging = true;
    }

    private onPointerOut(event:PIXI.interaction.InteractionEvent): void {
        this.dragging = false
    }

    private pointInCircle(pA:PIXI.Point, pB:PIXI.Point, radius:number): boolean {
        let dx:number = pA.x - pB.x;
        let dy:number = pA.y - pB.y;
        let distancesquared = dx * dx + dy * dy;
        return distancesquared <= radius * radius;
    }

    public setPrize(prize:number): void {
        this.points = [];
        this.dragging = false;
        this.interactive = true;

        this.id = prize;
        this.prize.alpha = 1;
        this.prize.texture = PIXI.Texture.fromFrame(PRIZES[this.id].img);
        TweenMax.killTweensOf(this.prize.scale);
        this.prize.scale.set(0.7, 0.7);
        this.label.text = (this.id > 0) ? '$' + PRIZES[this.id].value : '';

        this.renderer.render(new PIXI.Graphics(), this.renderTexture, true, null, false);
    }

    public reveal(): void {
        this.dragging = false;
        this.interactive = false;
        this.renderer.render(Tile.rect, this.renderTexture, false, null, false);
        
        this.emit('revealed', this);
    }

    public win(): void {
        TweenMax.to(this.prize.scale, 1, {x: 1, y: 1, repeat: -1, yoyo: true});
    }

    public fail(): void {
        this.prize.alpha = 0.5;
    }

    public get prizeId (): number {
        return this.id;
    }
}