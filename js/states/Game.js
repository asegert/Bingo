//Sets up game
var Bingo = Bingo || {};

Bingo.GameState = {
  init: function() 
  {  
      this.currBall=null;  
      this.dabs = this.add.group();
      //What has been called
      this.call= [
                    [1, 10, 12, 20, 21, 28, 33, 39, 42, 43, 50, 60, 67, 74, 77, 78, 84, 90],  //B
                    [4, 9, 11, 17, 22, 23, 24, 30, 36, 40, 47, 54, 66, 69, 75, 79, 83, 88],   //I
                    [2, 7, 13, 16, 25, 29, 35, 38, 44, 48, 56, 59, 68, 70, 71, 72, 86, 62],   //N
                    [3, 8, 14, 19, 26, 27, 34, 46, 49, 55, 58, 61, 64, 65, 73, 80, 81, 87],   //G
                    [5, 6, 15, 18, 31, 32, 37, 41, 45, 51, 52, 53, 57, 63, 76, 82, 85, 89]    //0
                 ];
      this.colFill=[0, 0, 0, 0, 0] //BINGO
      //Displays the last three calls
      this.last3 = [[null, null], [null, null], [null, null]];
      this.setBall();
      console.log(this.call);
      this.getBall();
  },
  create: function()
  {   
      this.board = this.add.sprite(75, 300, Bingo.Board);
      this.populateBoard();
      
      this.timer = this.time.events.loop(Phaser.Timer.SECOND * 5, this.getBall, this);
  },
  update: function()
  {
      
  },
  setBall: function()
  {
      for(var i=0; i< this.call.length; i ++)
      {
          for(var j=0; j<this.call[i].length; j++)
          {
                var ball = this.add.sprite(100, 0, this.call[i][j]);
                ball.alpha = 0;
                ball.num = this.call[i][j];
                ball.marked = false;
                ball.onBoard = false;
                ball.called = false;
                
                if(i==0)
                {
                    ball.letter = "B";
                }
                else if(i==1)
                {
                    ball.letter = "I";
                }
                else if(i==2)
                {
                    ball.letter = "N";
                }
                else if(i==3)
                {
                    ball.letter = "G";
                }
                else
                {
                    ball.letter = "O";
                }
              
                this.call[i][j] = ball;
          }
      }
  },
  getBall: function()
  {
      this.last3Update(this.currBall, this.ball1);
      
      if(this.colFill[0] == 18 && this.colFill[1] == 18 && this.colFill[2] == 18 && this.colFill[3] == 18)
      {
          this.time.events.stop();
          console.log('endGame');
      }

      //Add check if entire column has been called
      var col = Math.floor(Math.random()*5);
      
      while(this.colFill[col]==18)
      {
          col = Math.floor(Math.random()*5);
      }
      
      if(col == 0)
      {
          this.ball1 = this.add.sprite(0, 0, "B");
      }
      else if(col == 1)
      {
          this.ball1 = this.add.sprite(0, 0, "I");
      }
      else if(col == 2)
      {
          this.ball1 = this.add.sprite(0, 0, "N");
      }
      else if(col == 3)
      {
          this.ball1 = this.add.sprite(0, 0, "G");
      }
      else
      {
          this.ball1 = this.add.sprite(0, 0, "O");
      }
      
      this.currBall = this.call[col][Math.floor(Math.random()*18)];
      
      while(this.currBall.called)
      {
          this.currBall = this.call[col][Math.floor(Math.random()*18)];
      }
      this.currBall.alpha = 1;
      this.currBall.called = true;
      
      //console.log(col);
      this.colFill[col] = this.colFill[col]+1;
      //console.log(this.colFill);
  },
  populateBoard: function()
  {
      for(var i = 0; i<5; i++)
      {
          for(var j=0; j<5; j++)
          {
              var currentBall = this.call[i][Math.floor(Math.random()*18)];
              while(currentBall.onBoard)
              {
                  currentBall = this.call[i][Math.floor(Math.random()*18)];
              }
              currentBall.onBoard = true;
              
              var style={
                  fill: Bingo.Color,
                  font: '54px Arial',
                  stroke: '#000000',
                  strokeThickness: 7
              };
              var text = this.add.text(147+(88 * i), 480+(86 * j), currentBall.num, style);
              text.anchor.setTo(0.5, 0.5);
              text.inputEnabled=true;
              text.events.onInputDown.add(function(button)
              {
                  if(!button.marked)
                  {
                      console.log(this);
                      var dab = this.add.sprite(button.x, button.y, 'dab');
                      dab.anchor.setTo(0.5, 0.5);
                      this.dabs.add(dab);
                      this.world.bringToTop(this.dabs);
                      
                      button.marked=true;
                  }    
              }, this);
          }
      }
  },
  last3Update: function(numBall, letBall)
  {
      var temp = [[numBall, letBall]];  
      temp[1]=this.last3[0];
      temp[2]=this.last3[1];
      if(this.last3[2][0]!=null)
      {
          this.last3[2][0].alpha=0;
      }
      this.last3 = temp;
      //make small and move
      if(this.last3[0][0]!=null)
      {
          this.last3[0][0].y=100;
          this.last3[0][0].scale.setTo(0.5, 0.5);
          this.last3[0][0].x=50;
          this.last3[0][0].alpha = 1;
          this.last3[0][1].y=100;
          this.last3[0][1].scale.setTo(0.5, 0.5);
      }
      if(this.last3[1][0]!=null)
      {
          this.last3[1][0].y=150;
          this.last3[1][0].scale.setTo(0.5, 0.5);
          this.last3[1][0].x=50;
          this.last3[1][0].alpha = 1;
          this.last3[1][1].y=150;
          this.last3[1][1].scale.setTo(0.5, 0.5);
      }
      if(this.last3[2][0]!=null)
      {
          this.last3[2][0].y=200;
          this.last3[2][0].scale.setTo(0.5, 0.5);
          this.last3[2][0].x=50;
          this.last3[2][0].alpha = 1;
          this.last3[2][1].y=200;
          this.last3[2][1].scale.setTo(0.5, 0.5);
      }
  },
  checkForWin: function()
  {
      //pseudo code
      //Have array for board
      //Path1=all in line b
      //Path2=all in line I
      //Path3=all in line n
      //Path4=all in line g
      //Path5=all in line 0
      //Path6=across 0
      //Path7=across 1
      //Path8=across 2
      //Path9=across 3
      //Path10=across 4
      //Path11=diagonal left
      //Path12=diagonal right
      
      //check 11+12 first use if marked && called
      //If it fails set the path down and across to failed as well
      
      //Check across
      //If it fails set the path down to failed as well
      
      //Check down
      
      //if anypath is true return win
  }
};