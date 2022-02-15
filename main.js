const body = document.querySelector('body');
const workspace = document.querySelector('#workspace');
const preview = document.querySelector('#preview');
const workspaceMiddle = workspace.querySelector('.middle')

// Mouse
let mousePos;
let initMousePos;

// Workspace
var zoom = 1;

const sandbox = document.querySelector('#sandbox');
var canvasPos = {
  x: sandbox.getBoundingClientRect().left,
  y: sandbox.getBoundingClientRect().top
};
var canvasDim = {
  width: sandbox.getBoundingClientRect().width,
  height: sandbox.getBoundingClientRect().height
};

function canvasUpdate() {
  canvasPos = {
    x: sandbox.getBoundingClientRect().left,
    y: sandbox.getBoundingClientRect().top
  };
  selector.selectorUpdate();
}

sandbox.addEventListener('load', canvasUpdate);
window.addEventListener('resize', canvasUpdate);
window.addEventListener('orientationchange', canvasUpdate);

// Constrol Panel
const ctrlPanel = document.querySelector('#cp');
const cpObjects = document.querySelector('#cp__objects');
const cpObjectsRect = document.querySelector('#cp__objects__rect');
const cpObjectsCircle = document.querySelector('#cp__objects__circle');
// const cpObjectsTriangle = document.querySelector('#cp__objects__triangle');
const cpOptions = document.querySelector('#cp__options');
const cpOptionsClone = document.querySelector('#cp__options__clone');
const cpOptionsColor = document.querySelector('#cp__options__color__input');
const cpOptionsRemove = document.querySelector('#cp__options__remove');
const cpPosition = document.querySelector('#cp__position');
const cpPositionValueX = document.querySelector('#cp__position__valueX');
const cpPositionValueY = document.querySelector('#cp__position__valueY');
const cpSize = document.querySelector('#cp__size');
const cpSizeValueW = document.querySelector('#cp__size__valueW');
const cpSizeValueH = document.querySelector('#cp__size__valueH');
const cpAngle = document.querySelector('#cp__angle');
const cpAngleValue = document.querySelector('#cp__angle__value');


function updatePosition() {
  cpPositionValueX.innerHTML = activeObject.getBBox().x;
  cpPositionValueY.innerHTML = activeObject.getBBox().y;
}

function updateSize() {
  cpSizeValueW.innerHTML = activeObject.getBBox().width;
  cpSizeValueH.innerHTML = activeObject.getBBox().height;
}

function updateAngle() {}

function showPanel(panel) {
  const windows = document.querySelectorAll('.panel');
  windows.forEach(window => window.style.display = 'none');

  if (panel === 'objects') {
    cpObjects.style.display = 'flex';
  } else if (panel === 'options') {
    cpOptions.style.display = 'flex';
  } else if (panel === 'position') {
    cpPosition.style.display = 'flex';
  } else if (panel === 'size') {
    cpSize.style.display = 'flex';
  } else if (panel === 'angle') {
    cpAngle.style.display = 'flex';
  }
}

cpObjectsRect.addEventListener('click', createRect);
cpObjectsCircle.addEventListener('click', createCircle);
// cpObjectsTriangle.addEventListener('click', createTriangle);
cpOptionsClone.addEventListener('click', objectClone);
cpOptionsColor.addEventListener('input', objectColor);
cpOptionsRemove.addEventListener('click', objectRemove);

// Transforming
var currentResizer;

