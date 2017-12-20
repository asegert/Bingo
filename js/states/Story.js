var Bingo = Bingo || {};

//loading the game assets
Bingo.StoryState = {
  create: function() 
  {
      this.add.text(150, 200, "Choose your Bingo Card");
      this.createTickets(['BCBlue', 'BCBrown', 'BCGreen', 'BCLime', 'BCOrange', 'BCPink', 'BCPurple', 'BCRed'], ['#C2996B', '#67B1CC', '#5CB946', '#0B6839', '#BE202F', '#93298E', '#EC2D7B', '#FCAB35']);
  },
  createTickets: function(array, color)
  {
      for(var i=0; i< array.length; i++)
      {
          var y = 500;
          var x=4;
          if(i<4)
          {
              y=300;
              x=0;
          }
          var button = this.add.button(((i-x)*150)+30, y, array[i]);
          button.scale.setTo(0.2, 0.2);
          button.color=color[i];
          button.inputEnabled = true;
          button.events.onInputDown.add(function(button)
          {
              //Have time specific objects come out
              Bingo.Board = button.key;
              Bingo.Color = button.color;
              this.state.start('Game');
          }, this);
          button.events.onInputOver.add(function(button)
          {
              this.emitter = this.add.emitter(button.position.x, button.position.y, 200);

              this.emitter.makeParticles(['B', 'I', 'N', 'G', 'O']);
              this.emitter.minParticleScale = 0.25;
              this.emitter.maxParticleScale = 0.25;
              this.emitter.start(false, 1000, 20);
          }, this);
          button.events.onInputOut.add(function(button)
          {
              this.emitter.on = false;
          }, this);
      }
  }
};