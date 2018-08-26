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
    if (MOUSE.ON_EL) {
      MOUSE.ON_EL.linksOut.push(l);
    }
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
    this.selectDragArea = "";
    this.dragAreaPath = [];
    this.linksOut = [];
  }
  doDraw() { //draw itself
    if (MODEL.selection.includes(this)) { //changes color when selected
      this.fillColor = '#DCDCDC';
    } else {
      this.fillColor = 'White';
    }
    this.calcStepNr(); //calculate the step number
    if (this.shape) this.shape.remove();
    this.shape = paper.set();
    this.shape.push(paper.rect(this.x - 1/2 * RECT_WIDTH, 
      this.y - 1/2 * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT)
      .attr({cursor: 'pointer', fill: this.fillColor}));

    if (MOUSE.ON_EL !== this || !LINK_ELEM) {
      this.selectDragArea = "";
    }

    switch (this.selectDragArea) {
      case 'C':
        this.dragAreaPath = [
          "M", this.x - 1/6 * RECT_WIDTH, this.y - 1/6 * RECT_HEIGHT, 
          "L", this.x + 1/6 * RECT_WIDTH, this.y - 1/6 * RECT_HEIGHT,
          "L", this.x + 1/2 * RECT_WIDTH, this.y - 1/2 * RECT_HEIGHT,
          "L", this.x - 1/2 * RECT_WIDTH, this.y - 1/2 * RECT_HEIGHT,	
          "L", this.x - 1/6 * RECT_WIDTH, this.y - 1/6 * RECT_HEIGHT,
        ]; 
        break;			
      case 'I':
        this.dragAreaPath = [
          "M", this.x - 1/6 * RECT_WIDTH, this.y + 1/6 * RECT_HEIGHT, 
          "L", this.x - 1/2 * RECT_WIDTH, this.y + 1/2 * RECT_HEIGHT,
          "L", this.x - 1/2 * RECT_WIDTH, this.y - 1/2 * RECT_HEIGHT, 
          "L", this.x - 1/6 * RECT_WIDTH, this.y - 1/6 * RECT_HEIGHT,
          "L", this.x - 1/6 * RECT_WIDTH, this.y + 1/6 * RECT_HEIGHT 
        ]; 
        break;
      case 'M':
        this.dragAreaPath =[
          "M", this.x - 1/6 * RECT_WIDTH, this.y + 1/6 * RECT_HEIGHT, 
          "L", this.x + 1/6 * RECT_WIDTH, this.y + 1/6 * RECT_HEIGHT,
          "L", this.x + 1/2 * RECT_WIDTH, this.y + 1/2 * RECT_HEIGHT,
          "L", this.x - 1/2 * RECT_WIDTH, this.y + 1/2 * RECT_HEIGHT,	
          "L", this.x - 1/6 * RECT_WIDTH, this.y + 1/6 * RECT_HEIGHT,
        ];
        
        break;
      case 'O':
        this.dragAreaPath = [
          "M", this.x + 1/6 * RECT_WIDTH, this.y + 1/6 * RECT_HEIGHT, 
          "L", this.x + 1/2 * RECT_WIDTH, this.y + 1/2 * RECT_HEIGHT,
          "L", this.x + 1/2 * RECT_WIDTH, this.y - 1/2 * RECT_HEIGHT, 
          "L", this.x + 1/6 * RECT_WIDTH, this.y - 1/6 * RECT_HEIGHT,
          "L", this.x + 1/6 * RECT_WIDTH, this.y + 1/6 * RECT_HEIGHT 
        ];
        break;
    
      default:
        this.dragAreaPath = "";
        break;
    }

    this.shape.push(paper.path(this.dragAreaPath)
      .attr({
        'opacity' : 1,
        'fill' : 'lightblue',
         'fill-opacity' : 0.3,
        'cursor': 'pointer'
      }));	
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
  detDragArea(){//determines in what area youre dragging the link, then sets the value of the selectDragArea
    if ((MOUSE.y - this.y) - (MOUSE.x - this.x) <= 0 && - (MOUSE.x - this.x) - (MOUSE.y - this.y) >= 0 ) {
      this.selectDragArea = "C";
    } 
    if ((MOUSE.y - this.y) - (MOUSE.x - this.x) >= 0 && - (MOUSE.x - this.x) - (MOUSE.y - this.y) <= 0 ) {
      this.selectDragArea = "M";
    } 
    if ((MOUSE.y - this.y) + (MOUSE.x - this.x) <= 0 && - (MOUSE.x - this.x) + (MOUSE.y - this.y) >= 0 ) {
      this.selectDragArea = "I";
    } 
    if ((MOUSE.y - this.y) + (MOUSE.x - this.x) >= 0 && - (MOUSE.x - this.x) + (MOUSE.y - this.y) <= 0 ) {
      this.selectDragArea = "O";
    }
  }
}
//END CLASS Process

