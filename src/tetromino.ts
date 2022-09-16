import { Grid } from "./grid.js";
import { Piece } from "./piece.js";

const patterns = {
    [Piece.I]: [[[0.5,-0.5],[1.5,-0.5],[-0.5,-0.5],[-1.5,-0.5]],[0,220,255]],
    [Piece.L]: [[[0,0],[-1,0],[1,0],[1,-1]],[255,70,0]],
    [Piece.J]: [[[0,0],[1,0],[-1,0],[-1,-1]],[20,0,255]],
    [Piece.O]: [[[-0.5,0.5],[-0.5,-0.5],[0.5,0.5],[0.5,-0.5]],[240,255,0]],
    [Piece.S]: [[[0,0],[0,-1],[-1,0],[1,-1]],[26,255,0]],
    [Piece.Z]: [[[0,0],[0,-1],[1,0],[-1,-1]], [255,0,0]],
    [Piece.T]: [[[0,0],[1,0],[-1,0],[0,-1]], [100,0,255]]
}

function matrixMult(matrix: [[number, number], [number, number]], vector: [number, number]): [number, number] {
  return [
    matrix[0][0]*vector[0] + matrix[0][1]*vector[1],
    matrix[1][0]*vector[0] + matrix[1][1]*vector[1]
  ];
}

export class Tetronimo {
    type: Piece
    position: [number, number]
    tiles: [number, number][]
    color: [number, number, number]
    activeTimer: boolean
    timerLimit: number
    timer: number

     constructor(type, position) {
        this.position = position;
        this.tiles = patterns[type][0];
        this.color = patterns[type][1];

        this.activeTimer = false;
        this.timerLimit = 0.25;
        this.timer = 0;
     }

    move(vec: [number, number], grid: Grid): void {
        this.position[0] += vec[0];
        this.position[1] += vec[1];
        if (!(grid.validatePosition(this, vec))) {
            this.position[0] -= vec[0];
            this.position[1] -= vec[1];
        } else if (this.activeTimer) {
            this.timer = 0;
            this.timerLimit -= 0.025;
        }
    }

    rotate(direction: -1 | 1, grid) {
        const matrix = [
            [0, -direction], 
            [direction, 0]
        ] as [[number, number], [number, number]];
        
        const newTiles = [] as [number, number][];
        // apply 2d rotation matrix to every point (works because they are all relative)
        for (let i = 0; i < this.tiles.length; i++) {
            const vec = this.tiles[i];
            const new_vec = matrixMult(matrix, vec);
            newTiles.push(new_vec);
        }

        const previous = [...this.tiles] //this.tiles.copy();
        this.tiles = newTiles;

        if (!grid.validatePosition(this, [0, 0])) {
            this.tiles = previous;
        }
    }

    render(surface, scale: [number, number]) {
        const pos = this.position;
        for (const tile of this.tiles) {
          fill(...this.color);
          surface.rect([(pos[0]+tile[0])*scale[0],
                          (pos[1]+tile[1])*scale[1], 
                          scale[0],
                          scale[1]]);

          surface.rect([(pos[0]+tile[0])*scale[0],
                          (pos[1]+tile[1])*scale[1], 
                          scale[0],
                          scale[1]]);
        }
    }
}


