var container, scene, camera, renderer, controls, stats;
var video, videoImage, videoImageContext, videoTexture;
window.onload = function () {
    init();
    animate();
}

function init() {
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 2000000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 150, 100);
    camera.lookAt(scene.position);

    // RENDERER
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('three-container');
    container.appendChild(renderer.domElement);

    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // EVENTS
    THREEx.WindowResize(renderer, camera);

    // LIGHT
    var ambientLight = new THREE.AmbientLight(0x333333);
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(200, 400, 500);
    var light2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light2.position.set(-500, 250, -200);
    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    // Sky
    var skyUrl = [
        "img/sky-right.jpg",
        "img/sky-left.jpg",
        "img/sky-top.jpg",
        "img/sky-bottom.jpg",
        "img/sky-front.jpg",
        "img/sky-back.jpg",
    ];
    var skyGeometry = new THREE.CubeGeometry(10000, 10000, 10000);

    var skyMaterialArray = [];
    for (var i = 0; i < 6; i++)
        skyMaterialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(skyUrl[i]),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(skyMaterialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);



    // SKYBOX/FOG
    //    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);

    ///////////
    // VIDEO //
    ///////////

    video = document.getElementById('camvideo');

    videoImage = document.getElementById('camcanvas');
    videoImageContext = videoImage.getContext('2d');
    // background color if no video present
    videoImageContext.fillStyle = '#acf2ff';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    var movieMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        overdraw: true,
        side: THREE.DoubleSide
    });
    // the geometry on which the movie will be displayed;
    // 		movie image will be scaled to fit these dimensions.

    //    var movieGeometry = new THREE.PlaneGeometry(133 * 10, 100 * 10, 1, 1);
    //    var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);

    var movieGeometry = new THREE.SphereGeometry(500, 150, 120);
    movieGeometry.applyMatrix( new THREE.Matrix4().makeScale( 1.0, 1.5, 1.2 ) );
    var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(0, 50, 0);
    scene.add(movieScreen);





    camera.position.set(3000, 1500, 0);
    camera.lookAt(movieScreen.position);


}


// Requires a canvas with ID #canvas and a video with ID #camVideo
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var camVideo = document.getElementById('camvideo');

if (!navigator.getUserMedia) {
    // upload a photo instead
} else {
    navigator.getUserMedia({
        video: true
    }, gotStream, noStream);
}

function gotStream(stream) {
    camVideo.src = window.URL.createObjectURL(stream);

    camVideo.onerror = function (e) {
        stream.stop();
    };
}

function noStream(e) {
    console.error(e);
}



function animate() {
    requestAnimationFrame(this.animate);
    this.render();
    this.update();
}

function update() {

}

function render() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        videoImageContext.drawImage(video, 0, 0, videoImage.width, videoImage.height);
        if (videoTexture)
            videoTexture.needsUpdate = true;
    }
    renderer.render(scene, camera);
}
