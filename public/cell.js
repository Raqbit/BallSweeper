class Cell {
    constructor(xIndex, yIndex) {
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.xPos = this.xIndex * size;
        this.yPos = this.yIndex * size;
        this.exposed = false;
        this.bomb = false;
        this.flagged = false;
        this.triggered = false;
        this.bombCount = -1;
    }

    draw() {
        fill(200);
        rect(this.xPos, this.yPos, size, size);
        if (this.flagged && !this.exposed) {
            push();
            noStroke();
            fill(71, 204, 104);
            triangle(this.xPos + size * 0.2, this.yPos + size * 0.2, this.xPos + size * 0.2, this.yPos + size * 0.8, this.xPos + size * 0.8, this.yPos + size * 0.5)
            pop();
        }
        if (this.exposed) {
            fill(255);
            rect(this.xPos, this.yPos, size, size);
            if (this.bomb) {
                push();
                if (this.triggered) {
                    fill(204, 71, 71)
                } else {
                    fill(180)
                }
                noStroke();
                ellipse(this.xPos + size * 0.5, this.yPos + size * 0.5, size * 0.5, size * 0.5)
                pop();
            } else {
                push();
                fill(0);
                textSize(16);
                if (this.bombCount > 0) {
                    text(this.bombCount, this.xPos + size * 0.35, this.yPos + size * 0.65)
                }
                pop();
            }
        }
    }

    floodFill() {
        setTimeout(() => {
            for (let i = this.xIndex - 1; i <= this.xIndex + 1; i++) {
                for (let j = this.yIndex - 1; j <= this.yIndex + 1; j++) {
                    if (i >= 0 && i < gridWidth && j >= 0 && j < gridHeight) {
                        const square = grid[i][j];
                        if (!square.exposed && !square.bomb && !square.flagged) {
                            square.exposed = true;
                            if (square.bombCount === 0) {
                                square.floodFill();
                            }
                        }
                    }
                }
            }
        }, 80);
    }
}