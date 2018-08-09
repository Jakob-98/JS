/**
 * Adding click functionality to the buttons, these clickevents should be moved, but not sure where yet.
 */
$("#clearbutton").click(function() {
    window.paper.clear();
});
$(function($){
    $('.btn').click(function () {
        resetStateAll();
    // });
    // $("#clearbutton").click(function() {
    //     window.paper.clear();
    // });
    // TODO: Actually make the unbind button functionallity.
    // $("#unbindbutton").click(function() {
    //     resetStateAll(); 
    // });
    $("#selectbutton").click(function() {
        if (!$("#selectbutton").isActive){
            SELECT_ELEM = true;
            setState(this.id, true);
        } 
    });
    $("#rectbutton").click(function() {
        if (!$("#rectbutton").isActive) {
            DRAW_RECT = true;
            setState(this.id, true);
        }
    });
    $("#testbutton").click(function() { //button used for testing various things
        if (!$("#testbutton").isActive) {
            setState(this.id, true);
            drawLine();

        }
    });
    $("#svg_paper").click(function(e) {
        if (DRAW_RECT) {
            crtProcess(window.MOUSE.posX(e) - 30, window.MOUSE.posY(e) - 25, RECT_WIDTH, RECT_HEIGHT);
        }
    })
    $("#savebutton").click(function(){
        if (!$("#savebutton").isActive) {
            setState(this.id, true);
            SAVED_JSON = paper.toJSON(function(el, data) {
                // Save the set identifier along with the other data
                data.setName = el.setName;
                data.isDraggable = true;
            
                return data;
            });
        }
    });    
    $("#loadbutton").click(function(){
        if (!$("#loadbutton").isActive) {
            setState(this.id, true);
            window.paper.clear();
            paper.fromJSON(SAVED_JSON, function(el, data) {
                // Recreate the set using the identifier
                if ( !window[data.setName] ) window[data.setName] = paper.set();

                el.setName = data.setName;
               // Place each element back into the set
                window[data.setName].push(el);


                if ( data.isDraggable ) {
                    el.drag(dragStart, dragMove, dragUp);
                }
                return el;
            });
        }
    });
});
 /**
 * Clear the state of all action buttons
 */
function resetStateAll() {
    setState('clearbutton', false);
    setState('unbindbutton', false);
    setState('selectbutton', false);
    setState('rectbutton', false);
    setState('savebutton', false);
    setState('loadbutton', false);
    setState('testbutton', false);
    SELECT_ELEM = false;
    DRAW_RECT = false;
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
 /**
 * Initialise window variables.
 */
window.onload = function() {
    window.paper = Raphael("svg_paper", PAPER_HEIGHT, PAPER_WIDTH);
    window.MOUSE = new MouseManager();
};

