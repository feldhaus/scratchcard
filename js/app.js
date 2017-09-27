var VALUES = [
    { value: 0, img: 'images/tile_scratched_freeplay@2x.png' },
    { value: 2, img: 'images/tile_scratched_prize_01@2x.png' },
    { value: 5, img: 'images/tile_scratched_prize_02@2x.png' },
    { value: 10, img: 'images/tile_scratched_prize_03@2x.png' },
    { value: 50, img: 'images/tile_scratched_prize_04@2x.png' },
    { value: 100, img: 'images/tile_scratched_prize_05@2x.png' },
    { value: 500, img: 'images/tile_scratched_prize_06@2x.png' },
    { value: 1000, img: 'images/tile_scratched_prize_07@2x.png' },
    { value: 10000, img: 'images/tile_scratched_prize_08@2x.png' },
    { value: 100000, img: 'images/tile_scratched_prize_max@2x.png' }
];
var Game = (function () {
    function Game() {
        Game.app = new PIXI.Application(800, 600, {
            backgroundColor: 0x333333,
            legacy: true
        });
        document.body.appendChild(Game.app.view);
        Game.app.renderer.view.style.position = 'absolute';
        Game.app.renderer.view.style.margin = 'auto';
        Game.app.renderer.view.style.display = 'block';
        Game.app.renderer.view.style.left = '0';
        Game.app.renderer.view.style.right = '0';
        Game.app.renderer.view.style.top = '0';
        Game.app.renderer.view.style.bottom = '0';
        this.stage = Game.app.stage;
    }
    Game.prototype.preload = function () {
        PIXI.loader.add('images/bg.jpg');
        PIXI.loader.add('images/tile_underlay.png');
        PIXI.loader.add('images/tile_bg_scratched_default.png');
        PIXI.loader.add('images/tile_bg_unscratched.png');
        for (var i = 0; i < VALUES.length; i++) {
            PIXI.loader.add(VALUES[i].img);
        }
        PIXI.loader.load(this.setup.bind(this));
    };
    Game.prototype.setup = function (loader, resources) {
        var bg = PIXI.Sprite.fromImage('images/bg.jpg');
        this.stage.addChild(bg);
        this.tiles = [];
        for (var i = 0; i < 9; i++) {
            var col = i % 3;
            var row = Math.floor(i / 3);
            var tile = new Tile(100, 100);
            tile.position.set(500 + 150 * col, 18 + 150 * row);
            tile.on('revealed', this.onTileRevealed, this);
            this.tiles.push(tile);
            this.stage.addChild(tile);
        }
        this.newGame();
        this.btnPlay = new SimpleButton(442, 50, 0xc3dc41);
        this.btnPlay.position.set(500, 480);
        this.btnPlay.on('pointerdown', this.onPointerDown, this);
        this.stage.addChild(this.btnPlay);
        this.resize();
    };
    Game.prototype.newGame = function () {
        var len = VALUES.length;
        var values = [];
        for (var i = 0; i < len; i++) {
            values.push(0);
        }
        var index = 0;
        var limit = 3;
        this.currentPrize = -1;
        while (index < len - 1) {
            var rnd = Math.floor(Math.random() * VALUES.length);
            if (values[rnd] < limit) {
                this.tiles[index].setPrize(rnd);
                index++;
                values[rnd]++;
                if (values[rnd] === 3) {
                    this.currentPrize = rnd;
                    limit = 2;
                }
            }
        }
    };
    Game.prototype.revealAll = function () {
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].reveal();
        }
    };
    Game.prototype.resize = function () {
        var ratio = Math.min(window.innerWidth / 960, window.innerHeight / 554);
        this.stage.scale.set(ratio, ratio);
        Game.app.renderer.resize(960 * ratio, 554 * ratio);
    };
    Game.prototype.onPointerDown = function (event) {
        this.btnPlay.text = 'Reveal All';
        if (this.isThereTileRemaining) {
            this.revealAll();
        }
        else {
            this.newGame();
        }
    };
    Game.prototype.onTileRevealed = function (tile) {
        if (!this.isThereTileRemaining) {
            this.btnPlay.text = 'Play next scratchcard';
            this.showResult();
        }
    };
    Game.prototype.showResult = function () {
        if (this.currentPrize > -1) {
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].prizeId === this.currentPrize) {
                    this.tiles[i].win();
                }
                else {
                    this.tiles[i].fail();
                }
            }
        }
    };
    Object.defineProperty(Game.prototype, "isThereTileRemaining", {
        get: function () {
            return this.tiles.filter(function (x) { return x.interactive; }).length > 0;
        },
        enumerable: true,
        configurable: true
    });
    return Game;
}());
var game = new Game();
game.preload();
window.addEventListener('resize', game.resize.bind(game));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SimpleButton = (function (_super) {
    __extends(SimpleButton, _super);
    function SimpleButton(width, height, color) {
        var _this = _super.call(this) || this;
        _this.buttonMode = true;
        _this.interactive = true;
        _this.beginFill(color);
        _this.drawRect(0, 0, width, height);
        _this.on('pointerdown', _this.onPointerDown);
        _this.on('pointerup', _this.onPointerUp);
        _this.on('pointerout', _this.onPointerUp);
        _this.on('pointeroutside', _this.onPointerUp);
        _this.label = new PIXI.Text('Reveal All', {
            fill: 0xffffff,
            fontSize: 20,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 2,
            dropShadowDistance: 2,
            dropShadowAngle: Math.PI / 4,
        });
        _this.label.anchor.set(0.5, 0.5);
        _this.label.position.set(width * 0.5, height * 0.5);
        _this.addChild(_this.label);
        return _this;
    }
    SimpleButton.prototype.onPointerDown = function (event) {
        this.alpha = 0.7;
    };
    SimpleButton.prototype.onPointerUp = function (event) {
        this.alpha = 1;
    };
    Object.defineProperty(SimpleButton.prototype, "text", {
        set: function (value) {
            this.label.text = value;
        },
        enumerable: true,
        configurable: true
    });
    return SimpleButton;
}(PIXI.Graphics));
var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile(width, height) {
        var _this = _super.call(this) || this;
        _this.radius = 30;
        _this.limit = 4;
        _this.brush = new PIXI.Graphics();
        _this.brush.beginFill(0xffffff);
        _this.brush.drawCircle(0, 0, _this.radius);
        _this.brush.endFill();
        var cover = PIXI.Sprite.fromImage('images/tile_bg_unscratched.png');
        _this.addChild(cover);
        var main = new PIXI.Container();
        _this.addChild(main);
        var bg = PIXI.Sprite.fromImage('images/tile_underlay.png');
        main.addChild(bg);
        var scratched = PIXI.Sprite.fromImage('images/tile_bg_scratched_default.png');
        main.addChild(scratched);
        _this.prize = new PIXI.Sprite();
        _this.prize.anchor.set(0.5, 0.5);
        _this.prize.scale.set(0.7, 0.7);
        _this.prize.position.set(cover.width * 0.5, cover.height * 0.5);
        main.addChild(_this.prize);
        _this.label = new PIXI.Text('', {
            fill: 0xffffff,
            fontSize: 20,
            stroke: 0x000000,
            strokeThickness: 3
        });
        _this.label.anchor.set(0.5, 1);
        _this.label.position.set(bg.width * 0.5, bg.height - 5);
        main.addChild(_this.label);
        _this.renderTexture = PIXI.RenderTexture.create(cover.width, cover.height);
        var renderTextureSprite = new PIXI.Sprite(_this.renderTexture);
        _this.addChild(renderTextureSprite);
        main.mask = renderTextureSprite;
        _this.points = [];
        _this.dragging = false;
        _this.interactive = true;
        _this.on('pointermove', _this.onPointerMove);
        _this.on('pointerover', _this.onPointerOver);
        _this.on('pointerdown', _this.onPointerOver);
        _this.on('pointerout', _this.onPointerOut);
        _this.on('pointeroutside', _this.onPointerOut);
        _this.on('pointerup', _this.onPointerOut);
        return _this;
    }
    Tile.prototype.onPointerMove = function (event) {
        if (this.dragging) {
            var point = event.data.getLocalPosition(this);
            this.brush.position.copy(point);
            Game.app.renderer.render(this.brush, this.renderTexture, false, null, false);
            if (this.points.length === 0) {
                this.addCircle(point, this.radius);
            }
            else {
                var len = this.points.length;
                var flag = 0;
                for (var i = 0; i < len; i++) {
                    if (!this.pointInCircle(this.points[i], point, this.radius)) {
                        flag++;
                    }
                }
                if (flag === len) {
                    this.addCircle(point, this.radius);
                    if (len >= this.limit) {
                        this.reveal();
                    }
                }
            }
        }
    };
    Tile.prototype.onPointerOver = function (event) {
        this.dragging = true;
    };
    Tile.prototype.onPointerOut = function (event) {
        this.dragging = false;
    };
    Tile.prototype.pointInCircle = function (pA, pB, radius) {
        var dx = pA.x - pB.x;
        var dy = pA.y - pB.y;
        var distancesquared = dx * dx + dy * dy;
        return distancesquared <= radius * radius;
    };
    Tile.prototype.setPrize = function (prize) {
        this.points = [];
        this.dragging = false;
        this.interactive = true;
        this.id = prize;
        this.prize.alpha = 1;
        this.prize.texture = PIXI.Texture.fromImage(VALUES[this.id].img);
        TweenMax.killTweensOf(this.prize.scale);
        this.prize.scale.set(0.7, 0.7);
        this.label.text = (this.id > 0) ? '$' + VALUES[this.id].value : '';
        this.brush.clear();
        this.brush.beginFill(0xffffff);
        this.brush.drawCircle(0, 0, this.radius);
        this.brush.endFill();
        Game.app.renderer.render(new PIXI.Graphics(), this.renderTexture, true, null, false);
    };
    Tile.prototype.reveal = function () {
        this.dragging = false;
        this.interactive = false;
        this.brush.clear();
        this.brush.beginFill(0xffffff);
        this.brush.drawCircle(0, 0, 100);
        this.brush.endFill();
        this.brush.position.set(this.width * 0.5, this.height * 0.5);
        Game.app.renderer.render(this.brush, this.renderTexture, false, null, false);
        this.emit('revealed', this);
    };
    Tile.prototype.win = function () {
        TweenMax.to(this.prize.scale, 1, { x: 1, y: 1, repeat: -1, yoyo: true });
    };
    Tile.prototype.fail = function () {
        this.prize.alpha = 0.5;
    };
    Tile.prototype.addCircle = function (p, radius) {
        this.points.push(p);
    };
    Object.defineProperty(Tile.prototype, "prizeId", {
        get: function () {
            return this.id;
        },
        enumerable: true,
        configurable: true
    });
    return Tile;
}(PIXI.Container));
//# sourceMappingURL=app.js.map