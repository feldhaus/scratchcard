declare const VALUES: {
    value: number;
    img: string;
}[];
declare class Game {
    private stage;
    private tiles;
    private btnPlay;
    private currentPrize;
    static app: PIXI.Application;
    constructor();
    preload(): void;
    setup(loader: PIXI.loaders.Loader, resources: any): void;
    newGame(): void;
    revealAll(): void;
    resize(): void;
    onPointerDown(event: PIXI.interaction.InteractionEvent): void;
    onTileRevealed(tile: Tile): void;
    showResult(): void;
    readonly isThereTileRemaining: boolean;
}
declare let game: Game;
declare class SimpleButton extends PIXI.Graphics {
    private label;
    constructor(width: number, height: number, color: number);
    onPointerDown(event: PIXI.interaction.InteractionEvent): void;
    onPointerUp(event: PIXI.interaction.InteractionEvent): void;
    text: string;
}
declare class Tile extends PIXI.Container {
    private id;
    private renderTexture;
    private brush;
    private prize;
    private label;
    private dragging;
    private points;
    readonly radius: number;
    readonly limit: number;
    constructor(width: number, height: number);
    onPointerMove(event: PIXI.interaction.InteractionEvent): void;
    onPointerOver(event: PIXI.interaction.InteractionEvent): void;
    onPointerOut(event: PIXI.interaction.InteractionEvent): void;
    pointInCircle(pA: PIXI.Point, pB: PIXI.Point, radius: number): boolean;
    setPrize(prize: number): void;
    reveal(): void;
    win(): void;
    fail(): void;
    addCircle(p: PIXI.Point, radius: number): void;
    readonly prizeId: number;
}
