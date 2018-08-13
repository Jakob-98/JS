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
