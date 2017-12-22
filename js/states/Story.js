var Bingo = Bingo || {};

//loading the game assets
Bingo.StoryState = {
  create: function() 
  {
      if(Bingo.Again !=undefined)
      {
          this.background=this.add.sprite(0, 0, 'secondary');
          this.backgroundAudio = this.add.audio('opening');
          this.backgroundAudio.play('', 0, 1, true);
          
          this.nextCar = -1;
          this.add.text(150, 450, "Choose your Bingo Card", {fill: '#ffffff'});
          this.createTickets(['BCBlue', 'BCBrown', 'BCGreen', 'BCLime', 'BCOrange', 'BCPink', 'BCPurple', 'BCRed'], 
                             ['#C2996B', '#67B1CC', '#5CB946', '#0B6839', '#BE202F', '#93298E', '#EC2D7B', '#FCAB35'],
                             [['future1', 'future2', 'futureBackground'], ['hollywood1', 'hollywood2', 'hollywoodBackground'], 
                              ['jazz1', 'jazz2', 'jazzBackground'], ['70s1', '70s2', '70sBackground'], 
                              ['60s1', '60s2', '60sBackground'], ['90s1', '90s2', '90sBackground'], 
                              ['vaudeville1', 'vaudeville2', 'vaudevilleBackground'], ['50s1', '50s2', '50sBackground']],
                             ['future', 'oldHollywood', 'jazz', '70s', '60s', '90s', 'vaudeville', '50s']);
      }
      else
      {
        this.nextCar = 2;
        this.carUp = true;
      
        this.background=this.add.sprite(0, 0, 'main');
        this.backgroundAudio = this.add.audio('opening');
        this.backgroundAudio.play('', 0, 1, true);
      
        this.hand1 = this.add.sprite(315, 215, 'hand');
        this.hand1.scale.setTo(1, 1.5);
        this.hand1.pivot.x = 0;
        this.hand1.pivot.y = 0;
        this.hand2 = this.add.sprite(315, 215, 'hand');
        this.hand2.scale.setTo(1, 1.5);
        this.hand2.pivot.x = 0;
        this.hand2.pivot.y = 0;
        this.hand2.rotation = Math.random();
      
        this.car = this.add.sprite(350, 270, 'car1');
        this.car.rotation = 0.2;
      
        this.play = this.add.button(0, 400, 'play', function()
        {
            this.background.loadTexture('secondary', 0, false);
            this.car.destroy();
            this.nextCar = -1;
          
            this.add.text(150, 450, "Choose your Bingo Card", {fill: '#ffffff'});
            this.createTickets(['BCBlue', 'BCBrown', 'BCGreen', 'BCLime', 'BCOrange', 'BCPink', 'BCPurple', 'BCRed'], 
                                ['#C2996B', '#67B1CC', '#5CB946', '#0B6839', '#BE202F', '#93298E', '#EC2D7B', '#FCAB35'],
                                [['future1', 'future2', 'futureBackground'], ['hollywood1', 'hollywood2', 'hollywoodBackground'], 
                                ['jazz1', 'jazz2', 'jazzBackground'], ['70s1', '70s2', '70sBackground'], 
                                ['60s1', '60s2', '60sBackground'], ['90s1', '90s2', '90sBackground'], 
                                ['vaudeville1', 'vaudeville2', 'vaudevilleBackground'], ['50s1', '50s2', '50sBackground']],
                                ['future', 'oldHollywood', 'jazz', '70s', '60s', '90s', 'vaudeville', '50s']);
            this.play.kill();
        
        }, this);
      
      this.timer = this.time.events.loop(Phaser.Timer.SECOND * 2, this.switch, this);
      }
  },
  update: function()
  {
      if(this.carUp)
      {
          this.hand1.rotation +=0.2;
          this.hand2.rotation +=Math.random();
      }
      else
      {
          this.hand1.rotation -=0.2;
          this.hand2.rotation -=Math.random();
      }
  },
  switch: function()
  {
      if(this.nextCar != -1)
      {
          this.fade = this.add.tween(this.car).to( { alpha: 0 }, 1000, "Linear", true);
          this.fade.onComplete.add(function()
          {
              if(this.nextCar != -1)
              {
                 this.car.loadTexture('car'+this.nextCar, 0, false);
                 this.car.alpha=1;
          
                 if(this.nextCar == 1)
                 {
                     this.nextCar ++;
                     this.carUp = true;
                 }
                 else if(this.nextCar == 5)
                 {
                     this.nextCar --;
                     this.carUp=false;
                 }
                 else if(this.carUp)
                 {
                     this.nextCar ++;
                 }
                 else if(!this.carUp)
                 {
                     this.nextCar --;
                 }
             }
          }, this);
      }
  },
  createTickets: function(array, color, images, audio)
  {
      for(var i=0; i< array.length; i++)
      {
          var y = 750;
          var x=4;
          if(i<4)
          {
              y=550;
              x=0;
          }
          
          var button = this.add.button(((i-x)*150)+30, y, array[i]);
          button.scale.setTo(0.2, 0.2);
          button.color=color[i];
          button.index=i;
          button.inputEnabled = true;
          button.events.onInputDown.add(function(button)
          {
              //Have time specific objects come out
              Bingo.Board = button.key;
              Bingo.Color = button.color;
              Bingo.Images = images[button.index];
              Bingo.Audio = audio[button.index];
              this.backgroundAudio.stop();
              this.state.start('Game');
          }, this);
          button.events.onInputOver.add(function(button)
          {
              this.emitter = this.add.emitter(button.position.x, button.position.y, 200);

              this.emitter.makeParticles(['B', 'I', 'N', 'G', 'O']);
              this.emitter.minParticleScale = 0.25;
              this.emitter.maxParticleScale = 0.25;
              this.emitter.start(false, 1000, 20);
              
              //Create behind images
              this.img = this.add.sprite((button.position.x+90), button.position.y-20, images[button.index][0]);
              this.img.anchor.setTo(0.5, 0.5);
              this.img2 = this.add.sprite((button.position.x-20), button.position.y+110, images[button.index][1]);
              this.img2.anchor.setTo(0.5, 0.5);
              
              this.world.bringToTop(button);
          }, this);
          button.events.onInputOut.add(function(button)
          {
              this.emitter.on = false;
              this.img.destroy();
              this.img2.destroy();
          }, this);
      }
  }
};