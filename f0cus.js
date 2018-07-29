//main JS file project


$(function($){//adding click functionality to the buttons, these clickevents should be moved, but not sure where yet.
 $("#clearbutton").click(function() {
            paper.clear();
 })
 $("#unbindbut").click(function() {
    unbind();
})
 $("#rectbutton").click(function() {
    unbind();
    if (DRAW_RECT == false) {
        DRAW_RECT = true;
    } 
 })
 $("#svg_paper").click(function(e) {
     if (DRAW_RECT == true) {
        crtProcess(MOUSE.posX(e) -30,MOUSE.posY(e)-25 ,60,50);
        console.log(DRAW_RECT);
     }
 })
})
    


//Initialization
window.onload = function() {
    paper = Raphael("svg_paper", PAPER_HEIGHT, PAPER_WIDTH);
    MOUSE = new MouseManager();
       
}



