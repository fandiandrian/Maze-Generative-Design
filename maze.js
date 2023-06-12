
// The music should only play when we click "Start" button on maze page, and stop when the game end.


// This code has no music play issue when we run it in the local compiler - VS code. But in replit it doesn't work as expect.


//Plase download this code and run it whith a local compiler 

//The essential javascript functions we used were based on Document: 
//getElementById(), EventTarget: addEventListener(), and the add() and remove() functions in classList.

//First we define some of the Variables
// Variables for musicMachine
let loops = [];
let tenorCounter = 0;
let tenorPitch = 'C3';
let trebleCounter = 0;
let treblePitch = 'E2';
let synth;


// Function to stop the music loops
function stopMusic() {
    // Stop all the loops and reset the counters
    loops.forEach(loop => loop.stop());
    tenorCounter = 0;
    trebleCounter = 0;
    //The page will jump out the finished notification along with using the 'showPopup' function.
    showPopup();
    // Mute the synth
    if (synth) {
        synth.volume.value = -Infinity;
    }

}


//Starts to creating soundtrack


function musicMachine() {
    //Define a volume control node
    const gainNode = new Tone.Gain(0.5).toDestination();
    synth = new Tone.PolySynth(Tone.Synth).connect(gainNode);

    // Set swing for a jazz feel
    Tone.Transport.swing = 0.3;
    Tone.Transport.swingSubdivision = "8n";

    // Adjust tempo
    Tone.Transport.bpm.value = 160;

    // Bass
    loops[0] = new Tone.Loop(time => {
        let pitch = nextPitch() + '2';
        synth.triggerAttackRelease(pitch, "16n", time);
    }, "4n").start(0);

    // Tenor
    loops[1] = new Tone.Loop(time => {
        if (tenorCounter++ % 2 !== 0) {
            synth.triggerAttackRelease(tenorPitch, "8n", time);
        } else {
            tenorPitch = nextPitch() + '3';
        }
    }, "8n").start(0);

    // Treble
    loops[2] = new Tone.Loop(time => {
        if (trebleCounter++ % 2 === 0) {
            synth.triggerAttackRelease(treblePitch, "16n", time);
        } else {
            treblePitch = nextPitch() + '4';
        }
    }, "8n").start(0);

    // Play the soundtrack
    Tone.Transport.start();
}

// Helper function to get the next random pitch
function nextPitch() {
    const pitches = ["C", "D", "E", "F", "G", "A", "B"];
    const randomIndex = Math.floor(Math.random() * pitches.length);
    return pitches[randomIndex];
}

// In this part, we start with creating maze
// Game parameters

// Define the variables
var w = 40; // complexcity
var mazeColor =  localStorage.getItem("mazeColor") || [255, 0, 255]; // color
var canvasSize = 400; // size
var gameSpeed = localStorage.getItem("gameSpeed") || 20; // speed
var  mazeComplexity =localStorage.getItem("mazeComplexity") || 'easy' // game level

//We define our objects as p. and define variables
var sketch = function(p) {
    var cols, rows;
    var grid = []; 
    var current; 
    var stack = [];
    var gameStarted = false;
    var gameEnded = false;

//Setting up the original values
    p.setup = function() {
        //Creating canvas,giving values
        var canvas = p.createCanvas(canvasSize, canvasSize);
        canvas.parent("maze-container");
        cols = p.floor(p.width / w);
        rows = p.floor(p.height / w);
// Creating Loops
        for (var j = 0; j < rows; j++) {
            for (var i = 0; i < cols; i++) {
                var cell = new Cell(i, j);
                grid.push(cell);
            }
        }

        current = grid[0];
    }

    // We start to form a logic inside maze game, this process will be constantly draw the maze routine.
    p.draw = function() {
        // Change the speed of the game
        p.frameRate(gameSpeed);
        
        // Forming a different types of grids
        for (var i = 0; i < grid.length; i++) {
            grid[i].show();
        }
    
        //We start to check whether the game is started or ended.
        if (gameStarted && !gameEnded) {
            current.visited = true;
            current.highlight();

    // Accessing with other cells
            var next = current.checkNeighbor();
            if (next) {
                next.visited = true;
                stack.push(current)
                removeWalls(current, next);
                current = next;
            } else if (stack.length > 0) {
                current = stack.pop();
            } else {
                gameEnded = true;
                stopMusic(); // Call the stopMusic function when the game ends
            }
        }
    //The game ends
        if (gameEnded) {
            // Additional logic to check if the dot has returned to the start point
            var startCell = grid[0];
            if (current === startCell && startCell.visited) {
                stopMusic(); // Call the stopMusic function when the dot returns to the start point
            }
    
        }
    }
    

    function index(i, j) {
        if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
            return -1;
        }
        return i + j * cols;
    }

    // Create the maze grid and generate the function
    // Generate function that decided how the dot move
    function Cell(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];
        this.visited = false;

        //Giving values to cells
        this.checkNeighbor = function() {
            var neighbors = [];

            var top = grid[index(i, j - 1)];
            var right = grid[index(i + 1, j)];
            var bottom = grid[index(i, j + 1)];
            var left = grid[index(i - 1, j)];

            if (top && !top.visited) {
                neighbors.push(top);
            }
            if (right && !right.visited) {
                neighbors.push(right);
            }
            if (bottom && !bottom.visited) {
                neighbors.push(bottom);
            }
            if (left && !left.visited) {
                neighbors.push(left);
            }

            if (neighbors.length > 0) {
                var r = p.floor(p.random(0, neighbors.length))
                return neighbors[r];
            } else {
                return undefined;
            }
        }
        // Starts to giving colour pattern to grids
