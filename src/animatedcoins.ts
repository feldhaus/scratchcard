import * as Particles from "pixi-particles";

export class AnimatedCoins extends PIXI.Container {

    private emitter: Particles.Emitter;
    private elapsed: number;

    constructor(width: number) {
        super();

        this.emitter = new Particles.Emitter(
            this,
            // the collection of particle images to use
            [
                {
                    framerate: 20,
                    loop: true,
                    textures: [
                        "coin_6.png",
                        "coin_5.png",
                        "coin_4.png",
                        "coin_3.png",
                        "coin_2.png",
                        "coin_1.png",
                    ],
                },
            ],
            // emitter configuration, edit this to change the look of the emitter
            {
                alpha: {
                    start: 1,
                    end: 1,
                },
                scale: {
                    start: 0.5,
                    end: 0.5,
                    minimumScaleMultiplier: 0.5,
                },
                color: {
                    start: "#ffffff",
                    end: "#ffffff",
                },
                speed: {
                    start: 400,
                    end: 450,
                    minimumSpeedMultiplier: 1,
                },
                acceleration: {
                    x: 0,
                    y: 0,
                },
                maxSpeed: 0,
                startRotation: {
                    min: 90,
                    max: 90,
                },
                noRotation: false,
                rotationSpeed: {
                    min: 0,
                    max: 0,
                },
                lifetime: {
                    min: 4,
                    max: 4,
                },
                blendMode: "normal",
                frequency: 0.1,
                emitterLifetime: -1,
                maxParticles: 100,
                pos: {
                    x: 0,
                    y: 0,
                },
                addAtBack: false,
                spawnType: "rect",
                spawnRect: {
                    x: 0,
                    y: 0,
                    w: width,
                    h: 10,
                },
            },
        );
        this.emitter.particleConstructor = Particles.AnimatedParticle;
        this.emitter.emit = false;

        // start the update
        this.update();
    }

    public play(): void {
        // calculate the current time
        this.elapsed = Date.now();

        // start emitting
        this.emitter.emit = true;
    }

    public pause(): void {
        // stop emitting
        this.emitter.emit = false;
    }

    private update(): void {
        // update the next frame
        requestAnimationFrame(this.update.bind(this));

        // get current time
        const now = Date.now();

        // the emitter requires the elapsed number of seconds since the last update
        this.emitter.update((now - this.elapsed) * 0.001);
        this.elapsed = now;
    }
}
