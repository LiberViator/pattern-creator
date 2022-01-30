const body = document.querySelector('body');
const sandbox = document.querySelector('#sandbox');

// Selector
var currentResizer;

// Object
var activeObject;
var initialPos = [0, 0];
var initialDim = [0, 0];
var initialRot = 0;
var isMoving = false;
var isResizing = false;
var isRotating = false;
const isDraggable = function(target) {
  if (target.classList.contains('draggable')) return true
}

// Mouse
var initialMousePos = [0, 0];

// Constrol Panel
class CtrlPanel {
  constructor() {
    const panel = document.createElement("nav");
    panel.id = 'cp';
    body.appendChild(panel);

    const cpObjects = document.createElement("div");
    cpObjects.id = 'cp__objects';
    cpObjects.classList.add('panel', 'cp__container', 'cp__container--scroll');
    panel.appendChild(cpObjects);

    const cpInstruments = document.createElement("div");
    cpInstruments.id = 'cp__instruments';
    cpInstruments.classList.add('panel', 'cp__container', 'cp__container--scroll');
    panel.appendChild(cpInstruments);
  }

  showObjects() {}

  showInstruments() {}

  showPosition() {
    document.getElementsByClassName('panel').style.display = 'block';
  }

  showSize() {}

  showAngle() {}

  hideAll() {
    for (let i in document.querySelector('#cp')) {
      if (i.classList.contains('panel')) {
        i.style.display = 'none';
      }
    }
  }
}

// const ctrlPanel = new CtrlPanel();


function objectRemove() {
  if (activeObject) {
    activeObject.remove();
    activeObject = undefined;
  }
}

document.querySelector('#cp__instruments__remove').addEventListener('pointerdown', objectRemove);


// Transforming
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
        initialMousePos = [Math.round(e.pageX), Math.round(e.pageY)];
        initialDim = [activeObject.getBoundingClientRect().width, activeObject.getBoundingClientRect().height];
        initialPos = [activeObject.getBoundingClientRect().left, activeObject.getBoundingClientRect().top];
        isResizing = true;
        document.getElementById('cp__instruments').style.display = 'none';
        document.querySelector('#cp__size').style.display = 'flex';
        // initialRot = ;
        document.addEventListener('pointermove', objectResize);
        document.addEventListener('pointerup', stopResize);
      });
    }
    rotation.addEventListener('pointerdown', function startRotate(e) {
      e.preventDefault();
      initialMousePos = [Math.round(e.pageX), Math.round(e.pageY)];
      initialDim = [activeObject.getBoundingClientRect().width, activeObject.getBoundingClientRect().height];
      initialPos = [activeObject.getBoundingClientRect().left, activeObject.getBoundingClientRect().top];
      isRotating = true;
      document.getElementById('cp__instruments').style.display = 'none';
      document.querySelector('#cp__angle').style.display = 'flex';
      // initialRot = ;
      document.addEventListener('pointermove', objectRotate);
      document.addEventListener('pointerup', stopRotate);
    });
  }
}

function objectSelect(e) {
  if (isDraggable(e.target)) {
    isMoving = true;
    initialPos = [
      e.target.offsetLeft - Math.round(e.pageX),
      e.target.offsetTop - Math.round(e.pageY)
    ];
  }
  if (!activeObject && isDraggable(e.target)) {
    activeObject = e.target;
    const selector = new Selector(activeObject);
    console.log('hop');
    document.getElementById('cp__instruments').style.display = 'flex';
  } else if (activeObject) {
    if (isDraggable(e.target) && e.target !== activeObject) {
      activeObject = e.target;
      document.querySelector('#selector').remove()
      const selector = new Selector(activeObject);
    }
  }
}

function objectMove(e) {
  e.preventDefault();
  const mousePos = [Math.round(e.pageX), Math.round(e.pageY)];
  if (activeObject && isMoving) {
    activeObject.style.left = (initialPos[0] + mousePos[0]) + 'px';
    activeObject.style.top = (initialPos[1] + mousePos[1]) + 'px';
    // ctrlPanel.hideAll();
    document.getElementById('cp__instruments').style.display = 'none';
    document.querySelector('#cp__position').style.display = 'flex';
    document.getElementById('cp__position__value').innerHTML = 'X: ' + activeObject.getBoundingClientRect().left + ' Y: ' + activeObject.getBoundingClientRect().top;
  }
}

function stopMove(e) {
  isMoving = false;
  document.querySelector('#cp__position').style.display = 'none';
  document.querySelector('#cp__instruments').style.display = 'flex';
  if (e.target === body || e.target === sandbox) {
   activeObject = undefined;
   document.querySelector('#selector').remove()
   document.querySelector('#cp__instruments').style.display = 'none';
 }
}

function objectResize(e) {
  const mousePos = [Math.round(e.pageX), Math.round(e.pageY)];
  // var mouseWidthDiff = e.pageX - mousePos[0];
  // var mouseHeightDiff = e.pageY - mousePos[1];
  // var rotWidthDiff = cosFraction * mouseWidthDiff + sinFraction * mouseHeightDiff;
  // var rotHeightDiff = cosFraction * mouseHeightDiff - sinFraction * mouseWidthDiff;

  if (currentResizer.id === 'topleft') {
    activeObject.style.width = initialDim[0] - (mousePos[0] - initialMousePos[0]) + 'px';
    activeObject.style.height = initialDim[1] - (mousePos[1] - initialMousePos[1]) + 'px';
    activeObject.style.left = initialPos[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    activeObject.style.top = initialPos[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'topright') {
    activeObject.style.width = initialDim[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    activeObject.style.height = initialDim[1] - (mousePos[1] - initialMousePos[1]) + 'px';
    activeObject.style.top = initialPos[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomright') {
    activeObject.style.width = initialDim[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    activeObject.style.height = initialDim[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomleft') {
    activeObject.style.width = initialDim[0] - (mousePos[0] - initialMousePos[0]) + 'px';
    activeObject.style.height = initialDim[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    activeObject.style.left = initialPos[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'top') {
    activeObject.style.height = initialDim[1] - (mousePos[1] - initialMousePos[1]) + 'px';
    activeObject.style.top = initialPos[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'right') {
    activeObject.style.width = initialDim[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottom') {
    activeObject.style.height = initialDim[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  } else if (currentResizer.id === 'left') {
    activeObject.style.width = initialDim[0] - (mousePos[0] - initialMousePos[0]) + 'px';
    activeObject.style.left = initialPos[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    document.getElementById('cp__size__value').innerHTML = activeObject.getBoundingClientRect().width + ' x ' + activeObject.getBoundingClientRect().height;
  }
}

function stopResize(e) {
  document.querySelector('#cp__size').style.display = 'none';
  document.getElementById('cp__instruments').style.display = 'flex';
  currentResizer = undefined;
  isResizing = false;
  document.removeEventListener('pointermove', objectResize);
}

function objectRotate(e) {
  if (activeObject) {}
}

function stopRotate(e) {
  isRotating = false;
  document.querySelector('#cp__angle').style.display = 'none';
  document.removeEventListener('pointermove', objectResize);
}

// Init
document.addEventListener('pointerdown', objectSelect);
document.addEventListener('pointermove', objectMove);
document.addEventListener('pointerup', stopMove);
