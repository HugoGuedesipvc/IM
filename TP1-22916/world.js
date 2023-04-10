var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {

        this.load.spritesheet('player', 'assets/Personagem.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('tiles2', 'assets/AnimTIles.png');
        this.load.image('tiles', 'assets/StaticTiles.png');
        this.load.tilemapTiledJSON('map', 'assets/worldmap.json');
        

        this.load.image("dragonblue", "assets/dragonblue.png");
        this.load.image("dragonorrange", "assets/dragonorrange.png");
        
        this.load.spritesheet('player2', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
    },

    create: function ()
    {
        this.scene.start('WorldScene');
    }
});

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function ()
    {
        
    },

    create: function ()
    {
        var map = this.make.tilemap({ key: 'map' });
        var tileset = map.addTilesetImage('worldmap', 'tiles');
        var tileset2 = map.addTilesetImage('worldmap2', 'tiles2');
        
        var ground = map.createStaticLayer('Ground', tileset);
        var wallslayer = map.createStaticLayer('Walls', tileset);
        var foliagem = map.createStaticLayer('Flora', tileset2);

        wallslayer.setCollisionByExclusion([-1]);
        foliagem.setCollisionByExclusion([-1]);

        this.player = this.physics.add.sprite(50, 100, 'player', 0);
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [10,11,12,13,14,15,16,17] }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [10,11,12,13,14,15,16,17] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [20,21,22,23,24,25,26,27]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [40,41,42,43,44,45,46,47] }),
            frameRate: 10,
            repeat: -1
        });        
        
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        this.physics.add.collider(this.player, wallslayer);
        this.physics.add.collider(this.player, foliagem);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; 
    
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // defenir localização dos inimigos
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
            for(var i = 0; i < 5; i++) {
            var x = Phaser.Math.RND.between(70, 200/*this.physics.world.bounds.width**/);
            var y = Phaser.Math.RND.between(100, 275/*this.physics.world.bounds.height**/);

            this.spawns.create(x, y, 20, 20,); 

        }  

        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
        this.sys.events.on('wake', this.wake, this);
    },
    wake: function() {
        this.cursors.left.reset();
        this.cursors.right.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    },
    onMeetEnemy: function(player, zone) {    

        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        
        // animação de ao encontrar um inimigos
        this.cameras.main.flash(0.5);
        
        this.input.stopPropagation();
        //iniciar ecra de batalha
        this.scene.switch('BattleScene');                
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

