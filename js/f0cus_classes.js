// F0CUS CLASS DEFINITIONS

//CLASS Model
class Model {
	constructor() {
		this.processes = [];
		this.selection = [];
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
	reDraw() { //redrawing the model, drawing each element of MODEL
		paper.clear();
		for (var procces of this.processes) procces.doDraw();
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
			return false;
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
		if (MODEL.processes.length > 0) {
			for (var process of MODEL.processes) {
				process.onElement();
				if (ONELEMENT) {
					MODEL.selection.push(process);
					break;
				}
			}
		}
	}
	mouseUp(e) {
		this.pageYUp = e.pageY;
		this.pageXUp = e.pageX;
			if (ONELEMENT == false){
				if (DRAW_RECT) {
					MODEL.addProcess(A0);
				}
				MODEL.reDraw();	
			} else {
				MODEL.selection[0].x = this.getPosXUp();
				MODEL.selection[0].y = this.getPosYUp();
				MODEL.reDraw();
				if (!SELECT_ELEM) {
					MODEL.clearSelection();
				} 
			}
			ONELEMENT = false;
	}
	mouseMove(e) { 
		if (ONELEMENT == false){
			return;
		} else {
			for (var selected of MODEL.selection) {
				selected.x = e.pageX - PAPER_OFFSET.left + (MODEL.selection[0].x - selected.x);
				selected.y = e.pageY - PAPER_OFFSET.top + (MODEL.selection[0].y - selected.y);
				}
			MODEL.reDraw();
		}
	}

}
//END CLASS MouseManager