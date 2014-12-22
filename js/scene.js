var container, scene, camera, renderer, controls, stats;
var userVideo, userVideoImage, userVideoImageContext, userVideoTexture;
var alecVideo, alecVideoImage, alecVideoImageContext, alecVideoTexture;
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
        "assets/sky-right.jpg",
        "assets/sky-left.jpg",
        "assets/sky-top.jpg",
        "assets/sky-bottom.jpg",
        "assets/sky-front.jpg",
        "assets/sky-back.jpg",
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
    // Faces //
    ///////////

    userVideo = document.getElementById('uservideo');

    userVideoImage = document.getElementById('usercanvas');
    userVideoImageContext = userVideoImage.getContext('2d');
    userVideoImageContext.fillRect(0, 0, userVideoImage.width, userVideoImage.height);

    userVideoTexture = new THREE.Texture(userVideoImage);
    userVideoTexture.minFilter = THREE.LinearFilter;
    userVideoTexture.magFilter = THREE.LinearFilter;

    var userVideoMaterial = new THREE.MeshBasicMaterial({
        map: userVideoTexture,
        overdraw: true,
        side: THREE.DoubleSide
    });

    var userVideoGeometry = new THREE.SphereGeometry(500, 150, 120);
    userVideoGeometry.applyMatrix(new THREE.Matrix4().makeScale(1.0, 1.5, 1.2));
    var userVideoScreen = new THREE.Mesh(userVideoGeometry, userVideoMaterial);
    userVideoScreen.position.set(0, 50, -650);
    scene.add(userVideoScreen);



    alecVideo = document.getElementById('alecvideo');

    alecVideoImage = document.getElementById('aleccanvas');
    alecVideoImageContext = alecVideoImage.getContext('2d');
    alecVideoImageContext.fillRect(0, 0, alecVideoImage.width, alecVideoImage.height);

    alecVideoTexture = new THREE.Texture(alecVideoImage);
    alecVideoTexture.minFilter = THREE.LinearFilter;
    alecVideoTexture.magFilter = THREE.LinearFilter;

    var alecVideoMaterial = new THREE.MeshBasicMaterial({
        map: alecVideoTexture,
        overdraw: true,
        side: THREE.DoubleSide
    });

    var alecVideoGeometry = new THREE.SphereGeometry(500, 150, 120);
    alecVideoGeometry.applyMatrix(new THREE.Matrix4().makeScale(1.0, 1.5, 1.2));
    var alecVideoScreen = new THREE.Mesh(alecVideoGeometry, alecVideoMaterial);
    alecVideoScreen.position.set(0, 50, 650);
    scene.add(alecVideoScreen);





    camera.position.set(3000, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));


}


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var userVideo = document.getElementById('uservideo');
var alecVideo = document.getElementById('alecvideo');

if (!navigator.getUserMedia) {
    // upload a photo instead
} else {
    navigator.getUserMedia({
        video: true
    }, gotStream, noStream);
}

function gotStream(stream) {
    userVideo.src = window.URL.createObjectURL(stream);

    userVideo.onerror = function (e) {
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
    if (alecVideo.readyState === alecVideo.HAVE_ENOUGH_DATA) {
        alecVideoImageContext.drawImage(alecVideo, 0, 0, alecVideoImage.width, alecVideoImage.height);
        if (alecVideoTexture)
            alecVideoTexture.needsUpdate = true;
    }

    if (userVideo.readyState === userVideo.HAVE_ENOUGH_DATA) {
        userVideoImageContext.drawImage(userVideo, 0, 0, userVideoImage.width, userVideoImage.height);
        if (userVideoTexture)
            userVideoTexture.needsUpdate = true;
    }

    renderer.render(scene, camera);
}
