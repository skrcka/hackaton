import Phaser from 'phaser'

interface Enemy  {
    enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    dead: boolean,
    timer: number
}


export default class WhacAMole extends Phaser.Scene
{
    music: Phaser.Sound.BaseSound | null;
    music_damage: Phaser.Sound.BaseSound | null;
    sound_bonk: Phaser.Sound.BaseSound | null;
    sound_healthMinus: Phaser.Sound.BaseSound | null;
    sound_healthDeath: Phaser.Sound.BaseSound | null;

    map: Phaser.Tilemaps.Tilemap | null;
    backgroundLayer: Phaser.Tilemaps.TilemapLayer | null;

    hammer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;

    tick: number;

    enemies: Array<Enemy>;

    text: Phaser.GameObjects.Text | null;

    curHealth: number;
    
	constructor()
	{
		super('hello-world');

        this.music=null;
        this.music_damage=null;
        this.music_damage=null;
        this.sound_bonk=null;
        this.sound_healthMinus=null;
        this.sound_healthDeath=null;

        this.map = null;
        this.backgroundLayer=null;

        this.hammer=null;

        this.tick = 0;

        this.enemies = [];

        this.text=null;

        this.curHealth=4;
	}

	preload()
    {
        this.load.spritesheet('krtek', 'assets/Krtek_rescale.png',
            { frameWidth: 64, frameHeight: 70} );
            
        this.load.spritesheet('items', 'assets/items.png', { frameWidth: 32, frameHeight: 32 } ); 
        this.load.spritesheet('hammer', 'assets/hammer.png', { frameWidth: 32, frameHeight: 32 } ); 

        this.load.image('tiles', 'assets/map_tilesew.png');
        this.load.tilemapTiledJSON('json_map', 'assets/json_map.json');
        
        this.load.audio('bgMusic','assets/song.mp3');
        this.load.audio('damage','assets/kill.mp3');
        this.load.audio('bonk','assets/bonk.mp3');
        this.load.audio('healthMinus','assets/aughMinus.mp3');
        this.load.audio('healthDeath','assets/aughDeath.mp3');
    }

    resize(width, height){
        this.scale.displaySize.setAspectRatio(width/height);
        this.scale.refresh();
    }

    create()
    {
    this.resize(Math.min(window.innerWidth, window.outerWidth), Math.min(window.innerHeight, window.outerHeight));
    //AUDIO
    this.music = this.sound.add('bgMusic');
    this.music_damage = this.sound.add('damage');
    this.sound_bonk = this.sound.add('bonk');
    this.sound_healthMinus = this.sound.add('healthMinus');
    this.sound_healthDeath = this.sound.add('healthDeath');

    this.music.play();

  
    //this.add.image(400, 300, 'map_tilesw');
    this.map = this.make.tilemap({ key: 'json_map' });//json map 
    let tiles = this.map.addTilesetImage('map_tilesew','tiles');
    console.log(tiles);

    this.backgroundLayer = this.map.createLayer('background', tiles);
    
    this.hammer = this.physics.add.sprite(100, 450, 'hammer');
    this.physics.add.overlap(this.hammer, this.backgroundLayer);    
       
    this.backgroundLayer.setCollisionBetween(1, 25);  
    
    this.text = this.add.text(100, 16, '', {
        fontSize: '55',
        fontFamily: 'fantasy',
        align: 'center',
    });
    this.text.setOrigin(0.5);
    this.text.setScrollFactor(0);    
    this.updateText();
    
    this.anims.create({
        key: 'alive',
        frames: this.anims.generateFrameNumbers('robot', { start: 8, end: 12 }),
        frameRate: 80,
        repeat: -1
    });
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('krtek', {start: 0, end: 12 }),
        frameRate: 10,
        repeat:0
    });
    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('krtek', {start: 12, end: 0 }),
        frameRate: 10,
        repeat:0
    });
    
    this.anims.create({
        key: 'kill',
        frames: this.anims.generateFrameNumbers('krtek', {start: 13, end: 26 }),
        frameRate: 10,
        repeat:0
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

    updateText()
    {
        this.text?.setPosition(100, this.text.height);
        this.text?.setText(`Počet životů ${this.curHealth}`);
        this.text?.setColor('white');
    }

    pointer_move(pointer) {
        if(this.hammer == undefined)
            return;
        this.hammer.x = pointer.x;
        this.hammer.y = pointer.y;
    }

    //MATEMATIKA
    //letterY(start, end){
    //}

    update() {
        this.tick++;
        if(this.curHealth > 0){
            if(this.tick % 30 == 0 && Math.random() > 0.5 && this.enemies.length < 10) {
                let x = Math.round((Math.floor(Math.random()*1005))/31)*31;
                let y = Math.round((Math.floor(Math.random()*640))/31)*24+220;
                console.log(`spawn: ${x} ${y}`);
                let enemy = this.physics.add.sprite(x, y, 'krtek');
                enemy.setBounce(0.1);
                let myEnemy = {enemy: enemy, dead: false, timer: setTimeout(()=>{this.reduceHealth(myEnemy)}, 3000)};
                this.enemies.push(myEnemy);
                enemy.anims.play('up', true);
                if(this.backgroundLayer){
                    //this.physics.add.collider(enemy, this.collisionLayer);
                    this.physics.add.overlap(enemy, this.backgroundLayer);
                    if(this.hammer)
                        this.physics.add.overlap(this.hammer, enemy, () => { this.collisionHandlerEnemy(myEnemy) });
                }
            }
        }
        else if(this.tick % 4 == 0)
        {
            
            let x = Math.round((Math.floor(Math.random()*1005))/31)*31;
            let y = Math.round((Math.floor(Math.random()*640))/31)*24+220;
            let enemy = this.physics.add.sprite(x, y, 'krtek');
            enemy.anims.play('up', true);
        }
        this.updateText();
        if(this.curHealth <= 0){
            this.text?.setText('you dieded axaxa');
        }
    }

    reduceHealth(enemy: Enemy){
        if(enemy.dead)
            return;
        else{
            this.removeEnemy(enemy, 0);
        }   
        this.curHealth--;
        if(this.curHealth == 0){
            this.sound_healthDeath?.play();
        }
        else
            this.sound_healthMinus?.play();
    }

    removeEnemy(enemy: Enemy, removeParam: number){
        let index = this.enemies.indexOf(enemy);
        console.log(index);
        this.enemies.splice(index, 1);
        if(removeParam){
            enemy.enemy.anims.play('kill', true); 
            setTimeout(()=>{
                enemy.enemy.destroy(true);
            }, 1300);
        }
        else{
            enemy.enemy.anims.play('down', true);
            setTimeout(()=>{
                enemy.enemy.destroy(true);
            },1300);
        }
    }

    collisionHandlerEnemy(enemy: Enemy) {
        if(enemy.dead)
            return;
        enemy.dead = true;
        this.sound_bonk?.play();
        this.removeEnemy(enemy, 1);
    }
}