//CLASS Link
class Link {
  constructor() {
    this.shape = null;
    this.pathAttr = {
      'opacity' : 1,
      'arrow-end':   'classic-wide-long'
    }
    this.type = ""; //type is either "I" for input, "C" for control, "M" for 
    this.path = [];
  }
  doDraw() {
    this.detVals();//determine the x and y values based on where it is dragged on.
    this.detPath();//determine the path of the link
    
    if (this.shape) this.shape.remove();
    this.shape = paper.set();
    this.shape.push(paper.path(this.path).attr(this.pathAttr));
    
  }
  removeSelf() { 
    if (this.P1) {
      this.P1.linksOut.pop(this);
    }
    MODEL.pLinks.pop(this);
  }

  detVals() {//TODO add check if p1 = p2, change the path etc..
    if (this !== MODEL.activeLink) { //if P1 or P2 is not defined, remove itself. 
      if (!this.P1 || !this.P2) { //TODO add a check if there is already such a link, then either delete self or add another link with space between Y values...
        this.removeSelf();
      }
    }
    if (this.P1 === this.P2 && this !== MODEL.activeLink) { //TO DO add functionality if P1 = P2. 
      this.removeSelf();
    } else { 
      if (this.P1 && this.P2) {
        switch (this.type) {
          case 'I':
            this.xEnd = this.P2.x - 1/2 * RECT_WIDTH - 1.5;
            this.yEnd = this.P2.y;			
            this.x = this.P1.x + 1/2 * RECT_WIDTH;
            this.y = this.P1.y;
            break;
          case 'C':
            this.xEnd = this.P2.x;
            this.yEnd = this.P2.y - 1/2 * RECT_HEIGHT - 1.5;			
            this.x = this.P1.x + 1/2 * RECT_WIDTH;
            this.y = this.P1.y;
            break;					
          case 'M':
            this.xEnd = this.P2.x;
            this.yEnd = this.P2.y + 1/2 * RECT_HEIGHT + 1.5;			
            this.x = this.P1.x + 1/2 * RECT_WIDTH;
            this.y = this.P1.y;
            break;
          default:
            this.removeSelf();
            break;
        }

      } 
    }
  }
  detPath() {
    //path attributes
    var posOffset = 0;
    if (this === MODEL.activeLink) { //if this is the actively draggable link, change opacity etc
      this.pathAttr['opacity'] = 0.5;	
      this.pathAttr['stroke-dasharray'] = "--";	
    } else {
      this.pathAttr['opacity'] = 1;	
      this.pathAttr['stroke-dasharray'] = undefined;	
      posOffset = (this.P1.linksOut.indexOf(this) + 1) / (this.P1.linksOut.length + 1);
    }
    //paths
      switch (this.type) {
        case "I":
          this.path = [
            "M", this.x, this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
            "L", 0.5*(this.xEnd+this.x), this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
            "L", 0.5*(this.xEnd+this.x), this.yEnd, 
            "L", this.xEnd, this.yEnd
          ];
          break;
        case "C":
            if (this.P1.y > this.P2.y - 1/2 * RECT_HEIGHT) {
              this.path = [
                "M", this.x, this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
                "L", 0.5*(this.xEnd+this.x), this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
                "L", 0.5*(this.xEnd+this.x), this.yEnd - 0.5 * RECT_HEIGHT, 
                "L", this.xEnd, this.yEnd - 0.5 * RECT_HEIGHT,
                "L", this.xEnd, this.yEnd
              ];
            } else {
              this.path = [
                "M", this.x, this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
                "L", this.xEnd, this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
                "L", this.xEnd, this.yEnd
              ]
            }
          break;
        case "M":
          if (this.P1.y < this.P2.y + 1/2 * RECT_HEIGHT) {
            this.path = [
              "M", this.x, this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
              "L", 0.5*(this.xEnd+this.x), this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
              "L", 0.5*(this.xEnd+this.x), this.yEnd + 0.5 * RECT_HEIGHT, 
              "L", this.xEnd, this.yEnd + 0.5 * RECT_HEIGHT,
              "L", this.xEnd, this.yEnd
            ];
          } else {
            this.path = [
              "M", this.x, this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
              "L", this.xEnd, this.y - 0.4 * RECT_HEIGHT + (2 * posOffset * 0.4 * RECT_HEIGHT), 
              "L", this.xEnd, this.yEnd
            ]
          }
          break;
      
        default:
          this.path = [
            "M", this.x, this.y, 
            "L", this.xEnd, this.yEnd
          ];
          break;
      }
    
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
  } 
  
