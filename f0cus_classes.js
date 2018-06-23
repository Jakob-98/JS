// F0CUS CLASS DEFINITIONS

// CLASS ObjectWithXYWH (any drawable object)
class ObjectWithXYWH {
    constructor(name,x,y,w,h) {
      this.name = name;
      this.x = x;
    }
    draw(x,y,w,h) {
        paper.rect(x,y,w,h);
    }
}

//CLASS ProcessStep
class ProcessStep extends ObjectWithXYWH {
    constructor(name) {
        this.name = name;
    }
    draw() {
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
    constructor(name) {
        this.name = name;
    } 
}