class Selector {
  constructor() {
    this.selector = document.createElement('div');
    this.selector.id = 'selector';
    this.selector.classList.add('transforming');

    const resizeTopLeft = document.createElement('div');
    resizeTopLeft.id = 'topleft';
    resizeTopLeft.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    this.selector.appendChild(resizeTopLeft);

    const resizeTopRight = document.createElement('div');
    resizeTopRight.id = 'topright';
    resizeTopRight.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    this.selector.appendChild(resizeTopRight);

    const resizeBottomRight = document.createElement('div');
    resizeBottomRight.id = 'bottomright';
    resizeBottomRight.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    this.selector.appendChild(resizeBottomRight);

    const resizeBottomLeft = document.createElement('div');
    resizeBottomLeft.id = 'bottomleft';
    resizeBottomLeft.classList.add('transforming', 'selector__resize', 'selector__resize__diagonal');
    this.selector.appendChild(resizeBottomLeft);

    const resizeTop = document.createElement('div');
    resizeTop.id = 'top';
    resizeTop.classList.add('transforming', 'selector__resize', 'selector__resize__vertical');
    this.selector.appendChild(resizeTop);

    const resizeRight = document.createElement('div');
    resizeRight.id = 'right';
    resizeRight.classList.add('transforming', 'selector__resize', 'selector__resize__horizontal');
    this.selector.appendChild(resizeRight);

    const resizeBottom = document.createElement('div');
    resizeBottom.id = 'bottom';
    resizeBottom.classList.add('transforming', 'selector__resize', 'selector__resize__vertical');
    this.selector.appendChild(resizeBottom);

    const resizeLeft = document.createElement('div');
    resizeLeft.id = 'left';
    resizeLeft.classList.add('transforming', 'selector__resize', 'selector__resize__horizontal');
    this.selector.appendChild(resizeLeft);

    const rotation = document.createElement('div');
    rotation.id = 'rotation';
    rotation.classList.add('transforming');
    this.selector.appendChild(rotation);

    for (var i of this.selector.querySelectorAll('.selector__resize')) {
      i.addEventListener('pointerdown', startResize);
    }
    rotation.addEventListener('pointerdown', startRotate);
  }

  selectorInit() {
    workspace.appendChild(this.selector);
    this.selector.style.width = (activeObject.getBBox().width * zoom) + 'px';
    this.selector.style.height = (activeObject.getBBox().height * zoom) + 'px';
    this.selector.style.left = ((activeObject.getBBox().x + canvasPos.x) * zoom) + 'px';
    this.selector.style.top = ((activeObject.getBBox().y + canvasPos.y) * zoom) + 'px';
  }

  selectorRemove() {
    workspace.removeChild(this.selector);
  }

  selectorUpdate() {
    if (activeObject) {
      this.selector.style.width = (activeObject.getBBox().width * zoom) + 'px';
      this.selector.style.height = (activeObject.getBBox().height * zoom) + 'px';
      this.selector.style.left = ((activeObject.getBBox().x + canvasPos.x) * zoom) + 'px';
      this.selector.style.top = ((activeObject.getBBox().y + canvasPos.y) * zoom) + 'px';
    }
  }
}

const selector = new Selector();

// Object
var activeObject;
let initObjPos;
let initObjDim;
let initObjRot;
var isMoving = false;
var isResizing = false;
var isRotating = false;
const isDraggable = function (target) {
  if (target.classList.contains('draggable')) return true
}

function createRect() {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.style.width = '100px';
  rect.style.height = '100px';
  rect.style.x = '100px';
  rect.style.y = '100px';
  rect.classList.add('draggable');
  sandbox.appendChild(rect);

  activeObject = rect;
  selector.selectorInit();
  showPanel('options');
}

function createCircle() {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  circle.style.width = '100px';
  circle.style.height = '100px';
  circle.style.x = '100px';
  circle.style.y = '100px';
  circle.style.rx = "100%";
  circle.style.ry = "100%";
  circle.classList.add('draggable');
  sandbox.appendChild(circle);
}

function createTriangle() {
  const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  triangle.style.width = '100px';
  triangle.style.height = '100px';
  triangle.style.x = '100px';
  triangle.style.y = '100px';
  triangle.setAttribute('d', 'M0,0 150,0 150,50 0,50');
  triangle.classList.add('draggable');
  sandbox.appendChild(triangle);
}

function objectInit(e) {
  if (isDraggable(e.target)) {
    isMoving = true;
    initObjPos = {
      x: e.target.getBBox().x,
      y: e.target.getBBox().y
    };
    initMousePos = {
      x: e.pageX,
      y: e.pageY
    };
  }
  if (!activeObject && isDraggable(e.target)) {
    activeObject = e.target;
    selector.selectorInit();
    showPanel('options');
  } else if (activeObject) {
    if (isDraggable(e.target) && e.target !== activeObject) {
      activeObject = e.target;
      selector.selectorRemove();
      selector.selectorInit();
    } else if (e.target === workspaceMiddle || e.target === sandbox) {
      activeObject = undefined;
      selector.selectorRemove();
      showPanel('objects');
    }
  }
}

