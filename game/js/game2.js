var imageHost = '/phaser-games/game/images/game/'; // github 预览地址

var game = new Phaser.Game(640, 1136, Phaser.CANVAS, 'gameContainer');

var defaultTime = 10; // 默认倒计时时间

game.myState = {};
game.myData = {};

game.myState.preload = {
  preload: function() {
    // game.load.image('preload', imageHost + 'preload.gif');
    game.stage.backgroundColor = "#fff"; // 游戏背景色
    // 适配
    if (!game.device.desktop) {
      game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT; // 拉伸适应
    }
  },
  create: function() {
    game.state.start('load');
  }
}

game.myState.load = {
  preload: function() {
    game.load.image('clock', imageHost + 'clock.png');
    game.load.image('gamebg', imageHost + 'game-bg.jpg'); // 游戏背景
    game.load.image('iconfinder', imageHost + 'iconfinder.png');
    game.load.spritesheet('dog', imageHost + 'dog.png', 266, 360, 2); // 加载需要找到的狗
    game.load.image('man1', imageHost + 'man1.png');
    game.load.image('man2', imageHost + 'man2.png');
    game.load.image('man3', imageHost + 'man3.png');
    game.load.image('man4', imageHost + 'man4.png');
    game.load.image('man5', imageHost + 'man5.png');
    game.load.image('man6', imageHost + 'man6.png');
    game.load.image('man7', imageHost + 'man7.png');
    game.load.image('man8', imageHost + 'man8.png');
    game.load.image('man9', imageHost + 'man9.png');
    game.load.image('man10', imageHost + 'man10.png');
    game.load.image('man11', imageHost + 'man11.png');
    game.load.image('man12', imageHost + 'man12.png');
    game.load.image('man13', imageHost + 'man13.png');
    game.load.image('man14', imageHost + 'man14.png');
    game.load.image('man15', imageHost + 'man15.png');
    game.load.image('man16', imageHost + 'man16.png');
    game.load.audio('find', imageHost + 'find.mp3');
    game.load.audio('bgmusic', imageHost + 'bgmusic.mp3');
  },
  create: function() {
    // this.group = game.add.group();

    // 背景音乐
    game.myData.bgMusic = game.add.audio('bgmusic', 2, true);
    // 加载完成之后, 开始播放
    game.sound.setDecodedCallback([game.myData.bgMusic], function() {
      console.log('music complete');
      try {
       game.myData.bgMusic.play(); 
      } catch (e) {
        console.log(e);
      }
    }, this);
  },
}

game.myState.start = {
  create: function() {
    // 加载游戏背景
    var bg = game.add.image(0, 0, 'gamebg');
    bg.width = game.width;
    bg.height = game.height;

    game.myData.total = 0; // 找到狗的次数

    // 增加人物
    var manList = new ManList();
    manList.init();
    manList.updateMan();

    // 找到狗的音乐
    this.findMusic = game.add.audio('find', 5, false);

    // 增加分数
    var style = { font: "50px Arial", fill: "#fb8214", align: "center", fontWeight: '700' };
    var iconfinder = game.add.image(20, 20, 'iconfinder');
    iconfinder.scale.setTo(0.22, 0.22);
    this.scoreText = game.add.text(100, 20, "0", style);
    // this.scoreText.anchor.set(0.5);
    // 增加闹钟
    var clock = game.add.image(game.world.width - 250, 20, 'clock');
    clock.scale.setTo(0.4, 0.4);
    this.clockText = game.add.text(game.world.width - 180, 20, "60", style);
    this.clockTime = defaultTime;
    // 绘制
    this.graphics = game.add.graphics(0, 0);

    // 创建定时器
    this.timer = game.time.create(false);
    // 每2秒updateCounter
    this.timer.loop(1000, this.updateCounter, this);
    this.timer.start();
  },
  update: function() {

  },
  updateCounter: function() {
    if (this.clockTime <= 0) {
      this.timer.stop();

      // 游戏结束
      $("#gameContainer").hide();
      $(".game-over").show();
      $("#gameScore").text(game.myData.total);
    } else {
      this.clockTime--;
      this.clockText.text = this.clockTime;
    }
  },
  
}

