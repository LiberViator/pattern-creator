const body = document.querySelector('body');

const svg = document.querySelector('#svg');


document.querySelector('#bg').style.backgroundImage = 'url(' + svg + ')'

// Canvas
const sandbox = document.querySelector('#sandbox');
let canvasPos;

// Object
var activeObject;
let initObjPos;
let initObjDim;
let initObjRot;
var isMoving = false;
var isResizing = false;
var isRotating = false;
const isDraggable = function(target) {
  if (target.classList.contains('draggable')) return true
}

// Mouse
let mousePos;
let initMousePos;

// Constrol Panel
const objectCloneButton = document.querySelector('#cp__instruments__clone');
const objectColorButton = document.querySelector('#cp__instruments__clone__input');
const objectRemoveButton = document.querySelector('#cp__instruments__remove');

function objectRemove() {
  if (activeObject) {
    activeObject.remove();
    activeObject = undefined;
  }
}

function objectClone() {
  if (activeObject) {
    const clonedObj = activeObject.cloneNode(false);
    activeObject = clonedObj;
    document.querySelector('#selector').remove()
    const selector = new Selector(activeObject);
    sandbox.appendChild(activeObject);
  }
}

function objectColor() {
  if (activeObject) {
    activeObject.style.backgroundColor = objectColorButton.value;
  }
}

function objectOpacity() {
  if (activeObject) {
    activeObject.style.backgroundColor = objectColorButton.value;
  }
}


objectCloneButton.addEventListener('pointerup', objectClone);
objectColorButton.addEventListener('input', objectColor);
objectRemoveButton.addEventListener('pointerup', objectRemove);


// Transforming
var currentResizer;

class Selector {
  constructor(element) {
    const selector = document.createElement("div");
    selector.id = 'selector';
    selector.classList.add('transforming');
    element.appendChild(selector);

    const resizeTopLeft = document.createElement("div");
    resizeTopLeft.id = 'topleft';
    resizeTopLeft.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    selector.appendChild(resizeTopLeft);

    const resizeTopRight = document.createElement("div");
    resizeTopRight.id = 'topright';
    resizeTopRight.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    selector.appendChild(resizeTopRight);

    const resizeBottomRight = document.createElement("div");
    resizeBottomRight.id = 'bottomright';
    resizeBottomRight.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    selector.appendChild(resizeBottomRight);

    const resizeBottomLeft = document.createElement("div");
    resizeBottomLeft.id = 'bottomleft';
    resizeBottomLeft.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    selector.appendChild(resizeBottomLeft);

    const resizeTop = document.createElement("div");
    resizeTop.id = 'top';
    resizeTop.classList.add('transforming', 'selector__resize', 'selector__resize__vertical');
    selector.appendChild(resizeTop);

    const resizeRight = document.createElement("div");
    resizeRight.id = 'right';
    resizeRight.classList.add('transforming', 'selector__resize', 'selector__resize__horizontal');
    selector.appendChild(resizeRight);

    const resizeBottom = document.createElement("div");
    resizeBottom.id = 'bottom';
    resizeBottom.classList.add('transforming', 'selector__resize', 'selector__resize__vertical');
    selector.appendChild(resizeBottom);

    const resizeLeft = document.createElement("div");
    resizeLeft.id = 'left';
    resizeLeft.classList.add('transforming', 'selector__resize', 'selector__resize__horizontal');
    selector.appendChild(resizeLeft);

    const rotation = document.createElement("div");
    rotation.id = 'rotation';
    rotation.classList.add('transforming');
    selector.appendChild(rotation);

    // const unitCircle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // unitCircle.id = 'unitCircle';
    // selector.appendChild(unitCircle);
    //
    // const circlePath = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    // circlePath.setAttribute("cx", "50%");
    // circlePath.setAttribute("cy", "50%");
    // circlePath.setAttribute("r", "50%");
    // unitCircle.appendChild(circlePath);

    for (var i of document.querySelectorAll('.selector__resize')) {
      i.addEventListener('pointerdown', function startResize(e) {
        e.preventDefault();
        currentResizer = e.currentTarget;
        initMousePos = [Math.round(e.pageX), Math.round(e.pageY)];
        initObjDim = [activeObject.getBoundingClientRect().width, activeObject.getBoundingClientRect().height];
        initObjPos = [activeObject.getBoundingClientRect().left, activeObject.getBoundingClientRect().top];
        isResizing = true;
        document.getElementById('cp__instruments').style.display = 'none';
        document.querySelector('#cp__size').style.display = 'flex';
        // initObjRot = ;
        document.addEventListener('pointermove', objectResize);
        document.addEventListener('pointerup', stopResize);
      });
    }
    rotation.addEventListener('pointerdown', function startRotate(e) {
      e.preventDefault();
      initMousePos = [Math.round(e.pageX) - sandbox.offsetLeft, Math.round(e.pageY - sandbox.offsetTop)];
      initObjDim = [activeObject.getBoundingClientRect().width, activeObject.getBoundingClientRect().height];
      initObjPos = [activeObject.getBoundingClientRect().left, activeObject.getBoundingClientRect().top];
      isRotating = true;
      document.getElementById('cp__instruments').style.display = 'none';
      document.querySelector('#cp__angle').style.display = 'flex';
      // initObjRot = ;
      document.addEventListener('pointermove', objectRotate);
      document.addEventListener('pointerup', stopRotate);
    });
  }
}

