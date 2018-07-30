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
    constructor(name,x,y,w,h) {
        super(name,x,y,w,h);
    }
    drawRect(name,x,y,w,h) { //processstep draws itself, when drawing itself it creates an element, 
        var element = paper.rect(x,y,w,h);//this element is used for various things. 
        element.attr({
            stroke: "#000000",
            fill: "gray",
            opacity: 0.5,
            cursor: "pointer"
        });
        var nameEl = paper.text(x + 1/2 *RECT_WIDTH,y + 1/2 *RECT_HEIGHT,name);
        var elSet = new paper.set();
        elSet.push (nameEl, element);
        console.log(elSet);
        //elSet.attr({"id":"set number" = ID_COUNTER});
        $(element.node).attr('id',"rect " + ID_COUNTER);//gives the element node an ID.
        ID_COUNTER += 1;

        // console.log("rectangle made with id:" + elSet.attr("id"));
        console.log("set made with id:" + $(element.node).attr('id'));
        elementHandler(elSet); //handles various events for the element
        return element; //returns the element Q! should I put the eventhandler and the element in this order?
    }
    // drawName(x,y,name) {
    //     var name = paper.text(x,y,name);
    // }
}
//CLASS ProcessLink (not used at this time)
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
