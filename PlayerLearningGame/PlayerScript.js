var IsReveal = false;
var game;
var heroDirection = "left";

var historyChart;
var chartData = {
    labels: [],
    datasets: [{
        label: 'Steps per Generation',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
    }]
};

function initChart() {
    var ctx = document.getElementById('history-chart').getContext('2d');
    historyChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart(generation, steps, status) {
    chartData.labels.push(generation);
    chartData.datasets[0].data.push(steps);
    if (status === 'Won') {
        chartData.datasets[0].backgroundColor.push('green');
        chartData.datasets[0].borderColor.push('green');
    } else {
        chartData.datasets[0].backgroundColor.push('red');
        chartData.datasets[0].borderColor.push('red');
    }
    historyChart.update();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function hashStringToSeed(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
  }
  return hash;
}

function createRandomGenerator(seed) {
  var m = 0x80000000;
  var a = 1103515245;
  var c = 12345;
  var state = seed ? seed : Math.floor(Math.random() * (m - 1));
  return function() {
      state = (a * state + c) % m;
      return state / (m - 1);
  };
}

  function reveal(){
    game.draw();
    var buttonText = IsReveal ? "Hide" : "Reveal";
    $('#reveal').text(buttonText);
  }

  document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      const dir = key.substr(5, 1);
      play(dir);
    }
  });

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  function arrayContainsArray(a, b) {
    var bool = false;
    $.each(b, function() {
      if (arraysEqual(this, a)) {
        bool = true
      }
    })
    return bool;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
  }

  function chunk(array, size) {
    const chunked_arr = [];
    for (let i = 0; i < array.length; i++) {
      const last = chunked_arr[chunked_arr.length - 1];
      if (!last || last.length === size) {
        chunked_arr.push([array[i]]);
      } else {
        last.push(array[i]);
      }
    }
    return chunked_arr;
}

  class Game {
      constructor() {
        this.canvas = document.getElementById("main");
        this.ctx = this.canvas.getContext("2d");
  
        this.hero_u = new Image();
        this.hero_u.src = '../img/ambulance/ambulance_u.png';
        this.hero_d = new Image();
        this.hero_d.src = '../img/ambulance/ambulance_d.png';
        this.hero_r = new Image();
        this.hero_r.src = '../img/ambulance/ambulance_r.png';
        this.hero_l = new Image();
        this.hero_l.src = '../img/ambulance/ambulance_l.png';
  
        this.heroImage = new Image();
        this.heroImage.src = '../img/hero.png';

        this.exploImage = new Image();
        this.exploImage.src = '../img/explosion.gif';
  
        this.damselImageArray = this.getRandomImage("damsel");
        this.villainImageArray = this.getRandomImage("vilain");
        this.roadImageArray = this.getRandomImage("empty");

        this.damselImage = new Image();
        this.damselImage.onload = () => {
          this.heroImage = new Image();
          this.heroImage.onload = () => {
            this.villainImage = new Image();
            this.villainImage.onload = () => {
              this.roadImage = new Image();
              this.roadImage.onload = () => {
                this.reset();
              };
              this.roadImage.src = '../img/road/1.png';
              this.roadImage.src = '../img/road/2.png';
            };
            this.villainImage.src = '../img/building/1.png';
          };
          this.heroImage.src = '../img/hero.png';
        };
        this.damselImage.src = '../img/hospital/1.png';
  
        this.hero = [0,0];
        this.damsel = [4,4];
        this.villains = [[2,1], [4,2], [1,2], [3,4], [1,5], [5,0]];
        this.map = this.createMap(this.hero,this.damsel,this.villains);
        this.reset();
      }
      
      getRandomImage(type){
        var images = [];
        var dossier;
        var number;
        switch (type){
          case "damsel" : dossier = "../img/hospital/"; number = 2; break;
          case "vilain" : dossier = "../img/building/"; number = 66; break;
          case "empty" : dossier = "../img/road/"; number = 4; break;
        }
  
        while (number>=1){
          var image = new Image();
          image.src = dossier + number + ".png";
          images.push(image);
          number --;
        }
  
        return shuffle(images);
      }
  
      createMap(hero, damsel, villains) {
        var map = [];
        for (var i = 0; i < 6; i++) {
            map.push(Array(6).fill('-'));
        }
    
        map[hero[0]][hero[1]] = 'H';
    
        map[damsel[0]][damsel[1]] = 'D';
    
        for (var i = 0; i < villains.length; i++) {
            map[villains[i][0]][villains[i][1]] = 'V';
        }
    
        return map;
      }

    reset() {
      this.hero = [0,0];
      this.damsel = [4,4];
      this.villains = [[2,1], [4,2], [1,2], [3,4], [1,5], [5,0]];
      this.moveCount = 0;
      this.draw();
    }

    play(dir) {
      this.move(dir);
      this.draw();
      var reward = 100;
      if (arraysEqual(this.damsel, this.hero)) {
        reward = 100;
        this.reset();
      } else if (arrayContainsArray(this.hero, this.villains)) {
        reward = -100;
        this.reset();
      } else if (this.hero[0] < 0 || this.hero[1] < 0) {
        reward = -100;
        this.reset();
      } else if (this.hero[0] > 5 || this.hero[1] > 5) {
        reward = -100;
        this.reset();
      } else {
        reward = -1;
      }
      return reward;
    }

    move(dir) {
      if (dir == 'u') {
        this.hero[1] = this.hero[1] - 1;
      } else if (dir == 'd') {
        this.hero[1] = this.hero[1] + 1;
      } else if (dir == 'l') {
        this.hero[0] = this.hero[0] - 1;
      } else if (dir == 'r') {
        this.hero[0] = this.hero[0] + 1;
      }
      this.moveCount = this.moveCount + 1;
    }

    draw() {
      if (!IsReveal){
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        var isoOffsetX = 250;
        var isoOffsetY = 30;
    
        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[i].length; j++) {
                var x = (j - i) * 50 + isoOffsetX;
                var y = (j + i) * 37 + isoOffsetY;
                var element = this.map[i][j];
    
                var seed = hashStringToSeed(i + ',' + j);
                var random = createRandomGenerator(seed);
    
                var roadImageIndex = Math.floor(random() * this.roadImageArray.length);
    
                ctx.drawImage(this.roadImageArray[roadImageIndex], x, y, 100, 75);

                if (element=='H'){ctx.drawImage(this.heroImage, x + 30, y + 15, 40, 40);}
            }
        }
      }
      else {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        var isoOffsetX = 250;
        var isoOffsetY = 30;
    
        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[i].length; j++) {
                var x = (j - i) * 50 + isoOffsetX;
                var y = (j + i) * 37 + isoOffsetY;
                var element = this.map[i][j];
    
                var seed = hashStringToSeed(i + ',' + j);
                var random = createRandomGenerator(seed);
    
                var roadImageIndex = Math.floor(random() * this.roadImageArray.length);
                var damselImageIndex = Math.floor(random() * this.damselImageArray.length);
                var villainImageIndex = Math.floor(random() * this.villainImageArray.length);
    
                ctx.drawImage(this.roadImageArray[roadImageIndex], x, y, 100, 75);
    
                switch (element) {
                    case 'H':
                        switch (heroDirection) {
                            case "up":
                                ctx.drawImage(this.hero_u, x + 30, y + 15, 40, 40);
                                break;
                            case "down":
                                ctx.drawImage(this.hero_d, x + 30, y + 15, 40, 40);
                                break;
                            case "left":
                                ctx.drawImage(this.hero_l, x + 30, y + 15, 40, 40);
                                break;
                            case "right":
                                ctx.drawImage(this.hero_r, x + 30, y + 15, 40, 40);
                                break;
                        }
                        break;
                    case 'D':
                        ctx.drawImage(this.damselImageArray[damselImageIndex], x + 20, y - 30, 75, 90);
                        break;
                    case 'V':
                      ctx.drawImage(this.villainImageArray[villainImageIndex], x + 20, y - 15, 75, 75);
                        break;
                }
            }
        }
      }
    }
  }

  class QNetwork {
    constructor(actions, states) {
      this.initArr(actions, states);
      this.actions = actions;
      this.states = states;
      this.last_action = null;
      this.lr = 1.0;
      this.discount_rate = 1.0;
      this.epsilon = 1.0;
      this.epsilon_decay = 0.001;
      this.currentState = 0;
    }

    initArr(cols, rows) {
      this.qArr = [];
      var i = 0;
      var j = 0;
      for (i = 0; i < rows; i++) { 
        var innerArr = [];
        for (j = 0; j < cols; j++) { 
          innerArr.push(0);
        }
        this.qArr.push(innerArr);
      }
    }

    think(state) {
      this.currentState = this.qArr[state];
      var action = null;
      if (Math.random() < this.epsilon) {
        action = getRandomInt(0,(this.actions - 1))
      } else {
        action = indexOfMax(this.currentState);
      }
      this.epsilon = this.epsilon - (this.epsilon_decay * this.epsilon);
      return action;
    }

    giveReward(reward, state, prevState, action) {
      console.log([reward, state, prevState, action])
      var maxArr = this.qArr[state];
      var maxQ = Math.max.apply(Math, maxArr);
      var newQ = this.qArr[prevState][action] + this.lr * (reward + this.discount_rate * maxQ) - this.qArr[prevState][action]
      this.qArr[prevState][action] = newQ;
    }
  }

  game = new Game
  net = new QNetwork(4, 36)

  var i = 1;
  var generation = 1;
  var step = 1;
  var history = [];

  $(document).ready(function() {
    $(document).keydown(function(e) {
        var key = e.which;
        if (key==37||key==38||key==39||key==40){
        var move;
        switch(key) {
            case 37:
                move = 'r';
                heroDirection = "right";
                break;
            case 38:
                move = 'u';
                heroDirection = "up";
                break;
            case 39: 
                move = 'l';
                heroDirection = "left";
                break;
            case 40: 
                move = 'd';
                heroDirection = "down";
                break;
        }
        var reward = game.play(move);
        game.map = game.createMap(game.hero,game.damsel,game.villains);

        game.draw();

        if (reward == -100) {
            history[generation] = {status: 'Lost', steps: step};
            $('#history').prepend('<tr><td>' + generation + '</td><td>Lost</td><td>'+step+'</td></tr>');
            updateChart(generation, step, 'Lost');
            generation++;
            step = 1;
        } else if (reward == 100) {
            history[generation] = {status: 'Won', steps: step};
            $('#history').prepend('<tr class="success"><td>' + generation + '</td><td>Won</td><td>'+step+'</td></tr>');
            updateChart(generation, step, 'Won');
            generation++;
            step = 1;
        } else {
            step++;
        }
        $('#generation').text(generation);
        $('#step').text(step);
        $('#epsilon').text(net.epsilon);
        e.preventDefault();
      }
    });

    game = new Game();
    game.draw();
});


  $(document).ready(function() {
    $('body').addClass('container-fluid').removeClass('container');
    $('#reveal').click(function() {
      IsReveal = !IsReveal;
      reveal();
    })
    initChart();
  })