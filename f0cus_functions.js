
function crtProcess(x,y,w,h) {
    tempBox =  new ProcessStep();
    tempBox.drawRect(x,y,w,h);
 }

function unbind(){
    if (DRAW_RECT == true) {
        DRAW_RECT = false;
    } 
}