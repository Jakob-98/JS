
function crtProcess(x,y,w,h) { //creates a process step using a temp
    tempBox =  new ProcessStep();
    tempBox.drawRect('test' + ID_COUNTER,x,y,w,h);
    //tempBox.drawName(x + 1/2 *RECT_WIDTH,y + 1/2 *RECT_HEIGHT,"test");
 }

function unbind(w) { //unbinds various things, w can be used to determine what to unbind
    if (DRAW_RECT == true) {
        DRAW_RECT = false;
        $("#rectbutton").css("color","black")//button turns black again when clicked
    } 
    if (SELECT_ELEM == true && w != 'nselect') { //nselect makes sure select doesnt get unbound if it is bound
        SELECT_ELEM = false;
        $("#selectbutton").css("color","black")//button turns black again when clicked
    } 
}

function elementHandler(elSet) { //handles events of the different elements.
    elSet[1].drag(dragMove, dragStart, dragUp); //enables dragging with the drag functions
    elSet.click(function (e) {
        unbind('nselect'); //nselect makes sure select doesnt get unbound if it is bound
        console.log("clicked:" + $(elSet[1].node).attr('id'))
    })
}

function selectElements () {
    unbind();
    var tempset = new paper.set();
}

// functions used for dragging objects
// 
function dragMove (dx, dy) { //dragMove will be called with dx and dy
    nowX = Math.min(PAPER_HEIGHT, this.ox + dx);
    nowY = Math.min(PAPER_WIDTH, this.oy + dy);
    nowX = Math.max(0, nowX);
    nowY = Math.max(0, nowY);            
    this.attr({x: nowX, y: nowY });
    this.pair.attr({x: nowX + 1/2 * RECT_WIDTH , y: nowY + 1/2 * RECT_HEIGHT});
}

function dragStart () { //storing original coordinates
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.attr({opacity: 1});
}

function dragUp () { //restoring state
    this.attr({opacity: .5});
    console.log("moved:" + $(this.node).attr('id'))
}
//
// end of functions used for dragging objects