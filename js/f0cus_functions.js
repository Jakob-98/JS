
function crtProcess(x,y,w,h) { //creates a process step using a temp
    ProcessStep.processMain('test' + ID_COUNTER,x,y,w,h);
 }



function elementHandler(elSet) { //handles events of the different elements.
    elSet[0].drag(dragMove, dragStart, dragUp); //enables dragging with the drag functions
    elSet.click(function (e) {
        resetStateAll();
        console.log("clicked:" + this.setName)
    })
}


function setCreator (x,y,element,name,elSet) { //creates the element set with various extra elements like name
    var nameEl = paper.text(x + 1/2 *RECT_WIDTH,y + 1/2 *RECT_HEIGHT,name);
    var stepEl = paper.text(x + 7/8 *RECT_WIDTH,y + 7/8 *RECT_HEIGHT,"A" + ID_COUNTER);
    elSet.push (element, nameEl, stepEl);
    for (i in elSet) {
        elSet[i].setName = "setNr" + ID_COUNTER
    }
    element.nameEl = nameEl; //nameEl is paired to element, so if you move element they both move, see dragMove
    element.stepEl = stepEl;
    console.log(elSet);
    $(elSet[0].node).attr('id',"rect " + ID_COUNTER);//gives the element node an ID.
    ID_COUNTER += 1;
    console.log("set made with id:" + element.setName);
}

// functions used for dragging objects
// 
function dragMove (dx, dy) { //dragMove will be called with dx and dy
    nowX = Math.min(PAPER_HEIGHT, this.ox + dx);
    nowY = Math.min(PAPER_WIDTH, this.oy + dy);
    nowX = Math.max(0, nowX);
    nowY = Math.max(0, nowY);            
    this.attr({x: nowX, y: nowY });
    this.nameEl.attr({x: nowX + 1/2 * RECT_WIDTH , y: nowY + 1/2 * RECT_HEIGHT});
    this.stepEl.attr({x: nowX + 7/8 * RECT_WIDTH , y: nowY + 7/8 * RECT_HEIGHT});
}

function dragStart () { //storing original coordinates
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({opacity: 0.75}, 150);
}

function dragUp () { //restoring state
    this.animate({opacity: .5}, 250);
    console.log("moved:" + this.setName)
}
//
// end of functions used for dragging objects

function selectionCrt(e) {
    var box;
    var selections = paper.set();
}