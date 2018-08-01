/**
 * Adding click functionality to the buttons, these clickevents should be moved, but not sure where yet.
 */
$(function($){
    $('.btn').click(function () {
        resetStateAll();
    });
    $("#clearbutton").click(function() {
        window.paper.clear();
    });
    // TODO: Actually make the unbind button functionallity.
    // $("#unbindbutton").click(function() {
    //     resetStateAll();
    // });
    $("#selectbutton").click(function() {
        if (!SELECT_ELEM) {
            SELECT_ELEM = true;
            setState(this.id, true);
        } 
    });
    $("#rectbutton").click(function() {
        if (!DRAW_RECT) {
            DRAW_RECT = true;
            setState(this.id, true);
        }
    });
    $("#svg_paper").click(function(e) {
        if (DRAW_RECT === true) {
            crtProcess(window.MOUSE.posX(e) - 30, window.MOUSE.posY(e) - 25, RECT_WIDTH, RECT_HEIGHT);
        }
    })
});

function resetStateAll() {
    setState('clearbutton', false);
    setState('unbindbutton', false);
    setState('selectbutton', false);
    setState('rectbutton', false);
}

function setState(buttonId, isActive) {
    var element = $('#' + buttonId);

    if (isActive) {
        element.removeClass('btn-primary');
        element.addClass('btn-secondary');
    } else {
        element.addClass('btn-primary');
        element.removeClass('btn-secondary');
    }
}

//Initialization
window.onload = function() {
    window.paper = Raphael("svg_paper", PAPER_HEIGHT, PAPER_WIDTH);
    window.MOUSE = new MouseManager();
};
