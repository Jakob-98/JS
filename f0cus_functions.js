
function crtProcess(x,y,w,h) {
    tempBox =  new ProcessStep();
    tempBox.drawRect(x,y,w,h);
 }

function unbind(){
    if (DRAW_RECT == true) {
        DRAW_RECT = false;
    } 
}

function elementHandler(element){
    element.click(function (e){
        unbind();
        console.log($(element.node).attr('id'))
    })
}