const BOARD_SIZE = 4;
const BLOCK_SIZE = 150;
const COLOR_MAPPING = [
    'white',
    'orange',
]
const WhiteID = 0;
const FONT_SIZE = 100;

const canvas = document.querySelector('#board');
const ctx = canvas.getContext('2d');
const playBtn = document.querySelector('.start-game button');
const container = document.querySelector('.container');
const scoreSpan = document.querySelector('.score span');

container.setAttribute('style', `grid-template-columns: ${BLOCK_SIZE*BOARD_SIZE+20}px 200px`);

let playing = 0;
let score = 0;

class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
        this.ctx.canvas.width = BOARD_SIZE * BLOCK_SIZE;
        this.ctx.canvas.height = BOARD_SIZE * BLOCK_SIZE;
    }

    reset() {
        score = 0;
        scoreSpan.innerText = score;
        this.grid = this.generateWhiteBoard();
        this.drawBoard();
        for (let row=0; row<BOARD_SIZE; row++) {
            for (let col=0; col<BOARD_SIZE; col++) {
                this.ctx.clearRect(row*BLOCK_SIZE+1, col*BLOCK_SIZE+1, BLOCK_SIZE-1, BLOCK_SIZE-1);
            }
        }
        board.generateRandomNumber();
        board.generateRandomNumber();
    }

    generateWhiteBoard() {
        return Array.from({length: BOARD_SIZE}, () => Array(BOARD_SIZE).fill(WhiteID));
    }

    drawCell(x, y, num) {
        if (num) {
            this.ctx.textAlign = 'center';
            this.ctx.font = `${FONT_SIZE}px Arial`;
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(num, (x*BLOCK_SIZE)+(BLOCK_SIZE/2), (y*BLOCK_SIZE)+FONT_SIZE);  
        }
        this.ctx.fillStyle = 'black';
        this.ctx.strokeRect(x*BLOCK_SIZE, y*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    drawBoard() {
        for (let row=0; row<BOARD_SIZE; row++) {
            for (let col=0; col<BOARD_SIZE; col++) {
                this.ctx.clearRect(row*BLOCK_SIZE+1, col*BLOCK_SIZE+1, BLOCK_SIZE-1, BLOCK_SIZE-1);
            }
        }
        for (let row=0; row<BOARD_SIZE; row++) {
            for (let col=0; col<BOARD_SIZE; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }

    isFill() {
        for (let row=0; row<BOARD_SIZE; row++) {
            for (let col=0; col<BOARD_SIZE; col++) {
                if (this.grid[row][col]===0) {
                    return false;
                }
            }
        }
        return true;
    }

    generateRandomNumber() {
        if (!this.isFill()) {
            let randomNumber = (Math.random()>0.5) ? 2 : 4;
            let randomRow;
            let randomCol;
            do {
                randomRow = Math.floor(Math.random() * 4);
                randomCol = Math.floor(Math.random() * 4);
            } while (this.grid[randomRow][randomCol]);
            this.updateBoard(randomCol, randomRow, randomNumber);
            this.drawCell(randomCol, randomRow, randomNumber);
        }
    }

    updateBoard(x, y, num) {
        this.grid[y][x] = num;
    }

    moveDown() {
        let checkArray = this.generateWhiteBoard();
        let canMove = 0;
        for (let row=BOARD_SIZE-2; row>=0; row--) {
            for (let col=0; col<BOARD_SIZE; col++) {
                if (this.grid[row][col] === 0) {
                    continue;
                }
                let i = row+1;
                let j = col;
                while (this.grid[i][j] === WhiteID || this.grid[i][j] === this.grid[i-1][j]) {
                    canMove = 1;
                    if (this.grid[i][j] === WhiteID) {
                        this.updateBoard(j, i, this.grid[i-1][j]);
                        this.updateBoard(j, i-1, WhiteID);
                    } else if (this.grid[i][j] === this.grid[i-1][j] && !checkArray[i][j]) {
                        score += this.grid[i-1][j] + this.grid[i][j];
                        this.updateBoard(j, i, this.grid[i-1][j] + this.grid[i][j]);
                        this.updateBoard(j, i-1, WhiteID);
                        checkArray[i][j] = 1;
                        break;
                    }
                    if (i===BOARD_SIZE-1) {
                        break;
                    }
                    i++;
                } 
            }
        }
        if (canMove) {
            this.drawBoard();
            this.generateRandomNumber();
            scoreSpan.innerText = score;
        }
    }

    moveUp() {
        let checkArray = this.generateWhiteBoard();
        let canMove = 0;
        for (let row=1; row<BOARD_SIZE; row++) {
            for (let col=0; col<BOARD_SIZE; col++) {
                if (this.grid[row][col] === 0) {
                    continue;
                }
                let i = row-1;
                let j = col;
                while (this.grid[i][j] === WhiteID || this.grid[i][j] === this.grid[i+1][j]) {
                    canMove = 1;
                    if (this.grid[i][j] === WhiteID) {
                        this.updateBoard(j, i, this.grid[i+1][j]);
                        this.updateBoard(j, i+1, WhiteID);
                    } else if (this.grid[i][j] === this.grid[i+1][j] && !checkArray[i][j]) {
                        score += this.grid[i+1][j] + this.grid[i][j];
                        this.updateBoard(j, i, this.grid[i+1][j] + this.grid[i][j]);
                        this.updateBoard(j, i+1, WhiteID);
                        checkArray[i][j] = 1;
                        break;
                    }
                    if (i===0) {
                        break;
                    }
                    i--;
                }
            }
        }
        if (canMove) {
            this.drawBoard();
            this.generateRandomNumber();
            scoreSpan.innerText = score;
        }
    }

    moveRight() {
        let checkArray = this.generateWhiteBoard();
        let canMove = 0;
        for (let row=0; row<BOARD_SIZE; row++) {
            for (let col=BOARD_SIZE-2; col>=0; col--) {
                if (this.grid[row][col] === 0) {
                    continue;
                }
                let i = row;
                let j = col+1;
                while (this.grid[i][j] === WhiteID || this.grid[i][j] === this.grid[i][j-1]) {
                    canMove = 1;
                    if (this.grid[i][j] === WhiteID) {
                        this.updateBoard(j, i, this.grid[i][j-1]);
                        this.updateBoard(j-1, i, WhiteID);
                    } else if (this.grid[i][j] === this.grid[i][j-1] && !checkArray[i][j]) {
                        score += this.grid[i][j-1] + this.grid[i][j];
                        this.updateBoard(j, i, this.grid[i][j-1] + this.grid[i][j]);
                        this.updateBoard(j-1, i, WhiteID);
                        checkArray[i][j] = 1;
                        break;
                    }
                    if (j===BOARD_SIZE-1) {
                        break;
                    }
                    j++;
                }
            }
        }
        if (canMove) {
            this.drawBoard();
            this.generateRandomNumber();
            scoreSpan.innerText = score;
        }
    }

    moveLeft() {
        let checkArray = this.generateWhiteBoard();
        let canMove = 0;
        for (let row=0; row<BOARD_SIZE; row++) {
            for (let col=1; col<BOARD_SIZE; col++) {
                if (this.grid[row][col] === 0) {
                    continue;
                }
                let i = row;
                let j = col-1;
                while (this.grid[i][j] === WhiteID || this.grid[i][j] === this.grid[i][j+1]) {
                    canMove = 1;
                    if (this.grid[i][j] === WhiteID) {
                        this.updateBoard(j, i, this.grid[i][j+1]);
                        this.updateBoard(j+1, i, WhiteID);
                    } else if (this.grid[i][j] === this.grid[i][j+1] && !checkArray[i][j]) {
                        score += this.grid[i][j+1] + this.grid[i][j];
                        this.updateBoard(j, i, this.grid[i][j+1] + this.grid[i][j]);
                        this.updateBoard(j+1, i, WhiteID);
                        checkArray[i][j] = 1;
                        break;
                    }
                    if (j===0) {
                        break;
                    }
                    j--;
                }
            }
        }
        if (canMove) {
            this.drawBoard();
            this.generateRandomNumber();
            scoreSpan.innerText = score;
        }
    }
}

let board = new Board(ctx);
board.drawBoard();

playBtn.addEventListener('click', function(e) {
    playing = 1;
    board.reset();
})

document.addEventListener('keyup', function(e) {
    switch (e.code) {
        case 'ArrowDown':
            board.moveDown();
            break;
        case 'ArrowUp':
            board.moveUp();
            break;
        case 'ArrowRight':
            board.moveRight();
            break;
        case 'ArrowLeft':
            board.moveLeft();
            break;
        default:
            break;
    }
})