function objectSelect(e) {
  if (isDraggable(e.target)) {
    isMoving = true;
    initObjPos = [
      e.target.offsetLeft - Math.round(e.pageX),
      e.target.offsetTop - Math.round(e.pageY)
    ];
  }
  if (!activeObject && isDraggable(e.target)) {
    activeObject = e.target;
    const selector = new Selector(activeObject);
    document.getElementById('cp__instruments').style.display = 'flex';
  } else if (activeObject) {
    if (isDraggable(e.target) && e.target !== activeObject) {
      activeObject = e.target;
      document.querySelector('#selector').remove()
      const selector = new Selector(activeObject);
    } else if (e.target === body || e.target === sandbox) {
      activeObject = undefined;
      document.querySelector('#selector').remove()
      document.querySelector('#cp__instruments').style.display = 'none';
    }
  }
}

function objectMove(e) {
  e.preventDefault();
  mousePos = [Math.round(e.pageX), Math.round(e.pageY)];
  if (activeObject && isMoving) {
    activeObject.style.left = (initObjPos[0] + mousePos[0]) + 'px';
    activeObject.style.top = (initObjPos[1] + mousePos[1]) + 'px';
    // ctrlPanel.hideAll();
    document.getElementById('cp__instruments').style.display = 'none';
    document.querySelector('#cp__position').style.display = 'flex';
    document.getElementById('cp__position__value').innerHTML = 'X: ' + activeObject.offsetLeft + ' Y: ' + activeObject.offsetTop;
  }
}

function stopMove(e) {
  isMoving = false;
  document.querySelector('#cp__position').style.display = 'none';
  document.querySelector('#cp__instruments').style.display = 'flex';
  if (!activeObject) {
    document.querySelector('#cp__instruments').style.display = 'none';
  }
}

function objectResize(e) {
  mousePos = [Math.round(e.pageX), Math.round(e.pageY)];
  canvasPos = [sandbox.getBoundingClientRect().left, sandbox.getBoundingClientRect().top];
  // var mouseWidthDiff = e.pageX - mousePos[0];
  // var mouseHeightDiff = e.pageY - mousePos[1];
  // var rotWidthDiff = cosFraction * mouseWidthDiff + sinFraction * mouseHeightDiff;
  // var rotHeightDiff = cosFraction * mouseHeightDiff - sinFraction * mouseWidthDiff;

  if (currentResizer.id === 'topleft') {
    activeObject.style.width = initObjDim[0] - (mousePos[0] - initMousePos[0]) + 'px';
    activeObject.style.height = initObjDim[1] - (mousePos[1] - initMousePos[1]) + 'px';
    activeObject.style.left = initObjPos[0] + (mousePos[0] - canvasPos[0] - initMousePos[0]) + 'px';
    activeObject.style.top = initObjPos[1] + (mousePos[1] - canvasPos[1] - initMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'topright') {
    activeObject.style.width = initObjDim[0] + (mousePos[0] - initMousePos[0]) + 'px';
    activeObject.style.height = initObjDim[1] - (mousePos[1] - initMousePos[1]) + 'px';
    activeObject.style.top = initObjPos[1] + (mousePos[1] - canvasPos[1] - initMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomright') {
    activeObject.style.width = initObjDim[0] + (mousePos[0] - initMousePos[0]) + 'px';
    activeObject.style.height = initObjDim[1] + (mousePos[1] - initMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomleft') {
    activeObject.style.width = initObjDim[0] - (mousePos[0] - initMousePos[0]) + 'px';
    activeObject.style.height = initObjDim[1] + (mousePos[1] - initMousePos[1]) + 'px';
    activeObject.style.left = initObjPos[0] + (mousePos[0] - canvasPos[0] - initMousePos[0]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'top') {
    activeObject.style.height = initObjDim[1] - (mousePos[1] - initMousePos[1]) + 'px';
    activeObject.style.top = initObjPos[1] + (mousePos[1] - canvasPos[1] - initMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'right') {
    activeObject.style.width = initObjDim[0] + (mousePos[0] - initMousePos[0]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottom') {
    activeObject.style.height = initObjDim[1] + (mousePos[1] - initMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'left') {
    activeObject.style.width = initObjDim[0] - (mousePos[0] - initMousePos[0]) + 'px';
    activeObject.style.left = initObjPos[0] + (mousePos[0] - canvasPos[0] - initMousePos[0]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  }
}

function stopResize(e) {
  document.querySelector('#cp__size').style.display = 'none';
  document.getElementById('cp__instruments').style.display = 'flex';
  currentResizer = undefined;
  isResizing = false;
  document.removeEventListener('pointermove', objectResize);
  document.removeEventListener('pointerup', stopResize);
}

function objectRotate(e) {
  if (activeObject) {}
}

function stopRotate(e) {
  isRotating = false;
  document.querySelector('#cp__angle').style.display = 'none';
  document.removeEventListener('pointermove', objectResize);
}

document.addEventListener('pointerdown', objectSelect);
document.addEventListener('pointermove', objectMove);
document.addEventListener('pointerup', stopMove);
