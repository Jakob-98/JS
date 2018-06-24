//main JS file project


$(function($){//adding click functionality to the buttons
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
    var offset = $("#svg_paper").offset();
    mouse.test();
    
  //  createBox(mouse.posX() -30,mouse.posY()-25,60,50)
 })
})
    

// function createBox(x,y,w,h) {
//     var element = paper.rect(x, y, w, h);
//     element.attr({
//         fill:'gray',
//         opacity: .5,
//         stroke:'#F00'
//     });
//     return element;
// }

function createBox(x,y,w,h) {
   a =  new ObjectWithXYWH('test');
   a.draw(x,y,w,h);
}



//Initialization
window.onload = function() {
    paper = Raphael("svg_paper", PAPER_HEIGHT , PAPER_WIDTH);
    MOUSE = new MouseManager(mouse);
}


