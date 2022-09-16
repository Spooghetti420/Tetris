import { Tetronimo } from "./tetromino.js";

function invertList<T>(list: T[][]): T[][] {
    let inverted: T[][] = [];
    for (let i = 0; i < list[0].length; i++) {
        let column: T[] = [];
        for (const j of list) {
            column.push(j[i]);
        }
        inverted.push(column);
    }
    return inverted;
}

export class Grid {
    private pos: [number, number]
    private resolution: [number, number]
    private defaultColor: [number, number, number]
    private flags: object
    private grid: [number, number, number][][]

    constructor(position: [number, number], resolution: [number, number], defaultColor: [number, number, number], flags: object) {
      
    
        this.pos = position;
        this.resolution = resolution;
        this.defaultColor = defaultColor;
        this.flags = flags;
        this.grid = [] as [number, number, number][][];

        // generate empty grid
        for (let i = 0; i < resolution[0]; i++) {
          
            let row: [number, number, number][] = [];
            for (let j = 0; j < resolution[1]; j++) {
                row.push(defaultColor);
            }
            this.grid.push(row);
        }
    }

    clearRow(row: number) {
        // generate empty row
        const emptyRow = [] as  [number, number, number][];
        for (let i = 0; i < this.resolution[0]; i++) {
            emptyRow.push(this.defaultColor);
        }

        const rotatedGrid = invertList(this.grid);

        // clears row, and pushes every row down and empties top row
        rotatedGrid[row] = emptyRow;
        for (let i = row; i > 1; i--) {
            rotatedGrid[i] = rotatedGrid[i-1];
        }
        rotatedGrid[0] = emptyRow;
        this.grid = invertList(rotatedGrid);
    }

    clearCheck() {
        const clears = [] as number[];

        const rotatedGrid = [] as [number, number, number][][];
        for (let i = 0; i < this.grid[0].length; i++) {
            let column = [] as [number, number, number][];
            for (const j of this.grid) {
                column.push(j[i])
            }
            rotatedGrid.push(column);
        }
        
        // loop through each row, if the row has any blank tiles then it isnt cleared (append if it is cleared)
        for (let i = 0; i < rotatedGrid.length; i++) {
            let full = true;
            for (const cell of rotatedGrid[i]) {
                if (cell == this.defaultColor) {
                    full = false;
                }
            }
            if (full) { 
                clears.push(i)
            }
        }
        return clears;
    }

    validatePosition(tetronimo: Tetronimo, inputVec: [number, number]) {
        for (const i of tetronimo.tiles) {
            const x = Math.floor(tetronimo.position[0]+i[0] - this.pos[0]);
            const y = Math.floor(tetronimo.position[1]+i[1] - this.pos[0]);
            const p = [x, y];
            
            // if any points are out of the bounds !!not valid!!
            if ((p[0] < 0) || (p[0] >= this.resolution[0])) {
                this.flags["wallHit"] = true;
                if (inputVec[0] == 0 && inputVec[1] == 1) {
                  tetronimo.activeTimer = true;
                }
                return false;
            
            } else if (p[1] < 0 || p[1] >= this.resolution[1]) {
                if (inputVec[0] == 0 && inputVec[1] == 1) {
                  tetronimo.activeTimer = true;
                }
                return false;
            }
            // if any tiles already exist in that positon !!not valid!!
            else if (this.grid[x][y] != this.defaultColor) {
              if (inputVec[0] == 0 && inputVec[1] == 1) {
                tetronimo.activeTimer = true;
              }
                return false;
            }
        }
        tetronimo.activeTimer = false;
        return true;
    }

    render(scale: [number, number]) {
        const Width = this.resolution[0]*scale[0]
        const Height = this.resolution[1]*scale[1]

        fill(this.defaultColor);
        rect(this.pos[0]*scale[0], 
                this.pos[1]*scale[1], 
                Width, 
                Height);
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                fill(this.grid[i][j]);
                rect(
                    (this.pos[0]+i)*scale[0],
                    (this.pos[1]+j)*scale[1], 
                    scale[0], 
                    scale[1]
                );
            }
        }
    }

    changeCell(pos: [number, number], c: [number, number, number]) {
        this.grid[pos[1]][pos[0]] = c;
    }

    // find real pos of all tiles and then set the colour in the grid to that
    commitTetronimo(tetronimo: Tetronimo, grid_offset: [number, number]) {
        for (const p of tetronimo.tiles) {
            const pos = tetronimo.position;
            const x = Math.floor(pos[0] + p[0] - grid_offset[0]);
            const y = Math.floor(pos[1] + p[1] - grid_offset[1]);
            this.grid[x][y] = tetronimo.color;
        }
    } 
}
