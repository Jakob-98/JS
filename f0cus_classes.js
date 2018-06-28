// F0CUS CLASS DEFINITIONS

// CLASS ObjectWithXYWH (any drawable object)
class ObjectWithXYWH {
    constructor(name,x,y,w,h) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
}

//CLASS ProcessStep
class ProcessStep extends ObjectWithXYWH {
    constructor(name,x,y,w,h) {
        super(name,x,y,w,h);
    }
    draw(x,y,w,h) {
        paper.rect(x,y,w,h);
    }
}
//CLASS ProcessLink
class ProcessLink extends ObjectWithXYWH {
    constructor(name) {
        this.name = name;
    }
}

// CLASS MOUSEMANAGER
class MouseManager {
    constructor(name, lastXDown, lastYDown, lastXUp, lastYUp) {
        this.name = name,
        lastXDown = 0; // TO DO add lastXDown etc functionality to mousemanager
        lastYDown = 0;
        lastXUp = 0;
        lastYUp = 0;
    } 
     
     posX(e) {//used to call the current Xposition of mouse relative to the canvas during an event
        var offset = $("#svg_paper").offset();//Q! is this clean code to put offset here?
        var mouseDownX = e.pageX - offset.left;
        return mouseDownX
     }
     posY(e) {//used to call the current Yposition of mouse relative to the canvas during an event
        var offset = $("#svg_paper").offset();
        var mouseDownY = e.pageY - offset.top;
        return mouseDownY
     }
}
