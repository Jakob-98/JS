//main JS file project


$(function($){//adding click functionality to the buttons, these clickevents should be moved, but not sure where yet.
 $("#idefsteps").click(function() {
            processAmount();
    })

 $("#addarrows").click(function() {
            addArr(); 
    })
 $("#clearbutton").click(function() {
            paper.clear();
 })
 $("#svg_paper").click(function(e) {
    crtProcess(MOUSE.posX(e) -30,MOUSE.posY(e)-25 ,60,50)
 })
})
    


//Initialization
window.onload = function() {
    paper = Raphael("svg_paper", PAPER_HEIGHT, PAPER_WIDTH);
    MOUSE = new MouseManager();
       
}



