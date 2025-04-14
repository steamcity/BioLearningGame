var isPaused = true;
var heroAngle = 0;

  function togglePause() {
    isPaused = !isPaused;
    var buttonText = isPaused ? "Resume" : "Pause";
    $('#start').text(buttonText);
  }

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
    constructor(hero, damsels, villains) {
      this.canvas = document.getElementById("main");
      this.ctx = this.canvas.getContext("2d");
      this.initialHero = hero || [0, 0];
      this.initialDamsels = damsels || [[0, 5], [4, 4]];
      this.initialVillains = villains || [[2, 1], [4, 2], [1, 2], [3, 4], [1, 5], [5, 0]];

      this.damselImage = new Image();
      this.damselImage.src = '../img/hospital.png';

      this.heroImage = new Image();
      this.heroImage.src = '../img/car.png';

      this.villainImage = new Image();
      this.villainImage.src = '../img/building.png';

      this.damselImage = new Image();
      this.damselImage.onload = () => {
        this.heroImage = new Image();
        this.heroImage.onload = () => {
          this.villainImage = new Image();
          this.villainImage.onload = () => {
            this.reset(); // Une fois que toutes les images sont chargées, initialisez le jeu
          };
          this.villainImage.src = '../img/building.png';
        };
        this.heroImage.src = '../img/car.png';
      };
      this.damselImage.src = '../img/hospital.png';

      this.reset();
    }
  
    reset() {
      this.hero = [...this.initialHero];
      this.damsels = this.initialDamsels.map(damsel => [...damsel]);
      this.villains = this.initialVillains.map(villain => [...villain]);
      this.moveCount = 0;
      this.draw();
    }
  
    play(dir) {
      this.move(dir);
      this.draw();
      var reward = 100;
      if (this.damsels.some(damsel => arraysEqual(damsel, this.hero))) {
        reward = 100;
        this.reset();
      } else if (arrayContainsArray(this.hero, this.villains)) {
        reward = -100;
        this.reset();
      } else if (this.hero[0] < 0 || this.hero[1] < 0) {
        reward = -100;
        this.reset();
      } else if (this.hero[0] >= this.canvas.width / 100 || this.hero[1] >= this.canvas.height / 100) {
        reward = -100;
        this.reset();
      } else {
        reward = -1;
      }
      return reward;
    }
  
    move(dir) {
      switch (dir) {
        case 'u':
          this.hero[1] = this.hero[1] - 1;
          heroAngle = 180; 
          break;
        case 'd':
          this.hero[1] = this.hero[1] + 1;
          heroAngle = 0; 
          break;
        case 'l':
          this.hero[0] = this.hero[0] - 1;
          heroAngle = 90; 
          break;
        case 'r':
          this.hero[0] = this.hero[0] + 1;
          heroAngle = -90; 
          break;
      }
      this.moveCount = this.moveCount + 1;
    }
  
    draw() {
      var ctx = this.ctx;
      var self = this;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw Damsels
      this.damsels.forEach(function(damsel) {
          ctx.drawImage(self.damselImage, damsel[0] * 100, damsel[1] * 100, 100, 100);
      });

      // Draw Hero
      ctx.save();
      ctx.translate(self.hero[0] * 100 + 50, self.hero[1] * 100 + 50);
      ctx.rotate(heroAngle * Math.PI / 180);
      ctx.drawImage(self.heroImage, -50, -50, 100, 100);
      ctx.restore();

      // Draw Villains
      this.villains.forEach(function(villain) {
          ctx.drawImage(self.villainImage, villain[0] * 100, villain[1] * 100, 100, 100);
      });
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
      //New Q value = Current Q value + lr * [Reward + discount_rate * (highest Q value between possible actions from the new state s’ ) — Current Q value ]
      var maxArr = this.qArr[state];
      var maxQ = Math.max.apply(Math, maxArr);
      var newQ = this.qArr[prevState][action] + this.lr * (reward + this.discount_rate * maxQ) - this.qArr[prevState][action]
      this.qArr[prevState][action] = newQ;
    }
  }





  // Play the game
  game = new Game
  net = new QNetwork(4, 36)

  var i = 1;                     //  set your counter to 1
  var generation = 1;
  var step = 1;
  var history = [];

  function myLoop () {   
    if (!isPaused) {      
      var speed = parseInt(document.getElementById('speed').value); // Récupère la valeur de l'élément input
     setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        state = game.hero[0] * 5 + game.hero[1] + game.hero[0]
        action = net.think(state)
        // Convert action 
        var move = null;
        switch(action) {
          case 0:
            move = 'u'
            break;
          case 1:
            move = 'd'
            break;
          case 2:
            move = 'l'
            break;
          case 3:
            move = 'r'
            break;
        }
        reward = game.play(move)
        prevState = state
        state = game.hero[0] * 5 + game.hero[1] + game.hero[0]
        net.giveReward(reward, state, prevState, action)
        if (reward == -100) {
          history[generation] = {status: 'Lost', steps: step}
          $('#history').prepend('<tr><td>' + generation + '</td><td>Lost</td><td>'+step+'</td></tr>');
          generation = generation + 1;
          step = 1;
        } else if (reward == 100) {
          history[generation] = {status: 'Won', steps: step}
          $('#history').prepend('<tr class="success"><td>' + generation + '</td><td>Won</td><td>'+step+'</td></tr>');
          generation = generation + 1;
          step = 1;
        } else {
          step = step + 1;
        }
        $('#generation').text(generation);
        $('#step').text(step);
        var qOut = '';
        $.each(net.qArr, function() {
          qOut = qOut + JSON.stringify(this) + '<br>';
        });
        $('#q-table').html(qOut);
        $('#epsilon').text(net.epsilon);
        i++;                     //  increment the counter
        if (i < 10000) {            //  if the counter < 10, call the loop function
           myLoop();             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
     }, 150-speed)
    }
  }



  $(document).ready(function() {
    var editButton = $('#edit');
    editButton.prop('disabled', true); 

    $('#main').click(function(e) {
        if (!isPaused) return;

        var canvas = document.getElementById('main');
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var col = Math.floor(x / 100);
        var row = Math.floor(y / 100);

        var selectedType = $('input[name="case"]:checked').val();
        switch (selectedType) {
            case 'damsel':
                game.damsels.push([col, row]);
                break;
            case 'villain':
                game.villains.push([col, row]);
                break;
            case 'hero':
                game.hero = [col, row];
                break;
            case 'empty':
              game.damsels = game.damsels.filter(function(coord) {
                return !(coord[0] === col && coord[1] === row);
              });
              game.villains = game.villains.filter(function(coord) {
                  return !(coord[0] === col && coord[1] === row);
              });
              break;
        }
        
        editButton.prop('disabled', false);
        game.draw();
    });

    $('#edit').click(function() {
        game = new Game(game.hero, game.damsels, game.villains);
        editButton.prop('disabled', true);
    });

    $('#start').click(function() {
      myLoop();
  });
  
  $('#start').click(function() {
      togglePause(); 
      if (!isPaused) {
          myLoop();
      }
  });

});