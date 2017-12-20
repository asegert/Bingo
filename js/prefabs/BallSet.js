var Bingo = Bingo || {};

Bingo.BallSet = function(state, x, y, data) 
{
  Phaser.Sprite.call(this, state.game, x, y, data.asset);

  this.state = state;
  this.game = state.game;
  this.anchor.setTo(0.5);
  
};

Bingo.BallSet.prototype = Object.create(Phaser.Sprite.prototype);
Bingo.BallSet.prototype.constructor = Bingo.BallSet;