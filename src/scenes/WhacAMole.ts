import Phaser from 'phaser'

interface Enemy  {
    enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    dead: boolean,
    timer: number,
    type: string
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
    collisionLayer: Phaser.Tilemaps.TilemapLayer | null;
    waterLayer: Phaser.Tilemaps.TilemapLayer | null;

    hammer: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;

    tick: number;

    enemies: Array<Enemy>;

    text: Phaser.GameObjects.Text | null;

    curHealth: number;

    font: {[letter: string]: Array<Array<number>>}

    fontSize: number;
    
    playButton: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;
    started: boolean;
    hold: number;

    mapType: string;

	constructor()
	{
		super('whacamole');
        this.mapType='default';

        this.music=null;
        this.music_damage=null;
        this.music_damage=null;
        this.sound_bonk=null;
        this.sound_healthMinus=null;
        this.sound_healthDeath=null;

        this.map = null;
        this.backgroundLayer=null;
        this.collisionLayer=null;
        this.waterLayer=null;

        this.hammer=null;

        this.tick = 0;

        this.enemies = [];

        this.text=null;

        this.curHealth=4;

        this.font = {};

        this.fontSize = 200;
        this.playButton=null;
        this.started = false;
        this.hold=100;
	}

    init(data)
    {
        this.mapType=data.mapType;
    }

	preload()
    {
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
    this.font.Y = this.letter('Y', this.fontSize);
    this.font.O = this.letter('O', this.fontSize);
    this.font.U = this.letter('U', this.fontSize);
    this.font.L = this.letter('L', this.fontSize);
    this.font.S = this.letter('S', this.fontSize);
    this.font.T = this.letter('T', this.fontSize);

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
  
    //this.add.image(400, 300, 'map_tilesw');
    let key = 'json_map';
    if(this.mapType == 'water')
        key = 'json_mapWater'
    this.map = this.make.tilemap({ key: key });//json map 
    let tiles = this.map.addTilesetImage('map_tilesew','tiles');

    this.backgroundLayer = this.map.createLayer('background', tiles);
    this.collisionLayer = this.map.createLayer('collision', tiles, 0, 0).setActive(true).setVisible(false);
    this.waterLayer = this.map.createLayer('water', tiles, 0, 0).setActive(true).setVisible(false);
    
    const { width, height } = this.scale;
    this.playButton = this.physics.add.sprite(width * 0.5, height * 0.7, 'krtek').setScale(4);

    this.text = this.add.text(100, 16, '', {
        fontSize: '55',
        fontFamily: 'fantasy',
        align: 'center',
    });

    this.text?.setText('Hold Diglet to start');
    this.text?.setColor('Black');
    this.text?.setPosition(530, 340);
    this.text?.setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif');
    this.text?.setFontSize(65);

    this.playButton.anims.play('krtekup', true);
    this.physics.add.overlap(this.playButton, this.backgroundLayer);    

    this.hammer = this.physics.add.sprite(100, 450, 'hammerAn');
    this.physics.add.overlap(this.hammer, this.backgroundLayer);  
    
    if(this.hammer && this.playButton)
        this.physics.add.overlap(this.hammer, this.playButton, () => { 
            this.hold--;
            this.playButton?.anims.setProgress(this.hold/100);
            if(this.hold<=20)
                this.hold = 0;
                setTimeout(()=>{
                    this.playButton?.destroy(true);
                    this.started = true;
                },1300);
            });
       
    this.backgroundLayer.setCollisionBetween(1, 25);  
    
    this.text.setOrigin(0.5);
    this.text.setScrollFactor(0);    
    this.updateText();
    
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
        this.text?.setPosition(1295, 50);
        if(this.curHealth == 4)
        {
            this.text?.setText('♥♥♥')
        }
        else if(this.curHealth == 3)
        {
            this.text?.setText('♥♥')
        }
        else if (this.curHealth == 2)
        {
            this.text?.setText('♥')
        }
        else
        return;
        this.text?.setColor('red');
        this.text?.setFontSize(40);
    }

