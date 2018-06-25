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
        lastXDown = 0; // TO DO add lastXDown tec functionality to mousemanager
        lastYDown = 0;
        lastXUp = 0;
        lastYUp = 0;
    } 
     
     posX(e) {
        var offset = $("#svg_paper").offset();
        var mouseDownX = e.pageX - offset.left;
        return mouseDownX
     }
     posY(e) {
        var offset = $("#svg_paper").offset();
        var mouseDownY = e.pageY - offset.top;
        return mouseDownY
     }
}