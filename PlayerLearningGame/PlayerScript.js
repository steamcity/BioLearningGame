var villainsColor = "#2F2F2F";
var damselColor = "#2F2F2F";
var IsReveal = false;
var game;
var heroAngle = 0;

  function reveal(){
    game.draw();
    var buttonText = IsReveal ? "Hide" : "Reveal";
    $('#reveal').text(buttonText);
  }

  document.addEventListener("keydown", function(event) {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      const dir = key.substr(5, 1); // Récupère la direction à partir de la touche
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
      this.reset();
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
        // Draw Damsel
        ctx.fillStyle = "#2F2F2F" ;
        ctx.fillRect(this.damsel[0] * 100, this.damsel[1] * 100, 100, 100);
        // Draw Hero
        ctx.fillStyle = "#FFFFFF"; // //blanc
        this.hero_rect = ctx.fillRect(this.hero[0] * 100, this.hero[1] * 100, 100, 100);
        // Draw Villains
        ctx.fillStyle = "#2F2F2F";
        this.villains.forEach(function (item, index) {
          ctx.fillRect(item[0] * 100, item[1] * 100, 100, 100);
        });
      }
      else {
          var ctx = this.ctx;
          ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          
          // Draw Damsel
          var self = this;
          var damselImage = new Image();
          damselImage.src = '../img/hospital.png';
            
          damselImage.onload = function() {
              ctx.drawImage(damselImage, self.damsel[0] * 100, self.damsel[1] * 100, 100, 100);
            };
    
          // Draw Hero
          var heroImage = new Image();
          heroImage.src = '../img/car.png';
          var self = this;
          heroImage.onload = function() {
            ctx.save(); 
            ctx.translate(self.hero[0] * 100 + 50, self.hero[1] * 100 + 50); 
            ctx.rotate(heroAngle * Math.PI / 180);
            ctx.drawImage(heroImage, -50, -50, 100, 100); 
            ctx.restore(); 
          };
          
          // Draw Villains
          this.villains.forEach(function (villain) {
            var villainsImage = new Image();
            villainsImage.src = '../img/building.png';
            
            villainsImage.onload = function() {
              ctx.drawImage(villainsImage, villain[0] * 100, villain[1] * 100, 100, 100);
            };
          });
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

  $(document).ready(function() {
    // Ajoute un écouteur d'événements pour les touches de direction
    $(document).keydown(function(e) {
        var key = e.which;
        var move;
        // Détermine la direction en fonction de la touche enfoncée
        switch(key) {
            case 37: // Touche gauche
                move = 'l';
                heroAngle = 90;
                break;
            case 38: // Touche haut
                move = 'u';
                heroAngle = 180;
                break;
            case 39: // Touche droite
                move = 'r';
                heroAngle = -90;
                break;
            case 40: // Touche bas
                move = 'd';
                heroAngle = 0;
                break;
            default:
                return; // Ne fait rien pour les autres touches
        }
        // Joue le mouvement et met à jour l'état du jeu
        var reward = game.play(move);
        // Actualise l'affichage du jeu
        game.draw();
        // Met à jour les informations sur l'état du jeu
        if (reward == -100) {
            history[generation] = {status: 'Lost', steps: step};
            $('#history').prepend('<tr><td>' + generation + '</td><td>Lost</td><td>'+step+'</td></tr>');
            generation++;
            step = 1;
        } else if (reward == 100) {
            history[generation] = {status: 'Won', steps: step};
            $('#history').prepend('<tr class="success"><td>' + generation + '</td><td>Won</td><td>'+step+'</td></tr>');
            generation++;
            step = 1;
        } else {
            step++;
        }
        $('#generation').text(generation);
        $('#step').text(step);
        $('#epsilon').text(net.epsilon);
        // Empêche le défilement de la page lorsque les touches de direction sont enfoncées
        e.preventDefault();
    });

    // Initialise le jeu
    game = new Game();
    // Affiche le jeu
    game.draw();
});


  $(document).ready(function() {
    $('body').addClass('container-fluid').removeClass('container');
    $('#reveal').click(function() {
      IsReveal = !IsReveal;
      reveal();
    })
  })