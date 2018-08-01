/**
 * Creates a process step using a temp.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function crtProcess(x, y, w, h) {
    ProcessStep.processMain('test' + ID_COUNTER, x, y, w, h);
}

/**
 * Unbinds various things, w can be used to determine what to unbind
 *
 * @param {number} w
 */
function unbind(w) {
    if (DRAW_RECT === true) {
        DRAW_RECT = false;
        $("#rectbutton").css("color","black"); //button turns black again when clicked
    } 
    if (SELECT_ELEM === true && w !== 'nselect') { //nselect makes sure select doesnt get unbound if it is bound
        SELECT_ELEM = false;
        $("#selectbutton").css("color","black"); //button turns black again when clicked
    } 
}

/**
 * Handles events of the different elements.
 *
 * @param elSet
 */
function elementHandler(elSet) {
    elSet[0].drag(dragMove, dragStart, dragUp); //enables dragging with the drag functions
    elSet.click(function (e) {
        unbind('nselect'); //nselect makes sure select doesnt get unbound if it is bound
        console.log("clicked:" + $(elSet[0].node).attr('id'));
    })
}

/**
 * Creates the element set with various extra elements like name
 *
 * @param {number} x
 * @param {number} y
 * @param element
 * @param {string} name
 * @param elSet
 */
function setCreator(x, y, element, name, elSet) {
    var nameEl = paper.text(x + 1/2 *RECT_WIDTH,y + 1/2 *RECT_HEIGHT,name);
    var stepEl = paper.text(x + 7/8 *RECT_WIDTH,y + 7/8 *RECT_HEIGHT,"A" + ID_COUNTER);
    elSet.push (element, nameEl, stepEl);
    element.nameEl = nameEl; //nameEl is paired to element, so if you move element they both move, see dragMove
    element.stepEl = stepEl;
    console.log(elSet);
    $(elSet[0].node).attr('id',"rect " + ID_COUNTER);//gives the element node an ID.
    ID_COUNTER += 1;
    console.log("set made with id:" + $(element.node).attr('id'));
}

// functions used for dragging objects
/**
 * dragMove will be called with dx and dy
 *
 * @param {number} dx
 * @param {number} dy
 */
function dragMove(dx, dy) {
    var nowX = Math.min(PAPER_HEIGHT, this.ox + dx);
    var nowY = Math.min(PAPER_WIDTH, this.oy + dy);
    nowX = Math.max(0, nowX);
    nowY = Math.max(0, nowY);
    this.attr({
        x: nowX,
        y: nowY
    });
    this.nameEl.attr({
        x: nowX + 1/2 * RECT_WIDTH,
        y: nowY + 1/2 * RECT_HEIGHT
    });
    this.stepEl.attr({
        x: nowX + 7/8 * RECT_WIDTH,
        y: nowY + 7/8 * RECT_HEIGHT
    });
}

/**
 * Storing original coordinates
 */
function dragStart() {
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({
        opacity: 0.75
    }, 150);
}

/**
 * Restoring state
 */
function dragUp() {
    this.animate({
        opacity: .5
    }, 250);
    console.log("moved:" + $(this.node).attr('id'));
}
