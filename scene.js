var width = 400,
    height = 300,
    viewAngle = 45,
    aspect = width / height,
    near = 0.1,
    far = 10000;

var container = document.getElementById('canvas');

var renderer = THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(viewAngle);