//Adding color
        this.highlight = function() {
            var x = this.i * w;
            var y = this.j * w;
            p.noStroke();
            p.fill(0, 0, 255, 100);
            p.rect(x, y, w, w);
        }
// Stroking
        this.show = function() {
            var x = this.i * w;
            var y = this.j * w;
            p.stroke(255);
            if (this.walls[0]) {
                p.line(x, y, x + w, y);
            }
            if (this.walls[1]) {
                p.line(x + w, y, x + w, y + w);
            }
            if (this.walls[2]) {
                p.line(x + w, y + w, x, y + w);
            }
            if (this.walls[3]) {
                p.line(x, y + w, x, y);
            }

            if (this.visited) {
                p.noStroke();
                p.fill(mazeColor[0], mazeColor[1], mazeColor[2], 100);
                p.rect(x, y, w, w);
                console.log(p);
            }
        }
    }

    function removeWalls(a, b) {
        var x = a.i - b.i;

        if (x === 1) {
            a.walls[3] = false;
            b.walls[1] = false;
        } else if (x === -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }

        var y = a.j - b.j;

        if (y === 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else if (y === -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }
//Link the function to HTML
    document.getElementById("start-btn").addEventListener("click", function() {
        gameStarted = true;
        musicMachine(); // Call the musicMachine function here
    });
}

new p5(sketch);

// Call the musicMachine function after defining the stopMusic function
musicMachine();


// Event listeners for maze size buttons
//Large button
document.getElementById("large-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeSize", "large");
    localStorage.removeItem("mazeComplexity");
    localStorage.removeItem("gameSpeed");
    localStorage.removeItem("mazeColor");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Medium Button
document.getElementById("medium-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeSize", "medium");
    localStorage.removeItem("mazeComplexity");
    localStorage.removeItem("gameSpeed");
    localStorage.removeItem("mazeColor");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Small button
document.getElementById("small-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeSize", "small");
    localStorage.removeItem("mazeComplexity");
    localStorage.removeItem("gameSpeed");
    localStorage.removeItem("mazeColor");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

// Event listeners for complexity buttons
//Easy Button
document.getElementById("easy-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeComplexity", "easy");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Normal Button
document.getElementById("normal-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeComplexity", "normal");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Hard button
document.getElementById("hard-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeComplexity", "hard");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

// Event listeners for speed buttons
//Fast speed button
document.getElementById("fast-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("gameSpeed", "fast");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Medium Speed button
document.getElementById("medium-speed-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("gameSpeed", "medium");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Slow speed button
document.getElementById("slow-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("gameSpeed", "slow");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

// Event listeners for maze color buttons
//White button
document.getElementById("white-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeColor", "white");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Red button
document.getElementById("red-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeColor", "red");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Blue button
document.getElementById("blue-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeColor", "blue");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Yellow button
document.getElementById("yellow-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeColor", "yellow");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

//Green button
document.getElementById("green-btn").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.setItem("mazeColor", "green");
    document.body.classList.add("hidden");
    window.location.href = window.location.href; // Redirect to the same page to apply the changes
});

// Hide the content initially until the page finishes loading
document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.remove("hidden");
});


// Retrieve player's choices from localStorage
function retrievePlayerChoices() {
    const mazeSize = localStorage.getItem("mazeSize");

    //Size
    if (mazeSize) {
        if (mazeSize === "large") {
            document.getElementById("large-btn").classList.add("clicked");
            canvasSize = 500;
        } else if (mazeSize === "medium") {
            document.getElementById("medium-btn").classList.add("clicked");
            canvasSize = 300;
        } else if (mazeSize === "small") {
            document.getElementById("small-btn").classList.add("clicked");
            canvasSize = 200;
        }
    }
//Game level
    if (mazeComplexity) {
        if (mazeComplexity === "easy") {
            document.getElementById("easy-btn").classList.add("clicked");
            w = 60;
        } else if (mazeComplexity === "normal") {
            document.getElementById("normal-btn").classList.add("clicked");
            w = 40;
        } else if (mazeComplexity === "hard") {
            document.getElementById("hard-btn").classList.add("clicked");
            w = 20;
        }
    }
//Speed
    if (gameSpeed) {
        if (gameSpeed === "fast") {
            document.getElementById("fast-btn").classList.add("clicked");
            gameSpeed = 50;
        } else if (gameSpeed === "medium") {
            document.getElementById("medium-speed-btn").classList.add("clicked");
            gameSpeed = 20;
        } else if (gameSpeed === "slow") {
            document.getElementById("slow-btn").classList.add("clicked");
            gameSpeed = 5;
        }
    }
//Color
    if (mazeColor) {
        if (mazeColor === "white") {
            document.getElementById("white-btn").classList.add("clicked");
            mazeColor = [255, 255, 255];
        } else if (mazeColor === "red") {
            document.getElementById("red-btn").classList.add("clicked");
            mazeColor = [200,49,22];
        } else if (mazeColor === "blue") {
            console.log('blue');
            document.getElementById("blue-btn").classList.add("clicked");
            mazeColor = [42,142,182];
        } else if (mazeColor === "yellow") {
            document.getElementById("yellow-btn").classList.add("clicked");
            mazeColor = [182,175,58];
        } else if (mazeColor === "green") {
            document.getElementById("green-btn").classList.add("clicked");
            mazeColor = [76,182,50];
        }
    }
}

// Call retrievePlayerChoices function to retrieve and apply the player's choices
retrievePlayerChoices();
