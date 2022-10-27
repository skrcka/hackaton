import Phaser from 'phaser'

export default class WhacAMole extends Phaser.Scene
{
    music: Phaser.Sound.BaseSound | null;
    music_damage: Phaser.Sound.BaseSound | null;

    map: Phaser.Tilemaps.Tilemap | null;
    backgroundLayer: Phaser.Tilemaps.TilemapLayer | null;

    hammer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;

    tick: number;

    enemies: Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
    
	constructor()
	{
		super('hello-world');

        this.music=null;
        this.music_damage=null;

        this.map = null;
        this.backgroundLayer=null;

        this.hammer=null;

        this.tick = 0;

        this.enemies = [];
	}

	preload()
    {
        this.load.spritesheet('robot', 'assets/lego.png',
            { frameWidth: 37, frameHeight: 48 } ); 
            
        this.load.spritesheet('items', 'assets/items.png', { frameWidth: 32, frameHeight: 32 } ); 
        this.load.spritesheet('hammer', 'assets/hammer.png', { frameWidth: 32, frameHeight: 32 } ); 

        this.load.image('tiles', 'assets/map_tilesew.png');
        this.load.tilemapTiledJSON('json_map', 'assets/json_map.json');
        
        this.load.audio('bgMusic','assets/song.mp3');
        this.load.audio('damage','assets/kill.mp3');
    }

    resize(width, height){
        this.scale.displaySize.setAspectRatio(width/height);
        this.scale.refresh();
    }

    pointer_move(pointer) {
        if(this.hammer == undefined)
            return;
        this.hammer.x = pointer.x;
        this.hammer.y = pointer.y;
    }

    create()
    {
    this.resize(Math.min(window.innerWidth, window.outerWidth), Math.min(window.innerHeight, window.outerHeight));
    //AUDIO
    this.music = this.sound.add('bgMusic');
    this.music_damage = this.sound.add('damage');

    this.music.play();

  
    //this.add.image(400, 300, 'map_tilesw');
    this.map = this.make.tilemap({ key: 'json_map' });//json map 
    let tiles = this.map.addTilesetImage('map_tilesew','tiles');
    console.log(tiles);

    this.backgroundLayer = this.map.createLayer('background', tiles);
    
    this.hammer = this.physics.add.sprite(100, 450, 'hammer');
    //this.physics.add.overlap(this.hammer, this.backgroundLayer);
    
    //F:set collision range 
    //this.backgroundLayer.setCollisionBetween(1, 25);    
       
    /*
    text = this.add.text(game.canvas.width/2, 16, '', {
        fontSize: '3em',
        fontFamily: 'fantasy',
        align: 'center',
        boundsAlignH: "center", 
        boundsAlignV: "middle", 
        fill: '#ffffff'
    });
    text.setOrigin(0.5);
    text.setScrollFactor(0);    
    updateText();
    */
    
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 16 }),
        frameRate: 20,
        repeat: -1
    }); 
    
    // cursors = this.input.keyboard.createCursorKeys();  

	this.input.on('pointermove', (p) => { this.pointer_move(p); });
	/*
    window.addEventListener('resize', function (event) {
		this.scale.displaySize.setAspectRatio( width/height );
        this.scale.refresh();
	}, false);
    */
    }

    update() {     
        this.tick++;
        if(this.tick % 30 == 0 && Math.random() > 0.5 && this.enemies.length < 10) {
            let x = Math.floor(Math.random() * window.innerWidth);
            let y = Math.floor(Math.random() * window.innerHeight);
            console.log(`spawn: ${x} ${y}`);
            let enemy = this.physics.add.sprite(x, y, 'robot');
            enemy.setBounce(0.1);
            this.enemies.push(enemy);
            //if(this.collisionLayer && this.backgroundLayer){
            //this.physics.add.collider(enemy, this.collisionLayer);
            //this.physics.add.overlap(enemy, this.backgroundLayer);
            if(this.hammer)
                this.physics.add.overlap(this.hammer, enemy, () => { this.collisionHandlerEnemy(enemy) });
        }
    }

    collisionHandlerEnemy(enemy) {
        let index = this.enemies.indexOf(enemy);
        console.log(index);
        this.enemies[index].destroy(true);
        this.enemies.splice(index, 1);
        this.music_damage?.play();
    
        //updateText();
    }
}
