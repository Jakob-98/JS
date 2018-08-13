//main JS file project


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
    $('.btn').click(function(e) {
        btnClick(e);
    });
}

function btnClick(e) {
    resetStateAll();
    switch (e.currentTarget.id) {
        case 'rectbutton':
            setState(e.currentTarget.id, true);
            e.currentTarget.style.background ='grey'
            DRAW_RECT = true;
            break;
        case 'selectbutton':
            setState(e.currentTarget.id, true);
            e.currentTarget.style.background ='grey'
            SELECT_ELEM = true;
        
        default:
            break;
    }
}

function resetStateAll() {
    $('.btn').each(function () { 
        this.style.background = "black";
    });
    setState('clearbutton', false);
    setState('unbindbutton', false);
    setState('selectbutton', false);
    setState('rectbutton', false);
    DRAW_RECT = false;
    SELECT_ELEM = false;
}

/**
 * Set a button to active or inactive
 *
 * @param {string} buttonId
 * @param {boolean} isActive
 */
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
