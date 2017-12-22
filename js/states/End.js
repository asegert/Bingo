var Bingo = Bingo || {};

Bingo.EndState = {
    create: function()
    {
        this.background = this.add.sprite(0, 0, 'last');
        this.backgroundAudio = this.add.audio('win');
        this.backgroundAudio.play('', 0, 1, true);
        
        this.playAgain = this.add.button(0, 700, 'playAgain', function()
        {
            Bingo.Again = true;
            this.backgroundAudio.stop();
            Bingo.game.state.start('Story');
        }, this);
    }
}