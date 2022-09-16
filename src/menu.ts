import { Tetris_image } from "./main.js"
import { TextButton } from "./ui.js"

export class Menu {
    active: boolean
    bgColor: [number, number, number]
    tImage: any
    buttonDict: object


    constructor() {
        this.active = true;

        this.bgColor = [200, 230, 255];
        this.tImage = Tetris_image;
       
        const playButton    = new TextButton([100, 275, 300, 50], [200, 200, 220], [55, 55, 55], "Play Game", true, false);
        const optionsButton = new TextButton([100, 350, 300, 50], [200, 200, 220], [55, 55, 55], "Options", true, false);
        const exitButton    = new TextButton([175, 425, 150, 50], [200, 200, 220], [55, 55, 55], 'Exit', true, false);

        this.buttonDict = {
            play: playButton,
            options: optionsButton,
            exit: exitButton
        };
    }

    checkButtons(mousePos: [number, number]) {
        const buttons = {
            play: false,
            options: false,
            exit: false
        }

        for (const name in this.buttonDict) {
            if (this.buttonDict[name].check(mousePos))
                buttons[name] = true;
        }
        
        return buttons;
    }

    render(screen) {
      if (!this.active)
        return;

      screen.background(...this.bgColor);
      image(Tetris_image, 178, 50);
      for (const name in this.buttonDict) {
        this.buttonDict[name].render(screen);
      }
    }
  
    close() {
        this.active = false;
        for (const name in this.buttonDict) {
            this.buttonDict[name].visible = false;
        }
    }
}