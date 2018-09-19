// F0CUS CLASS DEFINITIONS

//CLASS Model
class Model {
  constructor() {
    this.processes = []; //processes of the model sorted by x value
    this.pLinks = [];
    this.selection = [];
    this.activeLink = null;
    this.parentLevel = "A0";
  }
  addProcess (Parent) { //adding a process to the model, called by MOUSE
    var p = new Process(Parent); 
    this.processes.push(p); //pushes the created process to the processes of the MODEL
	  p.x = MOUSE.pageXUp;
	  p.y = MOUSE.pageYUp;
    p.name = "process: " + (this.processes.indexOf(p) + 1);
    p.parent.subProcesses.push(p);
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
    this.linkManager();
    this.sortArrays();

    paper.clear();
    for (var process of this.processes) {
      process.doDraw();
    }
    for (var links of this.pLinks) {
      links.doDraw();
    }
  }
  clearSelection () { //clear the selection
    this.selection = [];
  }
  sortArrays() { 
    this.processes.sort(this.x);//sort the processes by x value
    this.pLinks.sort(this.yEnd);//sort the links by their y end value
  }
  linkManager() {
    for (var process of this.processes) {
      process.linksClear();
    }
    for (var link of this.pLinks) {
      if (link !== this.activeLink){
        if (link.P1) {
          link.P1.linksOut.push(link);
        }
        if (link.P2) {
          link.P2.linksIn.push(link);
          switch (link.type) {
            case "I":
              link.P2.linksInI.push(link);
              break;
            case "M":
              link.P2.linksInM.push(link);
              break;
            case "C":
              link.P2.linksInC.push(link);
              break;
          
            default:
              break;
          }
        }
      }
    }
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
    this.linksIn = [];
    this.linksInI = [];
    this.linksInC = [];
    this.linksInM = [];
    this.linksInYUp = []; //how many links have the same x coordinates on the "halfway up-point" of the line.
		this.linksInYDown = [];
		this.linksOverM = false;
		this.linksOverC = false;
  }
  doDraw() { //draw itself
    if (MODEL.selection.includes(this)) { //changes color when selected
      this.fillColor = '#DCDCDC';
    } else {
      this.fillColor = 'White';
    }
    this.calcStepNr(); //calculate the step number
    this.linkSorter(); //linksorter shouldnt be called from here for cleanlyness (one sort per movement is enough) will change later. BUG/Thing that I dont get; this.linksIn wont work in linksorter, so I have to add (this). Fix for later.

    if (this.shape) this.shape.remove();
    this.shape = paper.set();
    this.shape.push(paper.rect(this.x - 1/2 * RECT_WIDTH, 
      this.y - 1/2 * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT)
      .attr({cursor: 'pointer', fill: this.fillColor}));

    this.detDragPath();

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
    for (var process of MODEL.processes) { //TODO sort processes and links  by x value
      if (process.x < this.x) {
        nr += 1;
      }
    }
    this.stepNr = nr;
  }
  detDragArea() {//determines in what area youre dragging the link, then sets the value of the selectDragArea
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
  detDragPath() {
    if (MOUSE.ON_EL !== this || !LINK_ELEM) {
      this.selectDragArea = "";
    }

    switch (this.selectDragArea) { //TODO deze weghalen relatief maken en bij onload zetten. 
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
  }
  removeSelf() {
    if(this.parent) {
      this.parent.subProcesses.splice(this.parent.subProcesses.indexOf(this));
    }
    MODEL.processes.splice(MODEL.processes.indexOf(this));
    MODEL.redraw();
	}
  pathOnSelf(startX, startY, endX, endY, pathType) {    //TODO add checker if path is on process
    if (
      pathType === "horizontal" 
      &&(startX < (this.x + 0.5 * RECT_WIDTH) && endX > (this.x - 0.5 * RECT_WIDTH))
      && (Math.abs(startY - this.y) <= 0.5 * RECT_HEIGHT) //for horizontal paths startY = endY. 
    ){
      return this;
    }
    if (
      pathType === "vertical" 
      &&(startY < (this.y + 0.5 * RECT_HEIGHT) && endY > (this.y - 0.5 * RECT_HEIGHT))
      && (Math.abs(startX - this.x) <= 0.5 * RECT_WIDTH) //for horizontal paths startY = endY. 
    ){
      return this;
    }
    return null;
	}
  linksClear() {
    this.linksOut = [];
    this.linksIn = [];
    this.linksInI = [];
    this.linksInC = [];
    this.linksInM = [];
    this.linksInYUp = []; 
    this.linksInYDown = [];
  }
  linkSorter() {
  this.linksOut.sort(function(a, b) {
      return parseInt(a.yEnd) - parseInt(b.yEnd);
  });
  this.linksInI.sort(function(a, b) {
    return parseInt(a.yEnd) - parseInt(b.yEnd);
});
  this.linksInC.sort(function(a, b) {
    return parseInt(a.y) + parseInt(b.y);
  });    
  this.linksInM.sort(function(a, b) {
    return parseInt(a.y) - parseInt(b.y);
  });

  this.linksInYUp = [];
  this.linksInYDown = [];

  for (var links of this.linksIn) {
    if (links.yEnd > links.P1.y) {
      this.linksInYUp.push(links);
    } else {
      this.linksInYDown.push(links);
    }
  }
  this.linksInYUp.sort(function(a, b) {
    return parseInt(a.x) - parseFloat(b.x);
  });
  this.linksInYDown.sort(function(a, b) {
    return parseInt(a.x) - parseFloat(b.x);
  });

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
		this.middlePoint = 0;
    this.on_process = null;
    this.paths = [];

  }
  doDraw() {
    this.checkValidity(); //check if the link is valid or should be removed
    this.detVals();//determine the x and y values based on where it is dragged on.
    this.detPath();//determine the path of the link
    
    if (this.shape) this.shape.remove();
    this.shape = paper.set();
    this.shape.push(paper.path(this.path).attr(this.pathAttr));
    
  }
  removeSelf() { //removes itself from different arrays then finally popping of the MODEL stack.
    if (this.P1) {
      this.P1.linksOut.splice(this.P1.linksOut.indexOf(this));
    }
    if (this.P2) { 
      this.P2.linksIn.splice(this.P2.linksIn.indexOf(this));
      switch (this.type) {
        case "I":
        this.P2.linksInI.splice(this.P2.linksInI.indexOf(this));
          break;
        case "C":
        this.P2.linksInC.splice(this.P2.linksInC.indexOf(this));
          break;
          case "M":
          this.P2.linksInM.splice(this.P2.linksInM.indexOf(this));
          break;
      
        default:
          break;
      }
    }
    MODEL.pLinks.splice(MODEL.pLinks.indexOf(this));
  }
  checkValidity() { 
    if((!this.P1 || !this.P2) && this !== MODEL.activeLink) {
      this.removeSelf();
    }
  }
  detVals () {
    if (MODEL.activeLink === this) {
      this.pathAttr['opacity'] = 0.5;	
      this.pathAttr['stroke-dasharray'] = "--"
      this.path = [
        "M", this.x, this.y, 
        "L", this.xEnd, this.yEnd
      ];
    } else {
      this.pathAttr['opacity'] = 1;	
      this.pathAttr['stroke-dasharray'] = undefined;  
    }
  }
  detPath() {

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

        if (this.ON_EL) {
          MODEL.activeLink.P2 = this.ON_EL;
          MODEL.activeLink.type = this.ON_EL.selectDragArea;
          // if (MODEL.activeLink.P1.linksOut.length > 5) {
          //   MODEL.activeLink.removeSelf();
          //   console.log("too many links out")
          // } 
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