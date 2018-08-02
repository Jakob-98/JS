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

//CLASS ProcessStep (aka a rectangle)
class ProcessStep extends ObjectWithXYWH {
    constructor(name,x,y,w,h) { //Q! this constructor does nothing atm, should the extends just be removed? 
        super(name,x,y,w,h);
    }
    static processMain(name,x,y,w,h) { //processstep draws itself, when drawing itself it creates an element, 
        var element = paper.rect(x,y,w,h);//this element is used for various things. 
        element.attr({
            stroke: "#000000",
            fill: "gray",
            opacity: 0.5,
            cursor: "pointer"
        });

        var elSet = new paper.set();
        setCreator(x,y,element,name,elSet);

        elementHandler(elSet); //handles various events for the element

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
        return e.pageX - offset.left;
     }
     posY(e) {//used to call the current Yposition of mouse relative to the canvas during an event
        var offset = $("#svg_paper").offset();
        return e.pageY - offset.top;
     }
}
