const sandbox = document.querySelector('#sandbox');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const isNavigation = function(target) {
  if (target.classList.contains('navigation')) return true
}
var currentResizer;

var activeElement;
var initialPos = [0, 0];
var initialDim = [0, 0];
var initialRot = 0;

// var initialRadians = initialRot * Math.PI / 180;
// var cosFraction = Math.cos(initRadians);
// var sinFraction = Math.sin(initRadians);

var isMoving = false;
const isDraggable = function(target) {
  if (target.classList.contains('draggable')) return true
}

var initialMousePos = [0, 0];


class Navigation {
  constructor(element) {
    const selector = document.createElement("div");
    selector.id = 'selector';
    selector.classList.add('navigation');
    element.appendChild(selector);

    const resizeTopLeft = document.createElement("div");
    resizeTopLeft.classList.add('navigation', 'selector__resize', 'selector__resize__diagonal');
    resizeTopLeft.id = 'topleft';
    selector.appendChild(resizeTopLeft);

    const resizeTopRight = document.createElement("div");
    resizeTopRight.classList.add('navigation', 'selector__resize', 'selector__resize__diagonal');
    resizeTopRight.id = 'topright';
    selector.appendChild(resizeTopRight);

    const resizeBottomRight = document.createElement("div");
    resizeBottomRight.classList.add('navigation', 'selector__resize', 'selector__resize__diagonal');
    resizeBottomRight.id = 'bottomright';
    selector.appendChild(resizeBottomRight);

    const resizeBottomLeft = document.createElement("div");
    resizeBottomLeft.classList.add('navigation', 'selector__resize', 'selector__resize__diagonal');
    resizeBottomLeft.id = 'bottomleft';
    selector.appendChild(resizeBottomLeft);

    const resizeTop = document.createElement("div");
    resizeTop.classList.add('navigation', 'selector__resize', 'selector__resize__vertical');
    resizeTop.id = 'top';
    selector.appendChild(resizeTop);

    const resizeRight = document.createElement("div");
    resizeRight.classList.add('navigation', 'selector__resize', 'selector__resize__horizontal');
    resizeRight.id = 'right';
    selector.appendChild(resizeRight);

    const resizeBottom = document.createElement("div");
    resizeBottom.classList.add('navigation', 'selector__resize', 'selector__resize__vertical');
    resizeBottom.id = 'bottom';
    selector.appendChild(resizeBottom);

    const resizeLeft = document.createElement("div");
    resizeLeft.classList.add('navigation', 'selector__resize', 'selector__resize__horizontal');
    resizeLeft.id = 'left';
    selector.appendChild(resizeLeft);

    for (var i of document.querySelectorAll('.selector__resize')) {
      i.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        currentResizer = e.currentTarget;
        initialMousePos = [Math.round(e.pageX), Math.round(e.pageY)];
        initialDim = [activeElement.getBoundingClientRect().width, activeElement.getBoundingClientRect().height];
        initialPos = [activeElement.getBoundingClientRect().left, activeElement.getBoundingClientRect().top];
        // initialRot = ;
        document.addEventListener('pointermove', resizeElement);
        document.addEventListener('pointerup', stopResize);
      });
    }

    const sizes = document.createElement("div");
    sizes.id = 'sizes';
    sizes.innerHTML = "";
    selector.appendChild(sizes);
  }
}

function getPosition(e) {
  if (isDraggable(e.target)) {
    isMoving = true;
    initialPos = [
      e.target.offsetLeft - Math.round(e.pageX),
      e.target.offsetTop - Math.round(e.pageY)
    ];
  }
}

function selectElement(e) {
  if (!activeElement && isDraggable(e.target)) {
    activeElement = e.target;
    const selector = new Navigation(activeElement);
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (activeElement) {
    if (isDraggable(e.target) && e.target !== activeElement) {
      activeElement = e.target;
      document.querySelector('#selector').remove();
      const selector = new Navigation(activeElement);
      document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
    } else if (!isDraggable(e.target) && !isNavigation(e.target)) {
      activeElement = undefined;
      document.querySelector('#selector').remove();
    }
  }
}

function moveElement(e) {
  e.preventDefault();
  const mousePos = [Math.round(e.pageX), Math.round(e.pageY)];
  if (activeElement && isMoving) {
    activeElement.style.left = (initialPos[0] + mousePos[0]) + 'px';
    activeElement.style.top = (initialPos[1] + mousePos[1]) + 'px';
  }
};

function resizeElement(e) {
  const mousePos = [Math.round(e.pageX), Math.round(e.pageY)];
  // var mouseWidthDiff = e.pageX - mousePos[0];
  // var mouseHeightDiff = e.pageY - mousePos[1];
  // var rotWidthDiff = cosFraction * mouseWidthDiff + sinFraction * mouseHeightDiff;
  // var rotHeightDiff = cosFraction * mouseHeightDiff - sinFraction * mouseWidthDiff;

  if (currentResizer.id === 'topleft') {
    activeElement.style.width = initialDim[0] - (mousePos[0] - initialMousePos[0]) + 'px';
    activeElement.style.height = initialDim[1] - (mousePos[1] - initialMousePos[1]) + 'px';
    activeElement.style.left = initialPos[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    activeElement.style.top = initialPos[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'topright') {
    activeElement.style.width = initialDim[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    activeElement.style.height = initialDim[1] - (mousePos[1] - initialMousePos[1]) + 'px';
    activeElement.style.top = initialPos[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomright') {
    activeElement.style.width = initialDim[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    activeElement.style.height = initialDim[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomleft') {
    activeElement.style.width = initialDim[0] - (mousePos[0] - initialMousePos[0]) + 'px';
    activeElement.style.height = initialDim[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    activeElement.style.left = initialPos[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'top') {
    activeElement.style.height = initialDim[1] - (mousePos[1] - initialMousePos[1]) + 'px';
    activeElement.style.top = initialPos[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'right') {
    activeElement.style.width = initialDim[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottom') {
    activeElement.style.height = initialDim[1] + (mousePos[1] - initialMousePos[1]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'left') {
    activeElement.style.width = initialDim[0] - (mousePos[0] - initialMousePos[0]) + 'px';
    activeElement.style.left = initialPos[0] + (mousePos[0] - initialMousePos[0]) + 'px';
    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  }
}

function stopResize(e) {
  document.removeEventListener('pointermove', resizeElement);
  currentResizer = undefined;
}

function toCanvas() {
  for (object in sandbox) {
    var segments = object.normalizedPathSegList;
    console.log(segments);
    for (var i = 0, len = segments.length; i < len; i++) {
      var pathSeg = segments.getItem(i);
      switch (pathSeg.pathSegType) {
        case SVGPathSeg.PATHSEG_MOVETO_ABS:
          ctx.moveTo(pathSeg.x, pathSeg.y);
          break;
        case SVGPathSeg.PATHSEG_LINETO_ABS:
          ctx.lineTo(pathSeg.x, pathSeg.y);
          break;
        case SVGPathSeg.PATHSEG_CLOSEPATH:
          ctx.closePath();
          break;
      }
    }
  }
}
// toCanvas();

document.addEventListener('pointerdown', selectElement);
document.addEventListener('pointerdown', getPosition);
document.addEventListener('pointermove', moveElement);
document.addEventListener('pointerup', (() => isMoving = false));
