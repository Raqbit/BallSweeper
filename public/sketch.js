let gridWidth;
let gridHeight;
const totalBombs = 4;
const size = 30;
let grid;
let firstPress;

let correctFlagCounter = 0;

function setup() {
    const cnv = createCanvas(301, 301);
    cnv.parent('sketch-parent');

    const restartBtn = select('#restart-btn');
    restartBtn.mousePressed(restart);

    gridWidth = Math.floor(width / size);
    gridHeight = Math.floor(height / size);

    grid = create2DArray(gridWidth, gridHeight);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
    firstPress = true;
}

function draw() {
    if (correctFlagCounter === totalBombs) {
        revealAll();
    }
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            grid[i][j].draw();
        }
    }
}

function restart() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
    correctFlagCounter = 0;
    firstPress = true;
}

function mousePressed() {
    const xPos = Math.floor(mouseX / size);
    const yPos = Math.floor(mouseY / size);
    if (xPos >= 0 && xPos < gridWidth && yPos >= 0 && yPos < gridHeight) {
        const square = grid[xPos][yPos];
        if (mouseButton === LEFT) {
            if (firstPress) {
                genBombs(xPos, yPos);
                firstPress = false;
            }
            if (!square.exposed && !square.flagged) {
                square.exposed = true;
                if (square.bomb) {
                    square.triggered = true;
                    revealAll();
                } else {
                    if (square.bombCount === 0) {
                        square.floodFill();
                    }
                }
            }
        } else if (mouseButton === RIGHT) {
            square.flagged = !square.flagged;

            if (square.flagged && square.bomb) {
                correctFlagCounter++;
            } else {
                correctFlagCounter--;
            }
        }

    }
}

function revealAll() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            grid[i][j].exposed = true;
        }
    }
}

function genBombs(excX, excY) {
    let options = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if (!(excX === i && excY === j)) {
                options.push([i, j]);
            }
        }
    }

    for (let n = 0; n < totalBombs; n++) {
        const index = floor(random(options.length));
        const choice = options[index];
        const i = choice[0];
        const j = choice[1];
        options.splice(index, 1);
        grid[i][j].bomb = true;
    }
    countBombs();
}

function countBombs() {
    for (let i = 0; i < gridWidth; i++) {
        for (let j = 0; j < gridHeight; j++) {
            const square = grid[i][j];
            let count = 0;
            for (let x = square.xIndex - 1; x <= square.xIndex + 1; x++) {
                for (let y = square.yIndex - 1; y <= square.yIndex + 1; y++) {
                    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                        if (grid[x][y].bomb) {
                            count++;
                        }
                    }
                }
            }
            square.bombCount = count;
        }
    }
}