// 更新人物数据
function ManList() {
  this.init = function() {
    this.manList = game.add.group();
  },
  this.updateMan = function() {
    var row = 6 + game.myData.total;
    var col = 6 + game.myData.total;
    var height = Math.ceil(game.world.height / row);
    var width = Math.ceil(game.world.width / col);
    var scale = width / game.cache.getImage('man1').width + 0.1;
  
    // 将狗加进去
    var dogRow = game.rnd.integerInRange(1, (row - 1));
    var dogCol = game.rnd.integerInRange(0, (col - 1));
  
    for (var i = 1; i < row; i++) {
      for (var j = 0; j < col; j++) {
        var index = game.rnd.integerInRange(1, 16);
        var random = Math.random()*(Math.random()>0.5?1:-1);
        var x = j * width + random * 20;
        var y = i * height + random * 40;
        x = x < 0 ? 0 : x;
        y = y < 80 ? 80 : y;
  
        // 更新狗的位置
        if (i == dogRow && j == dogCol) {
          var dogWidth = game.cache.getImage('dog').width * scale;
          var dogHeight = game.cache.getImage('dog').height * scale;
          y = y + 10 > (game.world.height - dogHeight) ? (game.world.height - dogHeight) : y + 10;
          x = x > (game.world.width - dogWidth) ? game.world.width - dogWidth : x;
          this.dog = this.manList.create(x, y, 'dog');
          // 设置缩放
          this.dog.scale.setTo(scale, scale);
          console.log('dog: ', x, ' ', y);
          // this.dog.bringToTop();
          // game.physics.arcade.enable(this.dog);
          // dog.checkWorldBounds = true;
          this.dog.inputEnabled = true;
          this.dog.events.onInputDown.add(this.findDog, this);
          this.dog.animations.add('find', [0, 1], 10, true);
        } else {
          var man = this.manList.create(x, y, 'man' + index);
          // man.x = x;
          // man.y = y;
          man.id = x + y;
          // man.anchor.setTo(0.5, 0.5); // 设置锚点
          man.scale.setTo(scale, scale); // 设置缩放比例
        }
      }
    }
    console.log("size: ", this.manList.length);
  },
  this.findDog = function() {
    console.log('find dog');
    
    game.myData.total++;
    game.myState.start.scoreText.text = game.myData.total;
    // 找到狗狗了
    this.dog.bringToTop();
    this.dog.animations.play('find');

    // 画个圈圈把狗圈出来
    var x = this.dog.x + this.dog.width/2;
    var y = this.dog.y + this.dog.height/2;
    game.myState.start.graphics.lineStyle(6, 0xff494e, 1);
    game.myState.start.graphics.drawCircle(x, y, this.dog.height + 10);

    // 播放找到狗的音乐
    try {
      game.myState.start.findMusic.play();
    } catch (e) {
      console.log(e);
    }
    var _this = this;
    setTimeout(function() {
      _this.dog.animations.stop();
      game.myState.start.graphics.clear();
      // _this.dog.moveDown();
      _this.manList.removeAll(true, false, false);
      _this.updateMan();
    }, 500);
  }
}

game.state.add('preload', game.myState.preload);
game.state.add('load', game.myState.load);
game.state.add('start', game.myState.start);
game.state.start('preload');

// 加载图片
var startGame = function() {
  game.state.start('start');
  $("#startMain").hide();
  $("#gameContainer").show();
  // $(".game-over").show();
}

var toggleMusic = function(status) {
  try {
    if (status === 'open') {
      // 打开
      game.myData.bgMusic.resume();
      $(".music-btn:eq(1)").hide();
      $(".music-btn:eq(0)").show();
    } else {
      // 关闭
      game.myData.bgMusic.pause();
      $(".music-btn:eq(0)").hide();
      $(".music-btn:eq(1)").show();
    }
  } catch (e) {
    console.log(e);
  }
}

// 再玩一次
var playAgain = function() {
  game.state.start('start');
  $(".game-over").hide();
  $("#gameContainer").show();
}