    pointer_move(pointer) {
        if(this.hammer == undefined)
            return;
        this.hammer.x = pointer.x;
        this.hammer.y = pointer.y;
    }

    
    letter(char:string,size:number): Array<Array<number>> {
        let sizeX = size*0.66;
        let y;
        let tmp;
        let arrayLet:Array<Array<number>> = [];
        switch(char){
            case 'Y':
                for(let i = 0; i< sizeX;i++){
                    y = i*1.33;
                    if(i<sizeX/2){
                        arrayLet.push([i,y]);
                    }
                    else
                    {
                        tmp = y - size/2.33;
                        y = size/2.33 - tmp;
                        arrayLet.push([i,y]);
                    }
                }
                for(let i = size/2; i<size; i++)
                {
                    arrayLet.push([sizeX/2,i]);
                }
                break;
            case 'O':
                for(let i = 0; i<sizeX;i++){
                    arrayLet.push([i,0]);
                    arrayLet.push([i,size]);
                }
                for(let i = 0; i<size;i++){
                    arrayLet.push([0,i]);
                    arrayLet.push([sizeX,i]);
                }
                break;
            case 'U':
                for(let i = 0; i<sizeX;i++){
                    arrayLet.push([i,size]);
                }
                for(let i = 0; i<size;i++){
                    arrayLet.push([0, i]);
                    arrayLet.push([sizeX, i]);
                }
                break;
            case 'L':
                for(let i = 0; i<sizeX;i++){
                    arrayLet.push([i, size]);
                }
                for(let i = 0; i<size; i++){
                    arrayLet.push([0,i]);
                }
                break;
            case 'S':
                for(let i = 0; i<sizeX; i++){
                    arrayLet.push([i,0]);
                    arrayLet.push([i,size]);
                    arrayLet.push([i, size/2]);
                }
                for(let i = 0; i<size/2;i++){
                    arrayLet.push([0,i]);
                    arrayLet.push([sizeX,size/2+i]);
                }

                break;
            case 'T':
                for(let i = 0; i < sizeX; i++){
                    arrayLet.push([i, 0]);
                }
                for(let i = 0; i< size; i++){
                    arrayLet.push([sizeX/2, i]);
                }
                break;


        }
        return arrayLet;
    }

    
    

    update() {
        if(!this.started)
            return;
        this.tick++;
        if(this.curHealth > 0){
            if(this.tick % 30 == 0 && Math.random() > 0.5 && this.enemies.length < 10) {
                let x = Math.round((Math.floor(Math.random()*1408))/44)*32;
                let y = Math.round((Math.floor(Math.random()*676))/32)*28+220;
                if(this.collisionLayer?.getTileAtWorldXY(x, y))
                    return;
                let type = this.waterLayer?.getTileAtWorldXY(x, y) ? 'potapec' : 'krtek'
                let enemy = this.physics.add.sprite(x, y, type);
                enemy.setBounce(0.1);
                let myEnemy = {enemy: enemy, dead: false, timer: setTimeout(()=>{this.reduceHealth(myEnemy)}, 3000), type: type};
                this.enemies.push(myEnemy);
                enemy.anims.play(`${myEnemy.type}up`, true);
                if(this.backgroundLayer){
                    this.physics.add.overlap(enemy, this.backgroundLayer);
                    if(this.hammer){
                        this.physics.add.overlap(this.hammer, enemy, () => { this.collisionHandlerEnemy(myEnemy) });
                    }
                }
            }
        }
        else if(this.tick % 10 == 0)
        {
            let you = ["Y","O","U"];
            let lost = ["L", "O", "S", "T"];
            
            you.forEach((element, index) => {
                let r = Math.floor(Math.random()*this.font[element].length);
                let x = this.font[element][r][0] + index*(this.fontSize + 20) + 75;
                let y = this.font[element][r][1] + 280;
                let enemy = this.physics.add.sprite(x, y, 'krtek');
                enemy.anims.play('krtekup', true);
            });

            lost.forEach((element, index) => {
                let r = Math.floor(Math.random()*this.font[element].length);
                let x = this.font[element][r][0] + index*(this.fontSize +20) + 540;
                let y = this.font[element][r][1] + 620;
                let enemy = this.physics.add.sprite(x, y, 'krtek');
                enemy.anims.play('krtekup', true);
            });
            

        }
        this.updateText();
        if(this.curHealth <= 0){
            this.text?.setText('Sinep Studio');
            this.text?.setColor('Gold');
            this.text?.setPosition(1330, 240);
            this.text?.setFontFamily('Georgia, "Goudy Bookletter 1911", Times, serif');
            this.text?.setFontSize(15);
            //setTimeout(()=>{this.scene.restart();}, 10000);
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
        this.enemies.splice(index, 1);
        let curAnim = enemy.enemy.anims.getName();
        let curAnimProgress = enemy.enemy.anims.getProgress();
        if(removeParam==1){
            enemy.enemy.anims.play(`${enemy.type}kill`, true);
            enemy.enemy.anims.setProgress(curAnimProgress != 1 ? (curAnim == "up" ? 1 - curAnimProgress : curAnimProgress) : 0); 
            setTimeout(()=>{
                enemy.enemy.destroy(true);
            }, curAnimProgress != 1 ? (curAnim == `${enemy.type}up` ? 1300 * (1 - curAnimProgress) : 1300 * curAnimProgress) : 1300);
        }
        else if(removeParam==-1){
            enemy.enemy.destroy(true);
        }
        else{
            enemy.enemy.anims.play(`${enemy.type}down`, true);
            setTimeout(()=>{
                enemy.enemy.destroy(true);
            }, 1300);
        }
    }

    collisionHandlerEnemy(enemy: Enemy) {
        
        if(enemy.dead)
            return;
        enemy.dead = true;
        this.hammer?.anims.play('hammerBonk', true);
        this.sound_bonk?.play();
        this.removeEnemy(enemy, 1);
    }
}
