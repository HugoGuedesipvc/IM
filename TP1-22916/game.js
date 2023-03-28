
var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function BootScene ()
        {
            Phaser.Scene.call(this, { key: 'BootScene' });
        },
    preload: 
        function ()
        {
            this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
            this.load.image('tiles2', 'assets/AnimTIles.png');
            this.load.image('tiles', 'assets/StaticTiles.png');
            this.load.tilemapTiledJSON('map', 'assets/worldmap.json');
        },
    create: 
        function ()
        {
            this.scene.start('WorldScene');
        },
    
});
var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
        function WorldScene ()
        {
            Phaser.Scene.call(this, { key: 'WorldScene' });
        },
    preload: 
        function ()
        {
        
        },
    create: function ()
    {       
            //criação dos tiles 
            var map = this.make.tilemap({ key: 'map' });
            var tileset = map.addTilesetImage('worldmap', 'tiles');
            var tileset2 = map.addTilesetImage('worldmap2', 'tiles2');
         
            //ao utilizar os tiles criados criar o mapa do jogo
            var ground = map.createStaticLayer('Ground', tileset);
            var wallslayer = map.createStaticLayer('Walls', tileset);
            var foliagem = map.createStaticLayer('Flora', tileset2);

            //criar colisões
            wallslayer.setCollisionByExclusion([-1]);
            foliagem.setCollisionByExclusion([-1]);

            //criar o player
            this.player = this.physics.add.sprite(50, 100, 'player', 6);

            //animação do sprite   
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
                frameRate: 10,
                repeat: -1
            });
            
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'up',
                frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'down',
                frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
                frameRate: 10,
                repeat: -1
            });        
            
            //criar fisicas no fim do mapa
            this.physics.world.bounds.width = map.widthInPixels;
            this.physics.world.bounds.height = map.heightInPixels;
            this.player.setCollideWorldBounds(true);
       
            this.physics.add.collider(this.player, wallslayer);
            this.physics.add.collider(this.player, foliagem);
    
            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.startFollow(this.player);
            this.cameras.main.roundPixels = true; // avoid tile bleed
        
            this.cursors = this.input.keyboard.createCursorKeys();      

            this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
            for(var i = 0; i < 3; i++) {
            var x = Phaser.Math.RND.between(70, 150/*this.physics.world.bounds.width**/);
            var y = Phaser.Math.RND.between(150, 250/*this.physics.world.bounds.height**/);

            this.spawns.create(x, y, 20, 20); 

        }        
    
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    },
    onMeetEnemy: function(player, zone) {        
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        this.cameras.main.flash(0.5);

    },
    update: function (time, delta)
    {
   
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
        }        

        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
            
});
var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 480,
    height: 280,
    zoom: 1.5,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);