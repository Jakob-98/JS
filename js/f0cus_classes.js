// F0CUS CLASS DEFINITIONS

//CLASS Model
class Model {
	constructor() {
		this.processes = [];
		this.pLinks = [];
		this.selection = [];
		this.activeLink = null;
	}
	addProcess (Parent) { //adding a process to the model, called by MOUSE
		var p = new Process(Parent); 
		this.processes.push(p); //pushes the created process to the processes of the MODEL
		p.x = MOUSE.getPosXUp();
		p.y = MOUSE.getPosYUp();
		p.name = "process: " + (this.processes.indexOf(p) + 1);
		p.doDraw();
		console.log("process created on:"+p.x+":"+p.y); 
	}
	addLink () {
		var l = new Link();
		this.pLinks.push(l);
		this.activeLink = l;
		l.x = MOUSE.getPosXDown();
		l.y = MOUSE.getPosYDown();
		l.xEnd = MOUSE.getPosXDown();
		l.yEnd = MOUSE.getPosYDown();
		l.doDraw();
	}
	reDraw() { //redrawing the model, drawing each element of MODEL
		paper.clear();
		for (var procces of this.processes) {
			procces.doDraw();
		}
		for (var links of this.pLinks) {
			links.doDraw();
		}
	}
	clearSelection () { //clear the selection
		this.selection = [];
	}
}
//END CLASS Model


//CLASS Process
class Process { //TO DO: the this.x/y is currently in the left top corner, this should be in the middle instead. 
	constructor(Parent) {
		this.parent = Parent;
		this.subProcesses = [];
		this.shape = null;
		this.fillColor = '#DCDCDC';
		this.stepNr = 0;
		this.relativePos = {x : 0, y : 0};
	}
	doDraw() { //draw itself
		if (MODEL.selection.includes(this)) { //changes color when selected
			this.fillColor = '#A9A9A9';
		} else {
			this.fillColor = '#DCDCDC';
		}
		this.calcStepNr(); //calculate the step number
		if (this.shape) this.shape.remove();
		this.shape = paper.set();
		this.shape.push(paper.rect(this.x - 1/2 * RECT_WIDTH, 
			this.y - 1/2 * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT)
			.attr({cursor: 'pointer', fill: this.fillColor}));
		this.shape.push(paper.text(this.x, this.y, this.name)
			.attr({cursor: 'pointer'}));
		this.shape.push(paper.text(this.x + 3/9 * RECT_WIDTH, this.y + 3/9 * RECT_HEIGHT,'A' + this.stepNr) //TODO add parent "number" -> parent is A1, add 1 to A number 
			.attr({cursor: 'pointer'}));
	}
	onElement () { //returns true if element is under cursor, adds element to selection
		if (Math.abs(MOUSE.getPosXDown() - this.x) <= 0.5 * RECT_WIDTH &&
		Math.abs(MOUSE.getPosYDown() - this.y) <= 0.5 * RECT_HEIGHT) {
			ONELEMENT = true; 
			return this;
		} else {
			return;
		}
	}
	calcStepNr() { //calculate which step this is
		var nr = 1;
		for (var process of MODEL.processes) {
			if (process.x < this.x) {
				nr += 1;
			}
		}
		this.stepNr = nr;
	}
}
//END CLASS Process

//CLASS Link
class Link {
	constructor() {
		this.shape = null;
	}
	doDraw() {
		var path = ["M", this.x, this.y, "L", this.xEnd, this.yEnd];

		if (this.shape) this.shape.remove();
		this.shape = paper.set();
		this.shape.push(paper.path(path));
	}
}
//END CLASS Link

// CLASS MouseManager
class MouseManager {
	constructor(name) {
		this.name = name;
		this.pageXDown = 0;
		this.pageYDown = 0;
		this.pageXUp = 0;
		this.pageYUp = 0;
	} 

	getPosXDown() {//used to call the current Xposition of mouse 
		return this.pageXDown - PAPER_OFFSET.left;
	}
	getPosYDown() {//used to call the current Yposition of mouse 
		var offset = $("#svg_paper").offset();
		return this.pageYDown - PAPER_OFFSET.top;
	}
	getPosXUp() {//used to call the current Xposition of mouse 
		var offset = $("#svg_paper").offset();
		return this.pageXUp - PAPER_OFFSET.left;
	}
	getPosYUp() {//used to call the current Yposition of mouse 
		var offset = $("#svg_paper").offset();
		return this.pageYUp - PAPER_OFFSET.top;
	}

	mouseDown(e) {
		this.pageXDown = e.pageX;
		this.pageYDown = e.pageY;

		if (!SELECT_ELEM) {
			MODEL.clearSelection();
		} 
		
		if (MODEL.processes.length > 0 && !LINK_ELEM) {
			for (var process of MODEL.processes) {
				process.onElement();
				if (ONELEMENT) {
					MODEL.selection.push(process);
					break; //only push one item per selection click
				}
			}
			for (var selected of MODEL.selection) {
				selected.relativePos.x = selected.x - this.pageXDown;
				selected.relativePos.y = selected.y - this.pageYDown;
 			}
		}
		if (LINK_ELEM) { 
			MODEL.addLink();			
		}
	}
	mouseUp(e) {
		this.pageYUp = e.pageY;
		this.pageXUp = e.pageX;
			if (!ONELEMENT){
				if (DRAW_RECT) {
					MODEL.addProcess(A0);
				}
				MODEL.reDraw();	
			} 
			ONELEMENT = false;
			MODEL.activeLink = null;
			MODEL.reDraw();
	}
	mouseMove(e) { 
		if (!ONELEMENT){
			if (LINK_ELEM && MODEL.activeLink) {
				MODEL.activeLink.xEnd = e.pageX - PAPER_OFFSET.left;
				MODEL.activeLink.yEnd = e.pageY - PAPER_OFFSET.top;
				MODEL.reDraw();
			}
		} else {
			for (var selected of MODEL.selection) {
				selected.x = e.pageX + selected.relativePos.x;
				selected.y = e.pageY + selected.relativePos.y;
			}
			MODEL.reDraw();
		}
	}

}
//END CLASS MouseManager