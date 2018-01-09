//Sets up game
var Bingo = Bingo || {};

Bingo.GameState = {
  init: function() 
  {  
      //Background and audio pulled from global variables
      this.background = this.add.sprite(0, 0, Bingo.Images[2]);
      this.backgroundAudio = this.add.audio(Bingo.Audio);
      this.backgroundAudio.play('', 0, 1, true);
      //Details pulled from global variables
      this.detail1=this.add.sprite(530, 400, Bingo.Images[0]);
      this.detail1.scale.setTo(2, 2);
      this.detail2=this.add.sprite(400, 100, Bingo.Images[1]);
      this.detail2.scale.setTo(2, 2);
      //The current ball (number) being called
      this.currBall=null; 
      //Boolean for if emitter for bingo is possible is active
      this.emitting = false;
      //Keeps track if a win could be possible
      this.winable = false;
      //Stores the data for the numbers on the board
      this.boardData = [[], [], [], [], []];
      //Holds all the dabs on the board
      this.dabs = this.add.group();
      //Last dab done by player
      this.lastDab = null;
      //Group to hold the popper balls that rotate with the popper
      this.popperBalls = this.add.group();
      //Group to hold the popper balls that sit at the bottom of the popper
      this.popperBallsStationary = this.add.group();  
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
      //Create the balls to be called
      this.setBall();
      //Pull the first set of bingo balls
      this.getBall();
  },
  create: function()
  {   
      //Create the board (bingo card)
      this.board = this.add.sprite(75, 300, Bingo.Board);
      //Add numbers to the card
      this.populateBoard();
      //Create the popper
      this.popper = this.add.sprite(100, 100, 'popper');
      this.popper.scale.setTo(0.7, 0.7);
      this.popper.anchor.setTo(0.5, 0.5);
      //Add the popper stand
      this.popperStand = this.add.sprite(28, 170, 'stand');
      this.popperStand.scale.setTo(0.7, 0.7);
      //Create the new stationary popper balls
      this.newStationary();
      //Create the first popper ball that rotates with the popper
      this.createPoppers();
      //Timer until the next ball set is called
      this.timer = this.time.events.loop(Phaser.Timer.SECOND * 5, this.getBall, this);
      //Timer until next popper ball is created
      this.timerPopper = this.time.events.loop(Phaser.Timer.SECOND / 6, this.createPoppers, this);
      //Undoes the last dab
      this.undoButton = this.add.button(550, 0, 'undo', function()
      {
          if(this.lastDab != null)
          {
              this.boardData[this.lastDab.i][this.lastDab.j].marked = false;
              this.dabs.remove(this.lastDab);
              this.lastDab = null;
          }
      }, this);
      //Checks for missing and incorrect dabs on the card
      this.checkButton = this.add.button(550, 80, 'check', function()
      {
          this.checkMarks();
      }, this);
      //Checks if the game has been won, if it has it goes to the end state
      this.bingoButton = this.add.button(550, 160, 'bingo', function()
      {
          if(this.emitting || this.checkWin())
          {
              this.backgroundAudio.stop();
              this.emitter.destroy();
              Bingo.game.state.start('End');
          }
      }, this);
  },
  update: function()
  {
      //Rotate the popper
      this.popper.rotation += 0.05;
      //Rotate the stationary popper balls
      this.popperBallsStationary.forEach(function(ball)
      {
          ball.rotation += 0.05;
      }, this);
      //Once the popper balls reach the top of the popper they will drop to the bottom and die otherwise they rotate with the popper
      this.popperBalls.forEach(function(tempBall)
      {
          if(Math.floor(tempBall.rotation) >= tempBall.rotStop)
          {
              tweenA = Bingo.GameState.add.tween(tempBall).to( { x: tempBall.xVal, y: (235) }, 1000, "Quart.easeOut");
              tweenA.start();
              tweenA.onComplete.add(function()
              {
                  tempBall.destroy();
              }, this);
          }
          else
          {
              tempBall.rotation +=0.05;
          }
      });
      //Bring the stationary popper balls to the top
      this.world.bringToTop(this.popperBallsStationary);
      //If the game has not been winable up to now check if it currently could be won -> one of each column has been called
      if(!this.winable)
      {
          var winable = true;
      
          for(var i=0; i<this.colFill.length; i++)
          {
              if(this.colFill[i]<1)
              {
                  winable = false;
              }
          }
          this.winable = winable;
      }
  },
  createPoppers: function()
  {
      //Randomly assign ball image x values to drop at and rotation stop position
      var index = Math.floor(Math.random() * 180);
      if(index!=0 && index % 2 == 0)
      {
          this.tempBall = this.add.sprite(100, 100, String(index/2));
          this.tempBall.xVal = Math.floor(Math.random() * 40) + 80;
          this.tempBall.rotStop = Math.random() +1;
      }
      else if(index % 5 == 0)
      {
          this.tempBall = this.add.sprite(100, 100, 'B');
          this.tempBall.xVal = Math.floor(Math.random() * 40) + 80;
          this.tempBall.rotStop = Math.random() +1;
      }
      else if(index % 5 == 1)
      {
          this.tempBall = this.add.sprite(100, 100, 'I');
          this.tempBall.xVal = Math.floor(Math.random() * 40) + 80;
          this.tempBall.rotStop = Math.random() +1;
      }
      else if(index % 5 == 2)
      {
          this.tempBall = this.add.sprite(100, 100, 'N');
          this.tempBall.xVal = Math.floor(Math.random() * 40) + 80;
          this.tempBall.rotStop = Math.random() +1;
      }
      else if(index % 5 == 3)
      {
          this.tempBall = this.add.sprite(100, 100, 'G');
          this.tempBall.xVal = Math.floor(Math.random() * 40) + 80;
          this.tempBall.rotStop = Math.random() +1;
      }
      else
      {
          this.tempBall = this.add.sprite(100, 100, 'O');
          this.tempBall.xVal = Math.floor(Math.random() * 40) + 80;
          this.tempBall.rotStop = Math.random() +1;
      }
      
      this.tempBall.scale.setTo(0.3, 0.3);
      this.tempBall.pivot.x = 280;
      this.popperBalls.add(this.tempBall);
      
      this.world.bringToTop(this.popperBalls);
  },
  setBall: function()
  {
      //Creates a ball for each number
      //Each number keeps track of if it has been called, is part of the board, and has been marked or dabbed by the player and the corresponding letter
      for(var i=0; i< this.call.length; i ++)
      {
          for(var j=0; j<this.call[i].length; j++)
          {
                var ball = this.add.sprite(300, 0, this.call[i][j]);
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
      //Update the last three called
      this.last3Update(this.currBall, this.ball1);
      //If all balls have been called a bingo must have been achieved so end the game
      if(this.colFill[0] == 18 && this.colFill[1] == 18 && this.colFill[2] == 18 && this.colFill[3] == 18)
      {
          this.backgroundAudio.stop();
          Bingo.game.state.start('End');
      }
      //Check if entire column has been called
      var col = Math.floor(Math.random()*5);
      
      while(this.colFill[col]==18)
      {
          col = Math.floor(Math.random()*5);
      }
      //Set the column's letter as the letter called
      if(col == 0)
      {
          this.ball1 = this.add.sprite(200, 0, "B");
      }
      else if(col == 1)
      {
          this.ball1 = this.add.sprite(200, 0, "I");
      }
      else if(col == 2)
      {
          this.ball1 = this.add.sprite(200, 0, "N");
      }
      else if(col == 3)
      {
          this.ball1 = this.add.sprite(200, 0, "G");
      }
      else
      {
          this.ball1 = this.add.sprite(200, 0, "O");
      }
      //Randomly select a ball in the column
      this.currBall = this.call[col][Math.floor(Math.random()*18)];
      //Check if the ball has already been called
      while(this.currBall.called)
      {
          this.currBall = this.call[col][Math.floor(Math.random()*18)];
      }
      //Make the ball visible
      this.currBall.alpha = 1;
      this.currBall.called = true;
      //Add to the number of balls called in the column
      this.colFill[col] = this.colFill[col]+1;
      //If the game can be won (even if the player has not marked everything off) start a themed emitter on the bingo button
      if(this.winable && this.computeHasWon())
      {
          this.emitter = this.add.emitter(600, 200, 100);
          this.emitter.makeParticles(Bingo.Images[3], [0, 1, 2, 3, 4], 20, true, true);
          this.emitter.minParticleScale = 0.2;
          this.emitter.maxParticleScale = 0.2;
          this.emitter.start(false, 1000, 5);
          this.emitting = true;
          this.world.bringToTop(this.bingoButton);
      }
      //Reset winable so it can be checked in update now that a new ball has been called
      this.winable = true;
  },
  populateBoard: function()
  {
      //Goes through each column to add the digit for one of the potential numbers sets that option to on the board and adds dabbing functionality to the text
      for(var i = 0; i<5; i++)
      {
          for(var j=0; j<5; j++)
          {
              var tempRand = Math.floor(Math.random()*18);
              var currentBall = this.call[i][tempRand];
              while(currentBall.onBoard)
              {
                  tempRand = Math.floor(Math.random()*18);
                  currentBall = this.call[i][tempRand];
              }
              currentBall.onBoard = true;
              
              var style={
                  fill: Bingo.Color,
                  font: '54px Arial',
                  stroke: '#000000',
                  strokeThickness: 7
              };
              this.boardData[i][j]=this.call[i][tempRand];
              this.boardData[i][j].buttonX=147+(88 * i);
              this.boardData[i][j].buttonY=480+(86 * j);
              var text = this.add.text(147+(88 * i), 480+(86 * j), currentBall.num, style);
              text.anchor.setTo(0.5, 0.5);
              text.data=currentBall;
              text.i=i;
              text.j=j;
              text.inputEnabled=true;
              text.events.onInputDown.add(function(button)
              {
                  if(!button.data.marked)
                  {
                      var dab = this.add.sprite(button.position.x - 5, button.position.y - 5, Bingo.dabber);
                      dab.i=button.i;
                      dab.j=button.j;
                      dab.anchor.setTo(0.5, 0.5);
                      this.dabs.add(dab);
                      this.world.bringToTop(this.dabs);
                      this.lastDab = dab;
                      button.data.marked=true;
                  }    
              }, this);
          }
      }
  },
  last3Update: function(numBall, letBall)
  {
      //Removes the third option and moves the others lower while adding the new ball to the top
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
          this.last3[0][0].x=295;
          this.last3[0][0].alpha = 1;
          this.last3[0][1].y=100;
          this.last3[0][1].x=245;
          this.last3[0][1].scale.setTo(0.5, 0.5);
      }
      if(this.last3[1][0]!=null)
      {
          this.last3[1][0].y=150;
          this.last3[1][0].scale.setTo(0.5, 0.5);
          this.last3[1][0].x=295;
          this.last3[1][0].alpha = 1;
          this.last3[1][1].y=150;
          this.last3[1][1].x=245;
          this.last3[1][1].scale.setTo(0.5, 0.5);
      }
      if(this.last3[2][0]!=null)
      {
          this.last3[2][0].y=200;
          this.last3[2][0].scale.setTo(0.5, 0.5);
          this.last3[2][0].x=295;
          this.last3[2][0].alpha = 1;
          this.last3[2][1].y=200;
          this.last3[2][1].x=245;
          this.last3[2][1].scale.setTo(0.5, 0.5);
      }
  },
  checkWin: function()
  {
      //Checks if a winning path has been found and returns true or false
      var arrCheck = this.computeWin();
      var win = false;
      
      for(var i=0; i<arrCheck.length; i++)
      {
          if(arrCheck[i])
          {
              win=true;
              break;
          }
      }
      return win;
  },
  computeWin: function()
  {
      //0->'B', 1->'I', 2->'N', 3->'G', 4->'O',
      //5->TopRow, 6->NextRow, 7->NextRow, 8->NextRow, 9->BottomRow,
      //10->DiagonalLeft, 11->DiagonalRight
      
      //Checks if any possible paths cannot be completed and returns the paths array based on what has been marked and called
      var Paths = [true, true, true, true, true, true, true, true, true, true, true, true]
      for(var i=0; i<Bingo.GameState.boardData.length; i++)
      {
          for(var j=0; j<Bingo.GameState.boardData[i].length; j++)
          {
              if(!Bingo.GameState.boardData[i][j].marked || !Bingo.GameState.boardData[i][j].called)
              {
                  Paths[i] = false;
                  Paths[(j+5)] = false;
                  
                  if(i==j)
                  {
                      Paths[10] = false;
                  }
                  if((i+j)==4)
                  {
                      Paths[11] =false;
                  }
              }
          }
      }
      return Paths;
  },
  computeHasWon: function()
  {
      //0->'B', 1->'I', 2->'N', 3->'G', 4->'O',
      //5->TopRow, 6->NextRow, 7->NextRow, 8->NextRow, 9->BottomRow,
      //10->DiagonalLeft, 11->DiagonalRight
      
      //Checks if any possible paths cannot be completed and returns the paths array based on what has been called only
      var Paths = [true, true, true, true, true, true, true, true, true, true, true, true]
      for(var i=0; i<Bingo.GameState.boardData.length; i++)
      {
          for(var j=0; j<Bingo.GameState.boardData[i].length; j++)
          {
              if(!Bingo.GameState.boardData[i][j].called)
              {
                  Paths[i] = false;
                  Paths[(j+5)] = false;
                  
                  if(i==j)
                  {
                      Paths[10] = false;
                  }
                  if((i+j)==4)
                  {
                      Paths[11] =false;
                  }
              }
          }
      }
      //Goes through the paths to return true or false for a winning option's existence
      for(var i=0; i<Paths.length; i++)
      {
          if(Paths[i])
          {
              return true;
          }
      }
      return false;
  },
  checkMarks: function()
  {
      //Checks that everything that is on the board and has been called has been marked, if not it marks them
      //Also checks that everything marked has been called, if not the mark is removed
      for(var i=0; i<Bingo.GameState.boardData.length; i++)
      {
          for(var j=0; j<Bingo.GameState.boardData[i].length; j++)
          {
              if(Bingo.GameState.boardData[i][j].called && !Bingo.GameState.boardData[i][j].marked)
              {
                  var dab = Bingo.GameState.add.sprite(Bingo.GameState.boardData[i][j].buttonX-5, Bingo.GameState.boardData[i][j].buttonY-5, Bingo.dabber);
                      dab.i=i;
                      dab.j=j;
                      dab.anchor.setTo(0.5, 0.5);
                      Bingo.GameState.dabs.add(dab);
                      Bingo.GameState.world.bringToTop(Bingo.GameState.dabs);
                      
                      Bingo.GameState.boardData[i][j].marked=true;
              }
              else if(!Bingo.GameState.boardData[i][j].called && Bingo.GameState.boardData[i][j].marked)
              {
                  Bingo.GameState.boardData[i][j].marked = false;
                  
                  Bingo.GameState.dabs.forEach(function(dab)
                  {
                      if(dab.i==i && dab.j==j)
                      {
                          Bingo.GameState.dabs.remove(dab);
                      }
                  }, this);
              }
          }
      }
  },
  newStationary: function()
  {
      //Clears all current stationary balls and creates new ones as well as a new rotating ball
      this.popperBallsStationary.removeAll();
      for(var i=0; i<45; i++)
      {
          var index = Math.floor(Math.random() * 45);
          
          var y=Math.floor(Math.random() *45)+110;
          var x = Math.floor(Math.random() *110)+50;
          var tex = "1";
          
          if(x > 65 && x < 95)
          {
              y=y+10;
          }
          if(index != 0 && index*2 <= 90)
          {
              tex=String(index*2);
          }
          var tempBall = this.add.sprite(x, y, tex);
          tempBall.scale.setTo(0.3, 0.3);
          tempBall.anchor.setTo(0.5, 0.5);
          
          this.popperBallsStationary.add(tempBall);
          this.world.bringToTop(this.popperBallsStationary);
          this.createPoppers();
      }
  }
};