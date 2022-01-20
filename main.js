const canvas = document.querySelector('body');

const isNavigation = function(target) {
  if (target.classList.contains('navigation')) return true
}
var currentResizer;

var activeElement;
var originalPos = [0, 0];
var originalDim = [0, 0];
var isMoving = false;
const isDraggable = function(target) {
  if (target.classList.contains('draggable')) return true
}

var mousePos = [0, 0];


class Navigation {
  constructor(element) {
    const selector = document.createElement("div");
    selector.id = 'selector';
    selector.classList.add('navigation');
    element.appendChild(selector);

    const resizeTopLeft = document.createElement("div");
    resizeTopLeft.classList.add('navigation', 'resize', );
    resizeTopLeft.id = 'topleft';
    selector.appendChild(resizeTopLeft);

    const resizeTopRight = document.createElement("div");
    resizeTopRight.classList.add('navigation', 'resize');
    resizeTopRight.id = 'topright';
    selector.appendChild(resizeTopRight);

    const resizeBottomRight = document.createElement("div");
    resizeBottomRight.classList.add('navigation', 'resize');
    resizeBottomRight.id = 'bottomright';
    selector.appendChild(resizeBottomRight);

    const resizeBottomLeft = document.createElement("div");
    resizeBottomLeft.classList.add('navigation', 'resize');
    resizeBottomLeft.id = 'bottomleft';
    selector.appendChild(resizeBottomLeft);

    for (var i of document.querySelectorAll('.resize')) {
      i.addEventListener('mousedown', function(e) {
        e.preventDefault();
        currentResizer = e.currentTarget;
        mousePos = [e.pageX, e.pageY];
        originalDim = [activeElement.getBoundingClientRect().width, activeElement.getBoundingClientRect().height];
        originalPos = [activeElement.getBoundingClientRect().left, activeElement.getBoundingClientRect().top];
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
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
    originalPos = [
      e.target.offsetLeft - e.clientX,
      e.target.offsetTop - e.clientY
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
  if (isMoving) {
    activeElement.style.left = (e.pageX + originalPos[0]) + 'px';
    activeElement.style.top = (e.pageY + originalPos[1]) + 'px';
  }
};

function resize(e) {
  if (currentResizer.id === 'topleft') {
    activeElement.style.width = originalDim[0] - (e.pageX - mousePos[0]) + 'px';
    activeElement.style.height = originalDim[1] - (e.pageY - mousePos[1]) + 'px';
    activeElement.style.left = originalPos[0] + (e.pageX - mousePos[0]) + 'px';
    activeElement.style.top = originalPos[1] + (e.clientY - mousePos[1]) + 'px';

    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'topright') {
    activeElement.style.width = originalDim[0] + (e.pageX - mousePos[0]) + 'px';
    activeElement.style.height = originalDim[1] - (e.pageY - mousePos[1]) + 'px';
    activeElement.style.top = originalPos[1] + (e.pageY - mousePos[1]) + 'px';

    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomright') {
    activeElement.style.width = originalDim[0] + (e.pageX - mousePos[0]) + 'px';
    activeElement.style.height = originalDim[1] + (e.pageY - mousePos[1]) + 'px';

    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  } else if (currentResizer.id === 'bottomleft') {
    activeElement.style.width = originalDim[0] - (e.pageX - mousePos[0]) + 'px';
    activeElement.style.height = originalDim[1] + (e.pageY - mousePos[1]) + 'px';
    activeElement.style.left = originalPos[0] + (e.pageX - mousePos[0]) + 'px';

    document.querySelector('#sizes').innerHTML = activeElement.getBoundingClientRect().width + ' x ' + activeElement.getBoundingClientRect().height;
  }
}

function stopResize(e) {
  document.removeEventListener('mousemove', resize, {
    once: true
  });
}

document.addEventListener('mousedown', selectElement);
document.addEventListener('mousedown', getPosition);
document.addEventListener('mousemove', moveElement);
document.addEventListener('mouseup', (() => isMoving = false));
