//main JS file project


$(function($){//adding click functionality to the buttons
 $("#idefsteps").click(function() {
            ProcessAmount();
    })

 $("#addarrows").click(function() {
            AddArr(); 
    })
 $("#testbox").click(function() {
            CreateBox(100,100,50,50);
 })
})
    

// function CreateBox(x,y,w,h) {
//     var element = paper.rect(x, y, w, h);
//     element.attr({
//         fill:'gray',
//         opacity: .5,
//         stroke:'#F00'
//     });
//     return element;
// }

function CreateBox(x,y,w,h) {
   a =  new ObjectWithXYWH('test');
   a.draw(x,y,w,h);
}



//Initialization
window.onload = function() {
    paper = Raphael("svg_paper", PAPER_HEIGHT , PAPER_WIDTH);
}


