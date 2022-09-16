function randomPiece() {
    let options = ["i","l","j","o","s","z","t"];
    let choice = options[Math.floor(Math.random()*options.length)];
    let pos = [5, 2];
    if (choice == "i" || choice == "o")
        pos = [5.5, 1.5]
    return new Tetronimo(choice, pos);
}

class GameWindow {
    constructor(resolution, flags) {
        this.active = false;
        this.flags = flags;
        this.activePiece = randomPiece();
        this.timer = 0;
        this.scale_vec = [1/19*resolution[0],1/19*resolution[1]];
        this.grid = new Grid([1,1], [10,15], [190,220,240], flags);
        this.bgcolor = [200, 230, 255];
        this.running = true;

        this.score = 0;
        this.scoreboard = new TextLabel([200,200,220], this.score.toString(), [255, 0, 0], [300, 50, 150, 25], true);
    }
    start() {
        this.active = true;
    }

    setScore(score) {
        this.score = score;
        this.scoreboard.changeText([255, 0, 0], score.toString());
    }
  
    update(dt) {
        if (!this.active)
            return;
        if (this.timer >= 1) {
            this.activePiece.move([0,1], this.grid);
            this.timer = 0;
        }
    
        if ((this.activePiece.timer >= this.activePiece.timerLimit) || this.activePiece.timerLimit <= 0) {
            this.grid.commitTetronimo(this.activePiece, [1,1]);
            this.activePiece = randomPiece();
            if (!this.grid.validatePosition(this.activePiece, [0, 0]))
                this.flags["gameOver"] = true
        }

        const clears = this.grid.clearCheck();
        for (const line of clears) {
            this.grid.clearRow(line);
        }
        if (clears.length > 0 && clears.length < 4) {
            this.flags["lineClear"] = true;
        } else if (clears.length == 4) {
            this.flags["tetris"] = true;
        }
        if (clears.length > 0) {
            const scores = [100, 300, 500, 800];
            this.setScore(this.score+scores[clears.length-1]);
        }
        this.timer += 1/15;
        if (this.activePiece.activeTimer) {
            this.activePiece.timer += 1/15;
        }
    }
    userInput(keys) {
        if (!this.active)
            return;

        const bound_actions = {
            [37]: ["move", [-1, 0]],
            [39]: ["move", [1, 0]],
            [40]: ["move", [0, 1]],
            [68]: ["rotate", 1],
            [65]: ["rotate", -1]
        }

        for (const k in keys) {
            if (keys[k].state) {
                if (bound_actions[k][0] == "move") {
                    this.activePiece.move(bound_actions[k][1], this.grid);
                } else if (bound_actions[k][0] == "rotate") {
                    this.activePiece.rotate(bound_actions[k][1], this.grid)
                }
                if (keys[k].should_reset)
                    keys[k].state = false;
            }
        }
    }
    render(screen) {
        if (!this.active)
            return;
        screen.background(this.bgcolor);
        this.grid.render(screen, this.scale_vec);
        this.activePiece.render(screen, this.scale_vec);
        this.scoreboard.render(screen);
    }
}