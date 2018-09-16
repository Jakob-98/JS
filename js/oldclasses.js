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
      this.parent.subProcesses.pop;
    }
    MODEL.processes.pop(this);
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

 }test123
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
    this.detVals();//determine the x and y values based on where it is dragged on.
    this.detPath();//determine the path of the link
    
    if (this.shape) this.shape.remove();
    this.shape = paper.set();
    this.shape.push(paper.path(this.path).attr(this.pathAttr));
    
  }
  removeSelf() { //removes itself from different arrays then finally popping of the MODEL stack.
    if (this.P1) {
      this.P1.linksOut.pop(this);
    }
    if (this.P2) { 
      this.P2.linksIn.pop(this);
      switch (this.type) {
        case "I":
        this.P2.linksInI.pop(this);
          break;
        case "C":
        this.P2.linksInC.pop(this);
          break;
        case "M":
        this.P2.linksInM.pop(this);
          break;
      
        default:
          break;
      }
    }
    MODEL.pLinks.pop(this);
  }
	pathOnSelf() {
		//TODO add checker if path is on self.
	}
  detVals() {//TODO add check if p1 = p2, change the path etc..
    var xOffsetMult = 0;
		var posXOffset = 0;
		var posYOffset = 0;
		var yOffsetOutMult = 0;

		if (this.P1) {
			yOffsetOutMult = (this.P1.linksOut.indexOf(this) + 1) / (this.P1.linksOut.length + 1);
			posYOffset = - 0.4 * RECT_HEIGHT + (2 * yOffsetOutMult * 0.4 * RECT_HEIGHT);
		}

		if ((!this.P1 || !this.P2) && this !== MODEL.activeLink) { //TODO add a check if there is already such a link, then either delete self or add another link with space between Y values...
			this.removeSelf();
		}


    if (this.P1 === this.P2 && this !== MODEL.activeLink) { //TO DO add functionality if P1 = P2. 
      this.removeSelf();
    } else { 
      if (this.P1 && this.P2) {
        this.middlePoint = Math.abs(this.P1.x + this.P2.x) * 0.5 //det the middlepoint between P1 and P2, used in detPath();
        switch (this.type) {
          case 'I':
            this.xEnd = this.P2.x - 1/2 * RECT_WIDTH - 1.5;
            this.yEnd = this.P2.y;			
            this.x = this.P1.x + 1/2 * RECT_WIDTH;
            this.y = this.P1.y + posYOffset;
            break;
          case 'C':
            xOffsetMult = (this.P2.linksInC.indexOf(this) + 1) / (this.P2.linksInC.length + 1);
            posXOffset = - 0.4 * RECT_WIDTH + (2 * xOffsetMult * 0.4 * RECT_WIDTH)
            this.xEnd = this.P2.x + posXOffset;
            this.yEnd = this.P2.y - 1/2 * RECT_HEIGHT - 1.5;			
            this.x = this.P1.x + 1/2 * RECT_WIDTH;
            this.y = this.P1.y + posYOffset;
            break;					
          case 'M':
            xOffsetMult = (this.P2.linksInM.indexOf(this) + 1) / (this.P2.linksInM.length + 1);
            posXOffset = - 0.4 * RECT_WIDTH + (2 * xOffsetMult * 0.4 * RECT_WIDTH)
            this.xEnd = this.P2.x + posXOffset;
            this.yEnd = this.P2.y + 1/2 * RECT_HEIGHT + 1.5;			
            this.x = this.P1.x + 1/2 * RECT_WIDTH;
            this.y = this.P1.y + posYOffset;
            break;
          default:
            this.removeSelf();
            break;
        }

      } 
		}
		if (this.P2){ //TODO this should be a switch if one or more is true, it is true for all of P2. (not functioning properly atm.)

			if (this.y > this.yEnd - 0.1 * RECT_HEIGHT && this.type === "C"){
				this.P2.linksOverC = true;
			} else {
				this.P2.linksOverC = false;
			}
			if (this.P1.y < this.P2.y + 1/2 * RECT_HEIGHT && this.type === "M"){
				this.P2.linksOverM = true;
			} else {
				this.P2.linksOverM = false;
			}
		}

  }
  detPath() { //BUG: If you drag a link out of P1 without determining P2, yOffsetOutMult acts weird.
    //path attributes and variables

    var yOffsetIMult = 0;
    var yOffsetI = 0;
    var middleOffsetX = 0;
    var reversedLinksOut = [];
    if (this === MODEL.activeLink) { //if this is the actively draggable link, change opacity etc
      this.pathAttr['opacity'] = 0.5;	
      this.pathAttr['stroke-dasharray'] = "--";	
      this.path = [
        "M", this.x, this.y, 
        "L", this.xEnd, this.yEnd
      ];
    } else {
      if (this.P1 && this.P2) {
        this.path = [];
        this.pathAttr['opacity'] = 1;	
        this.pathAttr['stroke-dasharray'] = undefined;
        
        if (this.type === "I") {
          yOffsetIMult = (this.P2.linksInI.indexOf(this) + 1) / (this.P2.linksInI.length + 1);
          yOffsetI = - 0.4 * RECT_HEIGHT + (2 * yOffsetIMult * 0.4 * RECT_HEIGHT)
        }

        reversedLinksOut = this.P1.linksOut.slice().reverse();
          
          if (this.P2.linksInYUp.includes(this)) {
            middleOffsetX = reversedLinksOut.indexOf(this) * 0.225 * RECT_WIDTH;
          }
          if (this.P2.linksInYDown.includes(this)){
            middleOffsetX = - reversedLinksOut.indexOf(this) * 0.225 * RECT_WIDTH;
						
        }
      }
    }
    
    //determining the paths, checking if they intersect processes.
    var directPath = true;
    var pathDict = {};
    this.on_process = null;
    switch (this.type) {
      case "I":
          // [start x, start y, end x, end y, horizontal or vertical line]
        pathDict['path1'] = [this.x, this.y, this.middlePoint + middleOffsetX, this.y, 'horizontal'];
        pathDict['path2'] = [this.middlePoint + middleOffsetX, this.y, this.middlePoint + middleOffsetX, this.yEnd + yOffsetI, 'vertical'];
        pathDict['path3'] = [this.middlePoint + middleOffsetX, this.yEnd + yOffsetI, this.xEnd, this.yEnd + yOffsetI, 'horizontal'];
        this.checkIfIntersect(pathDict);
        break;
      case "C":
        if (this.P2.linksOverC) {directPath = false;}
        if (!directPath) {
          // [start x, start y, end x, end y, horizontal or vertical line]
          pathDict['path1'] = [this.x, this.y, this.middlePoint + middleOffsetX, this.y, 'horizontal'];
          pathDict['path2'] = [this.middlePoint + middleOffsetX, this.y, this.middlePoint + middleOffsetX, this.yEnd - 0.5 * RECT_HEIGHT, 'vertical'];
          pathDict['path3'] = [this.middlePoint + middleOffsetX, this.yEnd - 0.5 * RECT_HEIGHT, this.xEnd, this.yEnd - 0.5 * RECT_HEIGHT, 'horizontal'];
          pathDict['path4'] = [this.xEnd, this.yEnd - 0.5 * RECT_HEIGHT, this.xEnd, this.yEnd, 'vertical'];
        } else {
          pathDict['path1'] = [this.x, this.y, this.xEnd, this.y, 'horizontal'];
          pathDict['path2'] = [this.xEnd, this.y, this.xEnd, this.yEnd, 'vertical'];
        }       
        this.checkIfIntersect(pathDict);
      break;
      case "M":
      if (this.P2.linksOverM) {directPath = false;}
      if (!directPath) {
        // [start x, start y, end x, end y, horizontal or vertical line]
        pathDict['path1'] = [this.x, this.y, this.middlePoint + middleOffsetX, this.y, 'horizontal'];
        pathDict['path2'] = [this.middlePoint + middleOffsetX, this.y, this.middlePoint + middleOffsetX, this.yEnd + 0.5 * RECT_HEIGHT, 'vertical'];
        pathDict['path3'] = [this.middlePoint + middleOffsetX, this.yEnd + 0.5 * RECT_HEIGHT, this.xEnd, this.yEnd + 0.5 * RECT_HEIGHT, 'horizontal'];
        pathDict['path4'] = [this.xEnd, this.yEnd + 0.5 * RECT_HEIGHT, this.xEnd, this.yEnd, 'vertical'];
      } else {
        pathDict['path1'] = [this.x, this.y, this.xEnd, this.y, 'horizontal'];
        pathDict['path2'] = [this.xEnd, this.y, this.xEnd, this.yEnd, 'vertical'];
      }       
      this.checkIfIntersect(pathDict);
      break;
      
      default:
      break;
    }
    
//creating this.path
      for (var [key, value] of Object.entries(pathDict)) {
      if (key === "path1"){
        this.path.push("M",value[0],value[1],"L",value[2],value[3])
      } else {
        this.path.push("L",value[0],value[1],"L",value[2],value[3])
      }
    }
    
	}
  checkIfIntersect(pathDict) {
    for (var value of Object.values(pathDict)) {
      for (var process of MODEL.processes) { //TODO only loop through objects between P1 and P2 for more efficient code. 
        this.on_process = process.pathOnSelf(
          value[0],
          value[1],
          value[2],
          value[3],
          value[4]
        )        
      }
      if (this.on_process !== null) {
        console.log('on object')
        this.reRoute(pathDict)
        //this.reRoute(); //TODO add reroute.
        break;
      }
    }
  }
  reRoute() {

  }
}
//END CLASS Link

class Path {

}





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