/**
 * CLASS ProcessStep (aka a rectangle)
 */
class ProcessStep
{
    /**
     * Processstep draws itself, when drawing itself it creates an element
     *
     * @param name
     * @param x
     * @param y
     * @param w
     * @param h
     */
    static processMain(name, x, y, w, h) {
        var element = paper.rect(x,y,w,h);//this element is used for various things. 
        element.attr({
            stroke: "#000000",
            fill: "gray",
            opacity: 0.5,
            cursor: "pointer"
        });

        var elSet = new paper.set();
        setCreator(x, y, element, name, elSet);

        elementHandler(elSet); //handles various events for the element
    }
}

/**
 * Class MOUSEMANAGER
 */
class MouseManager {
    // TODO: add lastXDown etc functionality to mousemanager
    // constructor(name, lastXDown, lastYDown, lastXUp, lastYUp) {
    //     this.name = name,
    //     lastXDown = 0;
    //     lastYDown = 0;
    //     lastXUp = 0;
    //     lastYUp = 0;
    // }

    /**
     * Used to call the current Xposition of mouse relative to the canvas during an event
     *
     * @param e
     * @returns {number}
     */
     posX(e) {
        var offset = $("#svg_paper").offset();//Q! is this clean code to put offset here?
        return e.pageX - offset.left
     }

    /**
     * Used to call the current Yposition of mouse relative to the canvas during an event
     *
     * @param e
     * @returns {number}
     */
     posY(e) {
        var offset = $("#svg_paper").offset();
        return e.pageY - offset.top
     }
}
