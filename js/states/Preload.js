var Bingo = Bingo || {};

//loading the game assets
Bingo.PreloadState = {
  preload: function() {
    //show loading screen
    /*this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(this.preloadBar);*/

    //audio
    this.load.audio('future', ['assets/audio/future.m4a', 'assets/audio/future.mp3', 'assets/audio/future.ogg']);
    this.load.audio('oldHollywood', ['assets/audio/oldHollywood.m4a', 'assets/audio/oldHollywood.mp3', 'assets/audio/oldHollywood.ogg']);
    this.load.audio('jazz', ['assets/audio/jazz.m4a', 'assets/audio/jazz.mp3', 'assets/audio/jazz.ogg']);
    this.load.audio('70s', ['assets/audio/70s.m4a', 'assets/audio/70s.mp3', 'assets/audio/70s.ogg']);
    this.load.audio('60s', ['assets/audio/60s.m4a', 'assets/audio/60s.mp3', 'assets/audio/60s.ogg']);
    this.load.audio('90s', ['assets/audio/90s.m4a', 'assets/audio/90s.mp3', 'assets/audio/90s.ogg']);
    this.load.audio('vaudeville', ['assets/audio/vaudeville.m4a', 'assets/audio/vaudeville.mp3', 'assets/audio/vaudeville.ogg']);
    this.load.audio('50s', ['assets/audio/50s.m4a', 'assets/audio/50s.mp3', 'assets/audio/50s.ogg']);
    this.load.audio('opening', ['assets/audio/opening.m4a', 'assets/audio/opening.mp3', 'assets/audio/opening.ogg']);
    this.load.audio('win', ['assets/audio/win.m4a', 'assets/audio/win.mp3', 'assets/audio/win.ogg']);
    //images
    this.load.image('1', 'assets/images/1.png');
    this.load.image('2', 'assets/images/2.png');
    this.load.image('3', 'assets/images/3.png');
    this.load.image('4', 'assets/images/4.png');
    this.load.image('5', 'assets/images/5.png');
    this.load.image('6', 'assets/images/6.png');
    this.load.image('7', 'assets/images/7.png');
    this.load.image('8', 'assets/images/8.png');
    this.load.image('9', 'assets/images/9.png');
    this.load.image('10', 'assets/images/10.png');
    this.load.image('11', 'assets/images/11.png');
    this.load.image('12', 'assets/images/12.png');
    this.load.image('13', 'assets/images/13.png');
    this.load.image('14', 'assets/images/14.png');
    this.load.image('15', 'assets/images/15.png');
    this.load.image('16', 'assets/images/16.png');
    this.load.image('17', 'assets/images/17.png');
    this.load.image('18', 'assets/images/18.png');
    this.load.image('19', 'assets/images/19.png');
    this.load.image('20', 'assets/images/20.png');
    this.load.image('21', 'assets/images/21.png');
    this.load.image('22', 'assets/images/22.png');
    this.load.image('23', 'assets/images/23.png');
    this.load.image('24', 'assets/images/24.png');
    this.load.image('25', 'assets/images/25.png');
    this.load.image('26', 'assets/images/26.png');
    this.load.image('27', 'assets/images/27.png');
    this.load.image('28', 'assets/images/28.png');
    this.load.image('29', 'assets/images/29.png');
    this.load.image('30', 'assets/images/30.png');
    this.load.image('31', 'assets/images/31.png');
    this.load.image('32', 'assets/images/32.png');
    this.load.image('33', 'assets/images/33.png');
    this.load.image('34', 'assets/images/34.png');
    this.load.image('35', 'assets/images/35.png');
    this.load.image('36', 'assets/images/36.png');
    this.load.image('37', 'assets/images/37.png');
    this.load.image('38', 'assets/images/38.png');
    this.load.image('39', 'assets/images/39.png');
    this.load.image('40', 'assets/images/40.png');
    this.load.image('41', 'assets/images/41.png');
    this.load.image('42', 'assets/images/42.png');
    this.load.image('43', 'assets/images/43.png');
    this.load.image('44', 'assets/images/44.png');
    this.load.image('45', 'assets/images/45.png');
    this.load.image('46', 'assets/images/46.png');
    this.load.image('47', 'assets/images/47.png');
    this.load.image('48', 'assets/images/48.png');
    this.load.image('49', 'assets/images/49.png');
    this.load.image('50', 'assets/images/50.png');
    this.load.image('51', 'assets/images/51.png');
    this.load.image('52', 'assets/images/52.png');
    this.load.image('53', 'assets/images/53.png');
    this.load.image('54', 'assets/images/54.png');
    this.load.image('55', 'assets/images/55.png');
    this.load.image('56', 'assets/images/56.png');
    this.load.image('57', 'assets/images/57.png');
    this.load.image('58', 'assets/images/58.png');
    this.load.image('59', 'assets/images/59.png');
    this.load.image('60', 'assets/images/60.png');
    this.load.image('61', 'assets/images/61.png');
    this.load.image('62', 'assets/images/62.png');
    this.load.image('63', 'assets/images/63.png');
    this.load.image('64', 'assets/images/64.png');
    this.load.image('65', 'assets/images/65.png');
    this.load.image('66', 'assets/images/66.png');
    this.load.image('67', 'assets/images/67.png');
    this.load.image('68', 'assets/images/68.png');
    this.load.image('69', 'assets/images/69.png');
    this.load.image('70', 'assets/images/70.png');
    this.load.image('71', 'assets/images/71.png');
    this.load.image('72', 'assets/images/72.png');
    this.load.image('73', 'assets/images/73.png');
    this.load.image('74', 'assets/images/74.png');
    this.load.image('75', 'assets/images/75.png');
    this.load.image('76', 'assets/images/76.png');
    this.load.image('77', 'assets/images/77.png');
    this.load.image('78', 'assets/images/78.png');
    this.load.image('79', 'assets/images/79.png');
    this.load.image('80', 'assets/images/80.png');
    this.load.image('81', 'assets/images/81.png');
    this.load.image('82', 'assets/images/82.png');
    this.load.image('83', 'assets/images/83.png');
    this.load.image('84', 'assets/images/84.png');
    this.load.image('85', 'assets/images/85.png');
    this.load.image('86', 'assets/images/86.png');
    this.load.image('87', 'assets/images/87.png');
    this.load.image('88', 'assets/images/88.png');
    this.load.image('89', 'assets/images/89.png');
    this.load.image('90', 'assets/images/90.png');
      
    this.load.image('B', 'assets/images/B.png');
    this.load.image('I', 'assets/images/I.png');
    this.load.image('N', 'assets/images/N.png');
    this.load.image('G', 'assets/images/G.png');
    this.load.image('O', 'assets/images/O.png');
      
    this.load.image('BCBlue', 'assets/images/BingoCardBlue.png');
    this.load.image('BCBrown', 'assets/images/BingoCardBrown.png');
    this.load.image('BCGreen', 'assets/images/BingoCardGreen.png');
    this.load.image('BCLime', 'assets/images/BingoCardLime.png');
    this.load.image('BCOrange', 'assets/images/BingoCardOrange.png');
    this.load.image('BCPink', 'assets/images/BingoCardPink.png');
    this.load.image('BCPurple', 'assets/images/BingoCardPurple.png');
    this.load.image('BCRed', 'assets/images/BingoCardRed.png');
      
    this.load.image('dab', 'assets/images/dab_red.png');
      
    this.load.image('play', 'assets/images/play.png');
    this.load.image('undo', 'assets/images/undo.png');
    this.load.image('check', 'assets/images/check.png');
    this.load.image('bingo', 'assets/images/bingo.png');
    this.load.image('popper', 'assets/images/BallPopperTop.png');
    this.load.image('stand', 'assets/images/BallPopperStand.png');
      
    this.load.image('main', 'assets/images/main.png');
    this.load.image('secondary', 'assets/images/secondary.png');
    this.load.image('last', 'assets/images/last.png');
    this.load.image('playAgain', 'assets/images/playAgain.png');
    this.load.image('hand', 'assets/images/hand.png');
    this.load.image('car1', 'assets/images/car1.png');
    this.load.image('car2', 'assets/images/car2.png');
    this.load.image('car3', 'assets/images/car3.png');
    this.load.image('car4', 'assets/images/car4.png');
    this.load.image('car5', 'assets/images/car5.png');
      
    //Future
    this.load.image('futureBackground', 'assets/images/futureBackground.jpg');
    this.load.image('future1', 'assets/images/future1.png');
    this.load.image('future2', 'assets/images/future2.png');
    //HollyWood
    this.load.image('hollywoodBackground', 'assets/images/hollywoodBackground.png');
    this.load.image('hollywood1', 'assets/images/hollywood1.png');
    this.load.image('hollywood2', 'assets/images/hollywood2.png');
    //Jazz
    this.load.image('jazzBackground', 'assets/images/jazzBackground.png');
    this.load.image('jazz1', 'assets/images/jazz1.png');
    this.load.image('jazz2', 'assets/images/jazz2.png');
    //70s
    this.load.image('70sBackground', 'assets/images/70sBackground.png');
    this.load.image('70s1', 'assets/images/70s1.png');
    this.load.image('70s2', 'assets/images/70s2.png');
    //60s
    this.load.image('60sBackground', 'assets/images/60sBackground.png');
    this.load.image('60s1', 'assets/images/60s1.png');
    this.load.image('60s2', 'assets/images/60s2.png');
    //90s
    this.load.image('90sBackground', 'assets/images/90sBackground.png');
    this.load.image('90s1', 'assets/images/90s1.png');
    this.load.image('90s2', 'assets/images/90s2.png');
    //60s
    this.load.image('vaudevilleBackground', 'assets/images/vaudevilleBackground.png');
    this.load.image('vaudeville1', 'assets/images/vaudeville1.png');
    this.load.image('vaudeville2', 'assets/images/vaudeville2.png');
    //50s
    this.load.image('50sBackground', 'assets/images/50sBackground.png');
    this.load.image('50s1', 'assets/images/50s1.png');
    this.load.image('50s2', 'assets/images/50s2.png');
    //Data
    
    //this.load.text('BingoData', 'assets/data/BingoData.json');

  },
  create: function() {
    this.state.start('Story');
  }
};