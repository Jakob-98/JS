//BUTTON FUNCTIONS


function btnClick(e) {
  resetStateAll();
  switch (e.currentTarget.id) {
    case 'rectbutton':
      setState(e.currentTarget.id, true);
      e.currentTarget.style.background ='white'
      DRAW_RECT = true;
      break;
    case 'selectbutton':
      setState(e.currentTarget.id, true);
      e.currentTarget.style.background ='white'
      SELECT_ELEM = true;
    case 'linkbutton':
      setState(e.currentTarget.id, true);
      e.currentTarget.style.background ='white'
      LINK_ELEM = true;
      break;
    
    default:
      break;
  }
}

function resetStateAll() {
  $('.btn').each(function () { 
    this.style.background = "grey";
  });
  setState('clearbutton', false);
  setState('unbindbutton', false);
  setState('selectbutton', false);
  setState('rectbutton', false);
  setState('linkbutton', false);
  DRAW_RECT = false;
  SELECT_ELEM = false;
  LINK_ELEM = false;
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

//END BUTTON FUNCTIONS

function getDragArea(dragAreaType, X, Y) {
  var dragAreaPath = [];
  switch (dragAreaType) { //TODO deze weghalen relatief maken en bij onload zetten. 
    case 'C':
    dragAreaPath = [
        "M", X - 1/6 * RECT_WIDTH, Y - 1/6 * RECT_HEIGHT, 
        "L", X + 1/6 * RECT_WIDTH, Y - 1/6 * RECT_HEIGHT,
        "L", X + 1/2 * RECT_WIDTH, Y - 1/2 * RECT_HEIGHT,
        "L", X - 1/2 * RECT_WIDTH, Y - 1/2 * RECT_HEIGHT,	
        "L", X - 1/6 * RECT_WIDTH, Y - 1/6 * RECT_HEIGHT,
      ]; 
      break;			
    case 'I':
    dragAreaPath = [
        "M", X - 1/6 * RECT_WIDTH, Y + 1/6 * RECT_HEIGHT, 
        "L", X - 1/2 * RECT_WIDTH, Y + 1/2 * RECT_HEIGHT,
        "L", X - 1/2 * RECT_WIDTH, Y - 1/2 * RECT_HEIGHT, 
        "L", X - 1/6 * RECT_WIDTH, Y - 1/6 * RECT_HEIGHT,
        "L", X - 1/6 * RECT_WIDTH, Y + 1/6 * RECT_HEIGHT 
      ]; 
      break;
    case 'M':
    dragAreaPath =[
        "M", X - 1/6 * RECT_WIDTH, Y + 1/6 * RECT_HEIGHT, 
        "L", X + 1/6 * RECT_WIDTH, Y + 1/6 * RECT_HEIGHT,
        "L", X + 1/2 * RECT_WIDTH, Y + 1/2 * RECT_HEIGHT,
        "L", X - 1/2 * RECT_WIDTH, Y + 1/2 * RECT_HEIGHT,	
        "L", X - 1/6 * RECT_WIDTH, Y + 1/6 * RECT_HEIGHT,
      ];
      
      break;
    case 'O':
    dragAreaPath = [
        "M", X + 1/6 * RECT_WIDTH, Y + 1/6 * RECT_HEIGHT, 
        "L", X + 1/2 * RECT_WIDTH, Y + 1/2 * RECT_HEIGHT,
        "L", X + 1/2 * RECT_WIDTH, Y - 1/2 * RECT_HEIGHT, 
        "L", X + 1/6 * RECT_WIDTH, Y - 1/6 * RECT_HEIGHT,
        "L", X + 1/6 * RECT_WIDTH, Y + 1/6 * RECT_HEIGHT 
      ];
      break;
  
    default:
    dragAreaPath = [];
      break;
  }
  return dragAreaPath;
}

function cleanPathArray(array) { //removes duplicate points and points that are useless to the path
  let cleanArray = [];
  let storedCoords = [[1,1],[0,0]];
  for (let i = 0; i < array.length; i++) {
    let x1 = array[i][1][0] 
    let x2 = array[i][0][0]
    let x3 = storedCoords[0][0]
    let x4 = storedCoords[1][0]
    let y1 = array[i][1][1] //the if statements wont accept array[][] == array [][], so created local variables to fix that. 
    let y2 = array[i][0][1]
    let y3 = storedCoords[0][1]
    let y4 = storedCoords[1][1]
    if (!((x2 == x1 && y2 == y1))) {
      cleanArray.push(array[i]);
    }
    if (((y1 == y2) && (y3 == y4)) || ((x1 == x2) && (x4 == x3))) {
      cleanArray.pop();
      cleanArray.push([storedCoords[0], array[i][1]]); 
    } else {
      storedCoords = array[i]
    }
  }
  return cleanArray;
}

// function reverseArray (array) {
//   let reveresedArray = [];
//   for(let i = array.length - 1; i >= 0; i--) {
//     reveresedArray.push(array[i]);
//   }
//   return reveresedArray;
// }