function objectMove(e) {
  e.preventDefault();
  mousePos = {
    x: e.pageX,
    y: e.pageY
  };
  if (activeObject && isMoving) {
    activeObject.style.x = (initObjPos.x + ((mousePos.x - initMousePos.x) / zoom)).toFixed() + 'px';
    activeObject.style.y = (initObjPos.y + ((mousePos.y - initMousePos.y) / zoom)).toFixed() + 'px';
    showPanel('position');
    updatePosition()
    selector.selectorUpdate();
  }
}

function stopMove(e) {
  isMoving = false;
  showPanel('options');
  if (!activeObject) {
    showPanel('objects')
  }
}

function startResize(e) {
  e.preventDefault();
  currentResizer = e.currentTarget;
  initMousePos = {
    x: e.pageX,
    y: e.pageY
  };
  initObjPos = {
    x: activeObject.getBBox().x,
    y: activeObject.getBBox().y
  };
  initObjDim = {
    width: activeObject.getBBox().width,
    height: activeObject.getBBox().height
  };
  isResizing = true;
  showPanel('size');
  // initObjRot = ;
  document.addEventListener('pointermove', objectResize);
  document.addEventListener('pointerup', stopResize);
}

function objectResize(e) {
  mousePos = {
    x: e.pageX,
    y: e.pageY
  };
  selector.selectorUpdate();
  updateSize();

  if (currentResizer.id === 'topleft') {
    activeObject.style.width = Math.round(initObjDim.width - ((mousePos.x - initMousePos.x) / zoom)) + 'px';
    activeObject.style.height = Math.round(initObjDim.height - ((mousePos.y - initMousePos.y) / zoom)) + 'px';
    activeObject.style.x = Math.round(initObjPos.x + ((mousePos.x - initMousePos.x) / zoom)) + 'px';
    activeObject.style.y = Math.round(initObjPos.y + ((mousePos.y - initMousePos.y) / zoom)) + 'px';
  } else if (currentResizer.id === 'topright') {
    activeObject.style.width = Math.round(initObjDim.width + ((mousePos.x - initMousePos.x) / zoom)) + 'px';
    activeObject.style.height = Math.round(initObjDim.height - ((mousePos.y - initMousePos.y) / zoom)) + 'px';
    activeObject.style.y = Math.round(initObjPos.y + ((mousePos.y - initMousePos.y) / zoom)) + 'px';
  } else if (currentResizer.id === 'bottomright') {
    activeObject.style.width = Math.round(initObjDim.width + ((mousePos.x - initMousePos.x) / zoom)) + 'px';
    activeObject.style.height = Math.round(initObjDim.height + ((mousePos.y - initMousePos.y) / zoom)) + 'px';
  } else if (currentResizer.id === 'bottomleft') {
    activeObject.style.width = Math.round(initObjDim.width - ((mousePos.x - initMousePos.x) / zoom)) + 'px';
    activeObject.style.height = Math.round(initObjDim.height + ((mousePos.y - initMousePos.y) / zoom)) + 'px';
    activeObject.style.x = Math.round(initObjPos.x + ((mousePos.x - initMousePos.x) / zoom)) + 'px';
  } else if (currentResizer.id === 'top') {
    activeObject.style.height = Math.round(initObjDim.height - ((mousePos.y - initMousePos.y) / zoom)) + 'px';
    activeObject.style.y = Math.round(initObjPos.y + ((mousePos.y - initMousePos.y) / zoom)) + 'px';
  } else if (currentResizer.id === 'right') {
    activeObject.style.width = Math.round(initObjDim.width + ((mousePos.x - initMousePos.x) / zoom)) + 'px';
  } else if (currentResizer.id === 'bottom') {
    activeObject.style.height = Math.round(initObjDim.height + ((mousePos.y - initMousePos.y) / zoom)) + 'px';
  } else if (currentResizer.id === 'left') {
    activeObject.style.width = Math.round(initObjDim.width - ((mousePos.x - initMousePos.x) / zoom)) + 'px';
    activeObject.style.x = Math.round(initObjPos.x + ((mousePos.x - initMousePos.x) / zoom)) + 'px';
  }
}

function stopResize(e) {
  selector.selectorUpdate();
  showPanel('options');
  currentResizer = undefined;
  isResizing = false;
  document.removeEventListener('pointermove', objectResize);
  document.removeEventListener('pointerup', stopResize);
}

