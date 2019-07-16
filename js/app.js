// Helper function to return a random integer
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// The player class
class Player {

    constructor() {
        this.sprite = 'images/char-boy.png';
        this.resetPlayer();
    }

    // Game engine expects an update method, but as the player is controlled by the arrow keys,
    // it doesn't seem that we need this. An empty function has been left to keep the game engine happy.
    update() {

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(direction = 'none') {

        // Depending on the arrow key pressed, update the xy position. If the y position
        // has changed, update the current row num for the palyer which will be used when checking for a collision
        switch (direction) {
            case 'left' : this.x -= 101; break;
            case 'right' : this.x += 101; break;
            case 'up' : this.y -= 83; this.currentRowNum ++; break;
            case 'down' : this.y += 83; this.currentRowNum --; break;
        }

        // If the xy position of the player is outside of the canvas, move the player back inside the canvas limits
        if (this.x < 0) this.x = 0;
        if (this.x > 400) this.x = 400;
        if (this.y > 385) {this.y = 385; this.currentRowNum = 1;}
        if (this.y < -30) {this.y = -30; this.currentRowNum = 6;}

        // If the player has reached the water for more than a second, reset the game
        if (this.currentRowNum === 6) {
            setTimeout(() => {
                if (this.currentRowNum === 6) {
                    this.resetPlayer();
                }
            }, 1000)
        }
    }

    // Reset the player to the starting position
    resetPlayer() {
        this.x = 202;
        this.y = 385;
        this.currentRowNum = 1;
    }
}

class Enemy {

    // Accepts the player as an argument, so that we can test for collisions every update cycle
    constructor(player) {
        // Set the enemy image
        this.sprite = 'images/enemy-bug.png';

        this.player = player;

        // Initialize the enemy
        this.resetEnemey();
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = Math.round(this.x + (this.speed * dt));

        // If the x position is betond the edge of the canvas, reset the enemy to a new starting spot and speed
        if (this.x > 700) {
            this.resetEnemey();
        }

        // Check for a collision. If the enemy is in the same row as the player and their x positions overlap, then reset the player
        if ((this.x > this.player.x - 50) && (this.x < this.player.x + 50) && (this.rowNum === this.player.currentRowNum)) {
            player.resetPlayer();
        }
    }

    render() {
        // Draw the enemy on the screen, required method for game
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    resetEnemey() {
        // Reset the enemy to be before the start of the canvas
        this.x = -100;

        // Select a random row for the enemy to traverse. Either row 3,4 or 5 and set the corresponding y coordinate
        this.rowNum = getRandomInt(3) + 3;
        switch (this.rowNum) {
            case 5 : this.y = 60; break;
            case 4 : this.y = 145; break;
            case 3 : this.y = 230; break;
            default : this.y = 60;
        }

        // Select a random speed for the enemy
        this.speed = getRandomInt(400) + 100;
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Initialize player object
let player = new Player();

// Create three enemies to traverse the grid on random rows with a random speed
let allEnemies = [new Enemy(player), new Enemy(player), new Enemy(player)];

