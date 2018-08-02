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
    $("#svg_paper").click(function(e) {
        if (DRAW_RECT) {
            crtProcess(window.MOUSE.posX(e) - 30, window.MOUSE.posY(e) - 25, RECT_WIDTH, RECT_HEIGHT);
        } 
    })
    $("#savebutton").click(function(){
        if (!$("#savebutton").isActive) {
            setState(this.id, true);
            SAVED_JSON = paper.toJSON();
        }
    });    
    $("#loadbutton").click(function(){
        if (!$("#loadbutton").isActive) {
            setState(this.id, true);
            paper.fromJSON(SAVED_JSON);
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