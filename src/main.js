import Phaser from 'phaser'

import WhacAMole from './scenes/WhacAMole'

const config = {
	type: Phaser.AUTO,
    parent: 'phaser-app',
    scale: {
        mode: Phaser.Scale.FIT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    debug: true,
	scene: [WhacAMole]
}

export default new Phaser.Game(config)
