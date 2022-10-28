import Phaser from 'phaser'


export default class Menu extends Phaser.Scene
{
    hammer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;
    text: Phaser.GameObjects.Text | null;
    
    playButton1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;
    playButton2: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;
    playButton3: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;

    hold1: number;
    hold2: number;
    hold3: number;

    changingScene: string;

	constructor()
	{
		super('menu');

        this.hammer=null;
        this.text=null;
        this.playButton1=null;
        this.playButton2=null;
        this.playButton3=null;
        this.hold1=100;
        this.hold2=100;
        this.hold3=100;

        this.changingScene = '';
	}

	preload()
    {
        this.load.spritesheet('krtek', 'assets/Krtek_final.png',
            { frameWidth: 64, frameHeight: 71} );
        this.load.spritesheet('potapec', 'assets/potapec.png',
            { frameWidth: 64, frameHeight: 71} );
        this.load.spritesheet('zimni', 'assets/zimni.png',
            { frameWidth: 64, frameHeight: 71} );
            
        this.load.spritesheet('hammerAn', 'assets/Kladivo_fin.png', { frameWidth: 44, frameHeight: 44});

        this.load.image('tiles', 'assets/map_tilesew.png');
        this.load.tilemapTiledJSON('json_map', 'assets/json_map.json');
        this.load.tilemapTiledJSON('json_mapWater', 'assets/json_mapWater.json');
        this.load.tilemapTiledJSON('json_mapLava', 'assets/json_mapLava.json');
        
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

        this.anims.create({
            key: 'krtekup',
            frames: this.anims.generateFrameNumbers('krtek', {start: 0, end: 12 }),
            frameRate: 10,
            repeat:0
        });
        this.anims.create({
            key: 'krtekdown',
            frames: this.anims.generateFrameNumbers('krtek', {start: 12, end: 0 }),
            frameRate: 10,
            repeat:0
        });
        
        this.anims.create({
            key: 'krtekkill',
            frames: this.anims.generateFrameNumbers('krtek', {start: 13, end: 26 }),
            frameRate: 10,
            repeat:0
        });
        this.anims.create({
            key: 'hammerBonk',
            frames: this.anims.generateFrameNumbers('hammerAn', {start: 5, end: 12 }),
            frameRate: 30,
            repeat:0
        });

        this.anims.create({
            key: 'potapecup',
            frames: this.anims.generateFrameNumbers('potapec', {start: 0, end: 12 }),
            frameRate: 10,
            repeat:0
        });
        this.anims.create({
            key: 'potapecdown',
            frames: this.anims.generateFrameNumbers('potapec', {start: 12, end: 0 }),
            frameRate: 10,
            repeat:0
        });
        
        this.anims.create({
            key: 'potapeckill',
            frames: this.anims.generateFrameNumbers('potapec', {start: 13, end: 26 }),
            frameRate: 10,
            repeat:0
        });

        this.anims.create({
            key: 'zimniup',
            frames: this.anims.generateFrameNumbers('zimni', {start: 0, end: 12 }),
            frameRate: 10,
            repeat:0
        });
        this.anims.create({
            key: 'zimnidown',
            frames: this.anims.generateFrameNumbers('zimni', {start: 12, end: 0 }),
            frameRate: 10,
            repeat:0
        });
        
        this.anims.create({
            key: 'zimnikill',
            frames: this.anims.generateFrameNumbers('zimni', {start: 13, end: 26 }),
            frameRate: 10,
            repeat:0
        });
        
        const { width, height } = this.scale;
        this.playButton1 = this.physics.add.sprite(width * 0.2, height * 0.7, 'krtek').setScale(4);
        this.playButton2 = this.physics.add.sprite(width * 0.5, height * 0.7, 'potapec').setScale(4);
        this.playButton3 = this.physics.add.sprite(width * 0.7, height * 0.7, 'zimni').setScale(4);

        this.text = this.add.text(100, 16, '', {
            fontSize: '55',
            fontFamily: 'fantasy',
            align: 'center',
        });

        this.text?.setText('Hold Diglet to start');
        this.text?.setColor('Brown');
        this.text?.setPosition(530, 340);
        this.text?.setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif');
        this.text?.setFontSize(65);

        this.playButton1.anims.play('krtekup', true);
        this.playButton2.anims.play('potapecup', true);
        this.playButton3.anims.play('zimniup', true);

        this.hammer = this.physics.add.sprite(100, 450, 'hammerAn');
        
        if(this.hammer && this.playButton1)
            this.physics.add.overlap(this.hammer, this.playButton1, () => { 
                this.hold1--;
                this.playButton1?.anims.setProgress(Math.min(this.hold1/100,0));
                if(this.hold1==20)
                    this.changingScene = 'default';
                    this.hold1 = 0;
                }, ()=>!this.changingScene);

        if(this.hammer && this.playButton2)
            this.physics.add.overlap(this.hammer, this.playButton2, () => { 
                this.hold2--;
                this.playButton2?.anims.setProgress(Math.min(this.hold1/100,0));
                if(this.hold2==20)
                this.changingScene = 'water';
                    this.hold2 = 0;
                }, ()=>!this.changingScene);

            if(this.hammer && this.playButton3)
                this.physics.add.overlap(this.hammer, this.playButton3, () => { 
                    this.hold3--;
                    this.playButton3?.anims.setProgress(Math.min(this.hold1/100,0));
                    if(this.hold3==20)
                        this.changingScene = 'zimni';
                        this.hold3 = 0;
                    }, ()=>!this.changingScene);
        
        this.input.on('pointermove', (p) => { this.pointer_move(p); });
    }

    pointer_move(pointer) {
        if(this.hammer == undefined)
            return;
        this.hammer.x = pointer.x;
        this.hammer.y = pointer.y;
    }

    update() {
        if(this.changingScene){
            console.log('scene change');
            let scene = this.changingScene;
            setTimeout(()=>{
                this.playButton1?.destroy(true);
                this.playButton2?.destroy(true);
                this.playButton3?.destroy(true);
                this.scene.start('whacamole', {mapType: scene});
            }, 1300);
        this.changingScene = '';
        }
    }
}
