## Variables
- **isPaused**: A boolean indicating if the game is paused.
- **heroDirection**: A string representing the hero's current direction ("left").

## Functions
- **togglePause()**: Toggles the game's pause state and updates the button text to "Resume" or "Pause" accordingly.
- **arraysEqual(a, b)**: Checks if two arrays `a` and `b` are equal.
- **sleep(milliseconds)**: Pauses execution for the specified number of milliseconds.
- **arrayContainsArray(a, b)**: Checks if the array `a` is contained within any of the sub-arrays in `b`.
- **getRandomInt(min, max)**: Returns a random integer between `min` and `max`, inclusive.
- **indexOfMax(arr)**: Returns the index of the maximum value in the array `arr`.
- **chunk(array, size)**: Splits `array` into chunks of the specified `size`.

## Class: Game
### Constructor: `Game(hero, damsels, villains)`
Initializes the game with the given hero position, damsels, and villains. Loads images for various game elements and creates the initial map.
- **createMap(hero, damsel, villains)**: Creates and returns the initial game map based on hero, damsels, and villains' positions.
- **reset()**: Resets the game to the initial state.
- **play(dir)**: Moves the hero in the specified direction `dir`, updates the game state, and returns a reward based on the new state.
- **move(dir)**: Moves the hero in the specified direction `dir` and updates the hero's direction.
- **draw()**: Draws the game elements (hero, damsels, villains, and roads) on the canvas.

## Class: QNetwork
### Constructor: `QNetwork(actions, states)`
Initializes the Q-learning network with the given number of actions and states.
- **initArr(cols, rows)**: Initializes a Q-table with zeros.
- **think(state)**: Determines the next action based on the current state using an epsilon-greedy policy.
- **giveReward(reward, state, prevState, action)**: Updates the Q-value based on the reward received and the state transition.

## Game Loop
- **myLoop()**: Main game loop that runs the game, makes the hero take actions, updates the game state, and logs the game progress.

## Event Handlers
- **$(document).ready()**: Initializes the game and sets up event handlers for UI interactions (e.g., start/pause button, cell clicks).
- **Start Button Click**: Starts or pauses the game and triggers the main game loop if the game is resumed.


## Specific to Game part
### Document Ready Event
- **Initial setup**: Adds keydown event listener and initializes the game.
- **Reveal Button Click Event**: Toggles the reveal mode when the button is clicked.

## Specific to design part
## Event Handlers
- **Cell Click Handler**: Handles cell clicks for editing the game map (adding/removing damsels, villains, or the hero).
- **Edit Button Click**: Resets the game to reflect the edited map.