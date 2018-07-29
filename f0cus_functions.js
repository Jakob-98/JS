
function crtProcess(x,y,w,h) { //creates a process step using a temp
    tempBox =  new ProcessStep();
    tempBox.drawRect(x,y,w,h);
 }

function unbind() { //unbinds various things
    if (DRAW_RECT == true) {
        DRAW_RECT = false;
        $("#rectbutton").css("color","black")
    } 
}

function elementHandler(element) { //handles events of the different elements.
    element.drag(dragMove, dragStart, dragUp); //enables dragging with the drag functions
    element.click(function (e){
        unbind();
        console.log("clicked:" + $(element.node).attr('id'))
    })
    
}

function dragMove (dx, dy) { //dragMove will be called with dx and dy
    nowX = Math.min(PAPER_HEIGHT, this.ox + dx);
    nowY = Math.min(PAPER_WIDTH, this.oy + dy);
    nowX = Math.max(0, nowX);
    nowY = Math.max(0, nowY);            
    this.attr({x: nowX, y: nowY });
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