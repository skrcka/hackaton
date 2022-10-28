import Phaser from 'phaser'

import WhacAMole from './scenes/WhacAMole'

const config = {
	type: Phaser.CANVAS,
    width: 1408,
    height: 768,
    parent: 'parent',
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
    },
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
