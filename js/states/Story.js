var Bingo = Bingo || {};

//loading the game assets
Bingo.StoryState = {
  create: function() 
  {
      //holds the card buttons so they can be removed when the screen changes
      this.cardGroup = this.add.group();
      //holds the dabber buttons so they can be removed when the screen changes
      this.markerGroup = this.add.group();
      //If we are playing again skip the main screen and go straight to card selection
      if(Bingo.Again !=undefined)
      {
          //Set up background and audio
          this.background=this.add.sprite(0, 0, 'secondary');
          this.backgroundAudio = this.add.audio('opening');
          this.backgroundAudio.play('', 0, 1, true);
          //Prevents cars being loaded
          this.nextCar = -1;
          //Sets up card picking
          this.text = this.add.text(150, 450, "Choose your Bingo Card", {fill: '#ffffff'});
          this.createTickets(['BCBlue', 'BCBrown', 'BCGreen', 'BCLime', 'BCOrange', 'BCPink', 'BCPurple', 'BCRed'], 
                                ['#C2996B', '#67B1CC', '#5CB946', '#0B6839', '#BE202F', '#93298E', '#EC2D7B', '#FCAB35'],
                                [['future1', 'future2', 'futureBackground', 'futureEmit'], 
                                 ['hollywood1', 'hollywood2', 'hollywoodBackground', 'hollywoodEmit'], 
                                 ['jazz1', 'jazz2', 'jazzBackground', 'jazzEmit'], ['70s1', '70s2', '70sBackground', '70sEmit'], 
                                 ['60s1', '60s2', '60sBackground', '60sEmit'], ['90s1', '90s2', '90sBackground', '90sEmit'], 
                                 ['vaudeville1', 'vaudeville2', 'vaudevilleBackground', 'vaudevilleEmit'], ['50s1', '50s2', '50sBackground', '50sEmit']],
                                 ['future', 'oldHollywood', 'jazz', '70s', '60s', '90s', 'vaudeville', '50s']);
      } 
      else
      {
          //Sets the next car in the sequence
        this.nextCar = 2;
        //Sets the direction of the sequence
        //Forward or backwards through time
        this.carUp = true;
        //Sets up background for main screen and audio
        this.background=this.add.sprite(0, 0, 'main');
        this.backgroundAudio = this.add.audio('opening');
        this.backgroundAudio.play('', 0, 1, true);
        //Creates clock hands
        this.hand1 = this.add.sprite(315, 215, 'hand');
        this.hand1.scale.setTo(1, 1.5);
        this.hand1.pivot.x = 0;
        this.hand1.pivot.y = 0;
        this.hand2 = this.add.sprite(315, 215, 'hand');
        this.hand2.scale.setTo(1, 1.5);
        this.hand2.pivot.x = 0;
        this.hand2.pivot.y = 0;
        this.hand2.rotation = Math.random();
        //Sets the current car in the animation
        this.car = this.add.sprite(350, 270, 'car1');
        this.car.rotation = 0.2;
        //Sets play button for main screen
        this.play = this.add.button(0, 400, 'play', function()
        {
            //Set up for second screen (ticket selection)
            this.background.loadTexture('secondary', 0, false);
            this.car.destroy();
            this.nextCar = -1;
          
            this.text = this.add.text(150, 450, "Choose your Bingo Card", {fill: '#ffffff'});
            this.createTickets(['BCBlue', 'BCBrown', 'BCGreen', 'BCLime', 'BCOrange', 'BCPink', 'BCPurple', 'BCRed'], 
                                ['#C2996B', '#67B1CC', '#5CB946', '#0B6839', '#BE202F', '#93298E', '#EC2D7B', '#FCAB35'],
                                [['future1', 'future2', 'futureBackground', 'futureEmit'], 
                                 ['hollywood1', 'hollywood2', 'hollywoodBackground', 'hollywoodEmit'], 
                                 ['jazz1', 'jazz2', 'jazzBackground', 'jazzEmit'], ['70s1', '70s2', '70sBackground', '70sEmit'], 
                                 ['60s1', '60s2', '60sBackground', '60sEmit'], ['90s1', '90s2', '90sBackground', '90sEmit'], 
                                 ['vaudeville1', 'vaudeville2', 'vaudevilleBackground', 'vaudevilleEmit'], ['50s1', '50s2', '50sBackground', '50sEmit']],
                                 ['future', 'oldHollywood', 'jazz', '70s', '60s', '90s', 'vaudeville', '50s']);
            this.play.kill();
        
        }, this);
      //Timer for car switches
      this.timer = this.time.events.loop(Phaser.Timer.SECOND * 2, this.switch, this);
      }
  },
  update: function()
  {
      //Updates clock hand rotation
        //Clockwise for cars getting newer
        //Counter Clockwise for cars getting older
      if(this.carUp)
      {
          this.hand1.rotation -=0.2;
          this.hand2.rotation -=Math.random();
      }
      else
      {
          this.hand1.rotation +=0.2;
          this.hand2.rotation +=Math.random();
      }
  },
  switch: function()
  {
      //Switches to the next car and resets the fade
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
      //Creates the clickable tickets
      for(var i=0; i< array.length; i++)
      {
          //Resets x values for the second half and updates the y
          var y = 750;
          var x=4;
          if(i<4)
          {
              y=550;
              x=0;
          }
          //Creates the card button with a corresponding color from the color array and the buttons index to be used for info from other arrays when button is selected
          var button = this.add.button(((i-x)*150)+30, y, array[i]);
          button.scale.setTo(0.2, 0.2);
          button.color=color[i];
          button.index=i;
          button.inputEnabled = true;
          button.events.onInputDown.add(function(button)
          {
              //Sets the global variables
              //Card style
              Bingo.Board = button.key;
              //Text Color
              Bingo.Color = button.color;
              //Images for the theme -> background and 2 details
              Bingo.Images = images[button.index];
              //Audio for the 'time'
              Bingo.Audio = audio[button.index];
              //Remove Cards
              this.cardGroup.removeAll();
              //Set Dabber Text
              this.text.setText("Choose your Bingo Dabber");
              //Create Dabbers
              this.createDabbers(['dabber1R', 'dabber1B', 'dabber1G'], ['dabber2R', 'dabber2B', 'dabber2G'], ['dabR', 'dabB', 'dabG']);
              
          }, this);
          button.events.onInputOver.add(function(button)
          {
              //Start the emitter and make the 2 detail images visible
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
              
              //Make sure card stays on top
              this.world.bringToTop(button);
          }, this);
          button.events.onInputOut.add(function(button)
          {
              //Turn off emitter and special features
              this.emitter.on = false;
              this.img.destroy();
              this.img2.destroy();
          }, this);
          this.cardGroup.add(button);
          this.world.bringToTop(this.cardGroup);
      }
  },
  createDabbers: function(dabber1, dabber2, color)
  {
      //Creates the clickable tickets
      for(var i=0; i< 3; i++)
      {
          //Creates the dabber button with a corresponding color from the color array 
          var button = this.add.button(((i)*170)+100, 600, dabber1[i]);
          button.color=color[i];
          button.dabber1=dabber1[i];
          button.dabber2=dabber2[i];
          button.inputEnabled = true;
          button.events.onInputDown.add(function(button)
          {
              //Set the dabber color for the game
              Bingo.dabber = button.color;
              //Stop opening audio
              this.backgroundAudio.stop();
              //Call to move to next screen
              this.migrate();
          }, this);
          button.events.onInputOver.add(function(button)
          {
              //Switch the dabber image to open dabber
              button.loadTexture(button.dabber2);
              //Make sure card stays on top
              this.world.bringToTop(button);
          }, this);
          button.events.onInputOut.add(function(button)
          {
              //Switch back to closed dabber
              button.loadTexture(button.dabber1); 
              //Make sure card stays on top
              this.world.bringToTop(button);
          }, this);
          this.markerGroup.add(button);
          this.world.bringToTop(this.markerGroup);
      }
  },
  migrate: function()
  {
      //Remove the dabbers
      this.markerGroup.removeAll();
      //Stop Audio
      this.backgroundAudio.stop();
      //Start the game
      this.state.start('Game');
  }
};