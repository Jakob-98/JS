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
		p.x = MOUSE.pageXUp;
		p.y = MOUSE.pageYUp;
		p.name = "process: " + (this.processes.indexOf(p) + 1);
		p.doDraw();
		console.log("process created on:"+p.x+":"+p.y); 
	}
	addLink () {
		var l = new Link();
		this.pLinks.push(l);
		this.activeLink = l;
		l.x = MOUSE.pageXDown
		l.y = MOUSE.pageYDown;
		l.xEnd = MOUSE.pageXDown;
		l.yEnd = MOUSE.pageYDown;
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
	onElement (e) { //returns true if element is under cursor, adds element to selection
		if (Math.abs(MOUSE.x - this.x) <= 0.5 * RECT_WIDTH &&
		Math.abs(MOUSE.y- this.y) <= 0.5 * RECT_HEIGHT) {
			return true;
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
		this.pathAttr = {
			'arrow-end':   'classic-wide-long',
			'opacity' : 1
		}
	}
	doDraw() {
		if (this.P1 && this.P2) {
			this.xEnd = this.P2.x;
			this.yEnd = this.P2.y;			
			this.x = this.P1.x;
			this.y = this.P1.y;
		}
		var pathEl1 = ["M", this.x, this.y, "L", 0.5*(this.xEnd+this.x), this.y];
		var pathEl2 = ["M", 0.5*(this.xEnd+this.x), this.y, "L", 0.5*(this.xEnd+this.x), this.yEnd];
		var pathEl3 = ["M", 0.5*(this.xEnd+this.x), this.yEnd, "L", this.xEnd, this.yEnd];
		
		var path = ["M", this.x, this.y, "L", this.xEnd, this.yEnd];

		if (this === MODEL.activeLink) {
			this.pathAttr['opacity'] = 0.5;	
			this.pathAttr['stroke-dasharray'] = "--";	
		} else {
			this.pathAttr['opacity'] = 1;	
			this.pathAttr['stroke-dasharray'] = undefined;	
		}
		if (this.shape) this.shape.remove();
		this.shape = paper.set();
		if (!MOUSE.ON_EL && this == MODEL.activeLink){
			this.shape.push(paper.path(path).attr(this.pathAttr));
		} else {
			this.shape.push(paper.path(pathEl1).attr(this.pathAttr));
			this.shape.push(paper.path(pathEl2).attr(this.pathAttr));
			this.shape.push(paper.path(pathEl3).attr(this.pathAttr));
		}
	}
	removeSelf() {
		MODEL.pLinks.pop(this);
	}
}
//END CLASS Link

// CLASS MouseManager
class MouseManager {
	constructor(name) {
		this.name = name;
		this.x = 0;
		this.y = 0;
		this.pageXDown = 0;
		this.pageYDown = 0;
		this.pageXUp = 0;
		this.pageYUp = 0;
		this.ON_EL = null;
		this.ElDown = null;
		this.ElUp = null;
	} 
	
	mouseMove(e) { 
		this.x = e.pageX - PAPER_OFFSET.left;
		this.y = e.pageY - PAPER_OFFSET.top;
		this.ON_EL = null;

		for (var process of MODEL.processes) {
			if (process.onElement(e)) { 
				this.ON_EL = process;
				break; 
			}
		}

		if (LINK_ELEM && MODEL.activeLink) {
			MODEL.activeLink.xEnd = e.pageX - PAPER_OFFSET.left;
			MODEL.activeLink.yEnd = e.pageY - PAPER_OFFSET.top;
			MODEL.reDraw();
		}
		if (!LINK_ELEM){
			for (var selected of MODEL.selection) {
				selected.x = this.x + selected.relativePos.x;
				selected.y = this.y + selected.relativePos.y;
			}
		}
		MODEL.reDraw();
	}


	mouseDown(e) {
		this.pageXDown = e.pageX - PAPER_OFFSET.left;
		this.pageYDown = e.pageY - PAPER_OFFSET.top;
		this.ElDown = null;

		if(this.ON_EL) {
			this.ElDown = this.ON_EL;
			MODEL.selection.push(this.ON_EL);
			console.log(MODEL.selection);
		}
		

		for (var selected of MODEL.selection) {
			selected.relativePos.x = selected.x - this.pageXDown;
			selected.relativePos.y = selected.y - this.pageYDown;
		}
	
		if (LINK_ELEM) { 
			MODEL.addLink();			
		}
	}


	mouseUp(e) {
		this.pageXUp = e.pageX - PAPER_OFFSET.left;
		this.pageYUp = e.pageY - PAPER_OFFSET.top;

			if (!this.ON_EL){
				if (DRAW_RECT) {
					MODEL.addProcess(A0);
				}
				MODEL.reDraw();	
			} else {
				this.ElDown = this.ON_EL;
			}

			if (LINK_ELEM) {
				for (var process of MODEL.processes) {
					process.onElement(e);
					if (this.ON_EL) {
						console.log('test');
						MODEL.selection.push(process);
						break; //only push one item per selection click
					}
				}
				if (!this.ON_EL) {
					MODEL.activeLink.removeSelf();
			}
				MODEL.activeLink.P1 = this.ElDown;
				MODEL.activeLink.P2 = this.ElUp;
			}
			MODEL.activeLink = null;
			if (!SELECT_ELEM) {
				MODEL.clearSelection();
			} 
			MODEL.reDraw();
	}
	
	}
//END CLASS MouseManager