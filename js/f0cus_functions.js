
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

function toJSON(node) {
    node = node || this;
    var obj = {
      nodeType: node.nodeType
    };
    if (node.tagName) {
      obj.tagName = node.tagName.toLowerCase();
    } else
    if (node.nodeName) {
      obj.nodeName = node.nodeName;
    }
    if (node.nodeValue) {
      obj.nodeValue = node.nodeValue;
    }
    var attrs = node.attributes;
    if (attrs) {
      var length = attrs.length;
      var arr = obj.attributes = new Array(length);
      for (var i = 0; i < length; i++) {
        attr = attrs[i];
        arr[i] = [attr.nodeName, attr.nodeValue];
      }
    }
    var childNodes = node.childNodes;
    if (childNodes) {
      length = childNodes.length;
      arr = obj.childNodes = new Array(length);
      for (i = 0; i < length; i++) {
        arr[i] = toJSON(childNodes[i]);
      }
    }
    return obj;
  }

  function toDOM(obj) {
    if (typeof obj == 'string') {
      obj = JSON.parse(obj);
    }
    var node, nodeType = obj.nodeType;
    switch (nodeType) {
      case 1: //ELEMENT_NODE
        node = document.createElement(obj.tagName);
        var attributes = obj.attributes || [];
        for (var i = 0, len = attributes.length; i < len; i++) {
          var attr = attributes[i];
          node.setAttribute(attr[0], attr[1]);
        }
        break;
      case 3: //TEXT_NODE
        node = document.createTextNode(obj.nodeValue);
        break;
      case 8: //COMMENT_NODE
        node = document.createComment(obj.nodeValue);
        break;
      case 9: //DOCUMENT_NODE
        node = document.implementation.createDocument();
        break;
      case 10: //DOCUMENT_TYPE_NODE
        node = document.implementation.createDocumentType(obj.nodeName);
        break;
      case 11: //DOCUMENT_FRAGMENT_NODE
        node = document.createDocumentFragment();
        break;
      default:
        return node;
    }
    if (nodeType == 1 || nodeType == 11) {
      var childNodes = obj.childNodes || [];
      for (i = 0, len = childNodes.length; i < len; i++) {
        node.appendChild(toDOM(childNodes[i]));
      }
    }
    return node;
  }