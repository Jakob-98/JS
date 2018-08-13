//main JS file project


$(function($){//adding click functionality to the buttons, these clickevents should be moved, but not sure where yet.
    $("#clearbutton").click(function() {
        paper.clear();
    })
    $("#unbindbutton").click(function() {
        unbind();
    })
    $("#selectbutton").click(function() {
        unbind();
        if (SELECT_ELEM == false) {
            SELECT_ELEM = true;
            $("#selectbutton").css("color","blue")
        } 
    })
    $("#rectbutton").click(function() {
        unbind();
        if (DRAW_RECT == false) {
            DRAW_RECT = true;
            $("#rectbutton").css("color","blue")
        } 
    })

})
    


//Initialization
window.onload = function() {
    paper = Raphael("svg_paper", PAPER_HEIGHT, PAPER_WIDTH);
    MOUSE = new MouseManager();
    MODEL = new Model();
    A0 = new Process(null);
    CONTEXT = new Process(null);
    PAPER_OFFSET =  $("#svg_paper").offset();

    $("#svg_paper").mousedown(function(e) {
        MOUSE.mouseDown(e);
    });
    $("#svg_paper").mouseup(function(e) {
        MOUSE.mouseUp(e);
    });
    $("#svg_paper").mousemove(function(e) {
        MOUSE.mouseMove(e);
    });
}



