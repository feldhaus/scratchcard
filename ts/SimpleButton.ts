class SimpleButton extends PIXI.Graphics {
    private label:PIXI.Text;

    constructor(width:number, height:number, color:number) {
        super();

        // set as button
        this.buttonMode = true;
        this.interactive = true;

        // draw the rect
        this.beginFill(color);
        this.drawRect(0, 0, width, height);
        
        // add listeners
        this.on('pointerdown', this.onPointerDown);
        this.on('pointerup', this.onPointerUp);
        this.on('pointerout', this.onPointerUp);
        this.on('pointeroutside', this.onPointerUp);

        // add label
        this.label = new PIXI.Text('Reveal All', {
            fill: 0xffffff,
            fontSize: 20,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 2,
            dropShadowDistance: 2,
            dropShadowAngle: Math.PI / 4,
        });
        this.label.anchor.set(0.5, 0.5);
        this.label.position.set(width * 0.5, height * 0.5);
        this.addChild(this.label);
    }

    onPointerDown(event:PIXI.interaction.InteractionEvent): void {
        this.alpha = 0.7;
    }

    onPointerUp(event:PIXI.interaction.InteractionEvent): void {
        this.alpha = 1;
    }

    set text (value:string) {
        this.label.text = value;
    }
}