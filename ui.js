class Label {
    // shared properties for any Label
    constructor(bgColor, Text, Rect, visible=true) {
      this.text = Text;
      this.bgColor = bgColor;
      this.rect = Rect;
      this.visible = visible;
    }
    
    render(surface) {
      if (this.visible) {
          fill(...this.bgColor);
          rect(...this.rect);
          fill(0);
          textSize(this.rect[3]/2);
          textAlign(CENTER);
          text(this.text, this.rect[0] + this.rect[2]/2, this.rect[1] + this.rect[3]/2 + 5);
          // image(this.texture, this.rect[0], this.rect[1]);
      }
    }
}

class TextLabel extends Label {
    constructor(bgColor, Text, text_color, Rect, visible=true) {
      super(bgColor, Text, Rect, visible);
    }
    changeText(text_color, Text) {
      this.text = Text;
    }
}

class Button extends Label {
    constructor(bgColor, Text, Rect, visible=true, toggleable=false) {
        super(bgColor, Text, Rect, visible);
        this.toggleable = toggleable;
        this.state = false;
    }

    check(mousePos) {
        let [x, y, w, h] = this.rect;
        if (!this.visible) {

            return false;
        }
        if ((x <= mousePos[0] && mousePos[0] <= x+w) && (y <= mousePos[1] && mousePos[1] <= y+h)) {
            if (this.toggleable) {
                this.state = !this.state;
            } else {
                return true;
            }
        }
        return this.state;
    }
}
  
class TextButton extends Button {
    constructor(Rect, bgColor, text_color, Text, visible=true, toggleable=false) {
      super(bgColor, Text, Rect, visible, toggleable);
    }
    changeText(text_color, Text) {
      this.text = Text;
    }
}



