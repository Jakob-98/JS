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
    $("#svg_paper").click(function(e) {
        if (DRAW_RECT == true) {
            crtProcess(MOUSE.posX(e) -30,MOUSE.posY(e)-25 ,RECT_WIDTH,RECT_HEIGHT);
        }
    })
})
    


//Initialization
window.onload = function() {
    paper = Raphael("svg_paper", PAPER_HEIGHT, PAPER_WIDTH);
    MOUSE = new MouseManager(); 
}



