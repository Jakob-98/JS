
function crtProcess(x,y,w,h) { //creates a process step using a temp
    ProcessStep.processMain('test' + ID_COUNTER,x,y,w,h);
 }



function elementHandler(elSet) { //handles events of the different elements.
    elSet[0].drag(dragMove, dragStart, dragUp); //enables dragging with the drag functions
    elSet.click(function (e) {
        resetStateAll();
        console.log("clicked:" + $(elSet[0].node).attr('id'))
    })
}


function setCreator (x,y,element,name,elSet) { //creates the element set with various extra elements like name
    var nameEl = paper.text(x + 1/2 *RECT_WIDTH,y + 1/2 *RECT_HEIGHT,name);
    var stepEl = paper.text(x + 7/8 *RECT_WIDTH,y + 7/8 *RECT_HEIGHT,"A" + ID_COUNTER);
    elSet.push (element, nameEl, stepEl);
    element.nameEl = nameEl; //nameEl is paired to element, so if you move element they both move, see dragMove
    element.stepEl = stepEl;
    console.log(elSet);
    $(elSet[0].node).attr('id',"rect " + ID_COUNTER);//gives the element node an ID.
    ID_COUNTER += 1;
    console.log("set made with id:" + $(element.node).attr('id'));
}

// functions used for dragging objects
// 
function dragMove (dx, dy) { //dragMove will be called with dx and dy
    nowX = Math.min(PAPER_HEIGHT, this.ox + dx);
    nowY = Math.min(PAPER_WIDTH, this.oy + dy);
    nowX = Math.max(0, nowX);
    nowY = Math.max(0, nowY);            
    this.attr({x: nowX, y: nowY });
    this.nameEl.attr({x: nowX + 1/2 * RECT_WIDTH , y: nowY + 1/2 * RECT_HEIGHT});
    this.stepEl.attr({x: nowX + 7/8 * RECT_WIDTH , y: nowY + 7/8 * RECT_HEIGHT});
}

function dragStart () { //storing original coordinates
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({opacity: 0.75}, 150);
}

function dragUp () { //restoring state
    this.animate({opacity: .5}, 250);
    console.log("moved:" + $(this.node).attr('id'))
}
//
// end of functions used for dragging objects

function selectionCrt(e) {
    var box;
    var selections = paper.set();
}

(function() {
	Raphael.fn.toJSON = function(callback) {
		var
			data,
			elements = new Array,
			paper    = this
			;

		for ( var el = paper.bottom; el != null; el = el.next ) {
			data = callback ? callback(el, new Object) : new Object;

			if ( data ) elements.push({
				data:      data,
				type:      el.type,
				attrs:     el.attrs,
				transform: el.matrix.toTransformString(),
				id:        el.id
				});
		}

		var cache = [];
		var o = JSON.stringify(elements, function (key, value) {
		    //http://stackoverflow.com/a/11616993/400048
		    if (typeof value === 'object' && value !== null) {
		        if (cache.indexOf(value) !== -1) {
		            // Circular reference found, discard key
		            return;
		        }
		        // Store value in our collection
		        cache.push(value);
		    }
		    return value;
		});
		cache = null;
		return o;
	}

	Raphael.fn.fromJSON = function(json, callback) {
		var
			el,
			paper = this
			;

		if ( typeof json === 'string' ) json = JSON.parse(json);

		for ( var i in json ) {
			if ( json.hasOwnProperty(i) ) {
				el = paper[json[i].type]()
					.attr(json[i].attrs)
					.transform(json[i].transform);

				el.id = json[i].id;

				if ( callback ) el = callback(el, json[i].data);

				if ( el ) paper.set().push(el);
			}
		}
	}
})();