function startRotate(e) {
  e.preventDefault();
  initMousePos = {
    x: Math.round(e.pageX) - sandbox.offsetLeft,
    y: Math.round(e.pageY - sandbox.offsetTop)
  };
  initObjDim = {
    width: activeObject.getBBox().width,
    height: activeObject.getBBox().height
  };
  initObjPos = {
    x: activeObject.getBBox().x,
    y: activeObject.getBBox().y
  };
  isRotating = true;
  showPanel('angle');
  // initObjRot = ;
  document.addEventListener('pointermove', objectRotate);
  document.addEventListener('pointerup', stopRotate);
}

function objectRotate(e) {
  if (activeObject) {}
}

function stopRotate(e) {
  isRotating = false;
  showPanel('options');
  document.removeEventListener('pointermove', objectRotate);
  document.removeEventListener('pointerup', stopRotate);
}

function objectRemove() {
  if (activeObject) {
    activeObject.remove();
    activeObject = undefined;
    selector.selectorRemove();
    showPanel('objects');
  }
}

function objectClone() {
  if (activeObject) {
    const clonedObj = activeObject.cloneNode(false);
    activeObject = clonedObj;
    sandbox.appendChild(activeObject);
    selector.selectorRemove();
    selector.selectorInit();
  }
}

function objectColor() {
  if (activeObject) {
    activeObject.style.fill = cpOptionsColor.value;
  }
}

function objectBringFront() {
  if (activeObject) {
    sandbox.lastElementChild.parentNode.insertBefore(activeObject, sandbox.lastElementChild.nextSibling);
  }
}

document.addEventListener('pointerdown', objectInit);
document.addEventListener('pointermove', objectMove);
document.addEventListener('pointerup', stopMove);

// Navigation
const doneButton = workspace.querySelector('#done');
const backButton = preview.querySelector('.preview__back');

function workspaceShow() {
  preview.style.display = 'none';
  workspace.style.display = 'flex';
  canvasUpdate();
}

function previewShow() {
  workspace.style.display = 'none';
  preview.style.display = 'flex';

  widthInput.value = canvasDim.width * 2;
  heightInput.value = canvasDim.height * 2;

  generateCanvas()
}

doneButton.addEventListener('click', previewShow);
backButton.addEventListener('click', workspaceShow);

// Export
const canvas = preview.querySelector('#preview__canvas');
const widthInput = document.querySelector('#width');
const heightInput = document.querySelector('#height');
const formatInput = document.querySelectorAll('input[name="format"]');
const downloadButton = document.querySelector('.preview__download');

var image;

widthInput.addEventListener('input', generateImg);
heightInput.addEventListener('input', generateImg);
formatInput.forEach(radio => radio.addEventListener('change', chooseFormat));

function chooseFormat(button) {
  const labels = document.querySelectorAll('label');
  const label = document.querySelector(`label[for='${button.target.value}']`);

  labels.forEach((e) => (e.classList.remove('preview__formats__labels-list__label--selected')));
  label.classList.add('preview__formats__labels-list__label--selected');

  generateImg();
}

function generateCanvas() {
  let sandboxCloned = sandbox.cloneNode(true);

  let outerHTML = sandboxCloned.outerHTML,
    blob = new Blob([outerHTML], {
      type: 'image/svg+xml;charset=utf-8'
    });

  let URL = window.URL || window.webkitURL || window;
  let blobURL = URL.createObjectURL(blob);

  image = new Image();
  image.onload = () => {
    generateImg();
  };
  image.src = blobURL;
}

function generateImg() {
  if (widthInput.value >= canvasDim.width && heightInput.value >= canvasDim.height) {
    document.querySelectorAll('.preview__dimensions__number-input').forEach((e) => (e.classList.remove('preview__dimensions__number-input--error')))
    canvas.width = widthInput.value;
    canvas.height = heightInput.value;
    let context = canvas.getContext('2d');
    var pattern = context.createPattern(image, 'repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, widthInput.value, heightInput.value);
  } else {
    document.querySelectorAll('.preview__dimensions__number-input').forEach((e) => (e.classList.add('preview__dimensions__number-input--error')))
  }
  downloadButton.setAttribute('href', canvas.toDataURL(`image/${document.querySelector('input[name="format"]:checked').value}`));
  downloadButton.setAttribute('download', `image.${document.querySelector('input[name="format"]:checked').value}`);
}