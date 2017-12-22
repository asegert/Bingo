//Sets up game
var Bingo = Bingo || {};

Bingo.GameState = {
  init: function() 
  {  
      this.background = this.add.sprite(0, 0, Bingo.Images[2]);
      this.backgroundAudio = this.add.audio(Bingo.Audio);
      this.backgroundAudio.play('', 0, 1, true);
      this.detail1=this.add.sprite(530, 400, Bingo.Images[0]);
      this.detail1.scale.setTo(2, 2);
      this.detail2=this.add.sprite(400, 100, Bingo.Images[1]);
      this.detail2.scale.setTo(2, 2);
      this.currBall=null; 
      this.boardData = [[], [], [], [], []];
      this.dabs = this.add.group();
      this.lastDab = null;
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
      this.getBall();
  },
  create: function()
  {   
      this.board = this.add.sprite(75, 300, Bingo.Board);
      this.populateBoard();
      this.popper = this.add.sprite(100, 100, 'popper');
      this.popper.scale.setTo(0.7, 0.7);
      this.popper.anchor.setTo(0.5, 0.5);
      this.popperStand = this.add.sprite(28, 170, 'stand');
      this.popperStand.scale.setTo(0.7, 0.7);
      this.timer = this.time.events.loop(Phaser.Timer.SECOND * 5, this.getBall, this);
      this.undoButton = this.add.button(550, 0, 'undo', function()
      {
          if(this.lastDab != null)
          {
              this.boardData[this.lastDab.i][this.lastDab.j].marked = false;
              this.dabs.remove(this.lastDab);
              this.lastDab = null;
          }
      }, this);
      this.checkButton = this.add.button(550, 80, 'check', function()
      {
          this.checkMarks();
      }, this);
      this.bingoButton = this.add.button(550, 160, 'bingo', function()
      {
          if(this.checkWin())
          {
              this.backgroundAudio.stop();
              Bingo.game.state.start('End');
          }
      }, this);
  },
  update: function()
  {
      this.popper.rotation += 0.05;
  },
  setBall: function()
  {
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
      
      this.currBall = this.call[col][Math.floor(Math.random()*18)];
      
      while(this.currBall.called)
      {
          this.currBall = this.call[col][Math.floor(Math.random()*18)];
      }
      this.currBall.alpha = 1;
      this.currBall.called = true;

      this.colFill[col] = this.colFill[col]+1;
  },
  populateBoard: function()
  {
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
                      var dab = this.add.sprite(button.x, button.y, 'dab');
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
      var arrCheck = this.computeWin();
      var win = false;
      
      for(var i=0; i<arrCheck.length; i++)
      {
          if(arrCheck)
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
      var Paths = [true, true, true, true, true, true, true, true, true, true, true, true]
      console.log(Bingo.GameState.boardData);
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
              else
              {
                  console.log("i: "+i+" j: "+j);
              }
          }
      }
      console.log(Paths);
      return Paths;
  },
  checkMarks: function()
  {
      for(var i=0; i<Bingo.GameState.boardData.length; i++)
      {
          for(var j=0; j<Bingo.GameState.boardData[i].length; j++)
          {
              if(Bingo.GameState.boardData[i][j].called && !Bingo.GameState.boardData[i][j].marked)
              {
                 console.log(Bingo.GameState.boardData[i][j]);
                  var dab = Bingo.GameState.add.sprite(Bingo.GameState.boardData[i][j].buttonX, Bingo.GameState.boardData[i][j].buttonY, 'dab');
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
  }
};