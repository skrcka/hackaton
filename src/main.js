import Phaser from 'phaser'

import WhacAMole from './scenes/WhacAMole'
import MainMenu from './scenes/MainMenu'

const config = {
	type: Phaser.CANVAS,
    width: 1408,
    height: 896,
    parent: 'parent',
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    debug: true,
	scene: [MainMenu, WhacAMole]
}

export default new Phaser.Game(config)
