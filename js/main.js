var Bingo = Bingo || {};
Bingo.game = new Phaser.Game(640, 960, Phaser.AUTO);

Bingo.game.state.add('Boot', Bingo.BootState); 
Bingo.game.state.add('Preload', Bingo.PreloadState); 
Bingo.game.state.add('Story', Bingo.StoryState);
Bingo.game.state.add('Game', Bingo.GameState);
Bingo.game.state.add('End', Bingo.EndState);

Bingo.game.state.start('Boot');