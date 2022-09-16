function invertList(list) {
    let inverted = [];
    for (let i = 0; i < list[0].length; i++) {
        let column = [];
        for (const j of list) {
            column.push(j[i])
        }
        inverted.push(column);
    }
    return inverted;
}

class Grid {
    constructor(position, resolution, default_color, flags) {
      
    
        this.pos = position;
        this.resolution = resolution;
        this.default_color = default_color;
        this.flags = flags;
        this.grid=[];

        // generate empty grid
        for (let i = 0; i < resolution[0]; i++) {
          
            let row=[];
            for (let j = 0; j < resolution[1]; j++) {
                row.push(default_color)
            }
            this.grid.push(row);
        }
    }
    clearRow(row) {
        // generate empty row
        let empty_row = [];
        for (let i = 0; i < this.resolution[0]; i++) {
            empty_row.push(this.default_color);
        }
        let rotatedGrid = invertList(this.grid);

        // clears row, and pushes every row down and empties top row
        rotatedGrid[row] = empty_row;
        for (let i = row; i > 1; i--) {
            rotatedGrid[i] = rotatedGrid[i-1];
        }
        rotatedGrid[0] = empty_row;
        this.grid = invertList(rotatedGrid);
    }
    clearCheck() {
        let clears = [];

        let rotatedGrid = [];
        for (let i = 0; i < this.grid[0].length; i++) {
            let column = [];
            for (const j of this.grid) {
                column.push(j[i])
            }
            rotatedGrid.push(column);
        }
        // loop through each row, if the row has any blank tiles then it isnt cleared (append if it is cleared)
        for (let i = 0; i < rotatedGrid.length; i++) {
            let full = true;
            for (const cell of rotatedGrid[i]) {
                if (cell == this.default_color) {
                    full = false
                }
            }
            if (full) { 
                clears.push(i)
            }
        }
        return clears;
    }
    validatePosition(tetronimo, input_vec) {
        for (const i of tetronimo.tiles) {
            let x = int(tetronimo.position[0]+i[0] - this.pos[0]);
            let y = int(tetronimo.position[1]+i[1] - this.pos[0]);
            let p = [x,y];
            
            // if any points are out of the bounds !!not valid!!
            if ( (p[0] < 0) || (p[0] >= this.resolution[0])) {
                this.flags["wallHit"] = true;
                if (input_vec[0] == 0 && input_vec[1] == 1) {
                  tetronimo.activeTimer = true;
                }
                return false;
            
            } else if (p[1] < 0 || p[1] >= this.resolution[1]) {
                if (input_vec[0] == 0 && input_vec[1] == 1) {
                  tetronimo.activeTimer = true;
                }
                return false;
            }
            // if any tiles already exist in that positon !!not valid!!
            else if (this.grid[x][y] != this.default_color) {
              if (input_vec[0] == 0 && input_vec[1] == 1) {
                tetronimo.activeTimer = true;
              }
                return false;
            }
        }
        tetronimo.activeTimer = false;
        return true;
    }
    render(surface, scale) {
        const Width = this.resolution[0]*scale[0]
        const Height = this.resolution[1]*scale[1]
        
        fill(this.default_color);
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
                 scale[1]);
              
              if (this.grid[i][j] != this.default_color) {
                // fill(0)
                //     rect(
                //       (this.pos[0]+i)*scale[0],
                //        (this.pos[1]+j)*scale[1],
                //        scale[0],
                //        scale[1]);
                }
          fill(0);

             }
        }
    }
        
    changeCell(pos, c) {
        this.grid[pos[1]][pos[0]] = c;
    }

    // find real pos of all tiles and then set the colour in the grid to that
    commitTetronimo(tetronimo, grid_offset) {
        for (const p of tetronimo.tiles) {
            const pos = tetronimo.position;
            const x = int(pos[0] + p[0] - grid_offset[0]);
            const y = int(pos[1] + p[1] - grid_offset[1]);
            this.grid[x][y] = tetronimo.color;
        }
    } 
    // when the print function is called, this function will be used
    str() {
        string = ""
        for (const i of this.grid) {
            for (const j of i) {
                string += ` ${j} `;
            }
            string += "\n"
            
        return string
        }
    }
}