  mouseMove(e) { 
    this.x = e.pageX - PAPER_OFFSET.left;
    this.y = e.pageY - PAPER_OFFSET.top;
    this.ON_EL = null;

    for (var process of MODEL.processes) {
      if (process.onElement(e)) {  //is there an object under the cursor?
        this.ON_EL = process;
        if (LINK_ELEM) {
        this.ON_EL.detDragArea();
        }
        break; 
      }
    }

    if (LINK_ELEM && MODEL.activeLink) {
      MODEL.activeLink.xEnd = e.pageX - PAPER_OFFSET.left; //when the link is being dragged (active) the end is just the values of your mouse pointer
      MODEL.activeLink.yEnd = e.pageY - PAPER_OFFSET.top;
    }
    if (!LINK_ELEM){
      for (var selected of MODEL.selection) {
        selected.x = this.x + selected.relativePos.x; //enables dragging of multiple objects at the same time
        selected.y = this.y + selected.relativePos.y;
      }
    }
    MODEL.reDraw();
  }


  mouseDown(e) {
    this.pageXDown = e.pageX - PAPER_OFFSET.left;
    this.pageYDown = e.pageY - PAPER_OFFSET.top;

    if(this.ON_EL) { //if there is an object under the cursor, it gets added to the model selection. 
      MODEL.selection.push(this.ON_EL);
    }
    

    for (var selected of MODEL.selection) {
      selected.relativePos.x = selected.x - this.pageXDown; //determine the relative position to the clicked object to allow dragging of multiple objects. 
      selected.relativePos.y = selected.y - this.pageYDown;
    }
  
    if (LINK_ELEM) { 
      MODEL.addLink();
      if (this.ON_EL) {
        MODEL.activeLink.P1 = this.ON_EL;		
      }
    }
  }


  mouseUp(e) {
    this.pageXUp = e.pageX - PAPER_OFFSET.left;
    this.pageYUp = e.pageY - PAPER_OFFSET.top;

      if (!this.ON_EL){
        if (DRAW_RECT) {
          MODEL.addProcess(A0);
        }
      }

      if (LINK_ELEM) {

        //// So I had to use this code when I still had multiple selection of objects enabled, but now I don't need to use it at this point it time, but I dont want to remove it yet. 
        // for (var process of MODEL.processes) { 
        // 	process.onElement(e);
        // 	if (this.ON_EL) {
        // 		MODEL.selection.push(process);
        // 		break;  //only push one item per selection click
        // 	}
        // }


        if (this.ON_EL) {
          MODEL.activeLink.P2 = this.ON_EL;
          MODEL.activeLink.type = this.ON_EL.selectDragArea;
          if (MODEL.activeLink.P1.linksOut.length > 3) {
            MODEL.activeLink.removeSelf();
            console.log("too many links out")
          } 
        }
        resetStateAll(); //I currently don't want users to create multiple links after eachother just by spam clicking before I fix some issues with the links, so I disable the link button after use
      }

      MODEL.activeLink = null;
      if (!SELECT_ELEM) {
        MODEL.clearSelection();
      } 
      MODEL.reDraw();
    }
  }
//END CLASS MouseManager