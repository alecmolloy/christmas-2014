var container, scene, camera, renderer, controls, stats, selfyCtx;
var bodies;
var userVideo, userVideoImage, userVideoImageContext, userVideoTexture, userVideoScreen;
var alecVideo, alecVideoImage, alecVideoImageContext, alecVideoTexture, alecVideoScreen;
window.onload = function () {
    init();
    animate();
};

function saveSelfy() {
    selfyCtx = document.getElementById('selfycam').getContext('2d');
    var img = new Image();
    img.onload = function () {
        var smaller,
            imgWidth = img.width,
            imgHeight = img.height;
        if (img.width < img.height) {
            smaller = imgWidth;
        } else {
            smaller = imgHeight;
        }

        console.log(imgWidth);

        console.log(imgHeight);

        console.log(smaller);

        console.log(imgWidth/2 - smaller / 2);

        console.log(imgHeight/2 - smaller / 2);


        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        selfyCtx.drawImage(img, (imgWidth / 2) - (smaller / 2), (imgHeight / 2) - (smaller / 2), smaller, smaller, 0, 0, 640, 640);
        selfyCtx.drawImage(document.getElementById('christmas-cover'), 0, 0);


        selfyDataURL = document.getElementById('selfycam').toDataURL('image/png');

        var a = document.createElement('a');
        a.href = selfyDataURL;
        a.download = 'merry-chrimbus-selfy' + '.png';
        a.click();
    };
    img.src = renderer.domElement.toDataURL('image/png');

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
        FAR = 200000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);

    // RENDERER
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('three-container');
    container.appendChild(renderer.domElement);

    // Save functionality
    document.getElementById('takeselfy').addEventListener('click', function (e) {
        saveSelfy();
    });



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

    // SKY
    var skyUrl = [
            "assets/sky-right.jpg",
            "assets/sky-left.jpg",
            "assets/sky-top.jpg",
            "assets/sky-bottom.jpg",
            "assets/sky-front.jpg",
            "assets/sky-back.jpg"
        ];
    var skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000);

    var skyMaterialArray = [];
    for (var i = 0; i < 6; i++)
        skyMaterialArray.push(new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(skyUrl[i]),
            side: THREE.BackSide
        }));
    var skyMaterial = new THREE.MeshFaceMaterial(skyMaterialArray);
    var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(skyBox);


    ///////////
    // Faces //
    ///////////

    var user = new THREE.Object3D();
    var alec = new THREE.Object3D();
    bodies = new THREE.Object3D();


    // Body Geometry
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    var texture = new THREE.Texture();
    var texture2 = new THREE.Texture();

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {};

    var manager1 = new THREE.LoadingManager();
    var loader1 = new THREE.ImageLoader(manager);
    loader1.load('assets/union-jack.jpg', function (image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    var manager2 = new THREE.LoadingManager();
    var loader2 = new THREE.ImageLoader(manager);
    loader2.load('assets/union-jack.jpg', function (image) {

        texture2.image = image;
        texture2.needsUpdate = true;

    });


    loader1 = new THREE.OBJLoader(manager);
    loader1.load('assets/female02.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });
        object.scale.set(4, 4, 4);
        object.position.y = -625; //height
        object.rotation.y = Math.PI * .175;

        user.add(object);

    }, onProgress, onError);

    loader2 = new THREE.OBJLoader(manager);
    loader2.load('assets/male02.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture2;
            }
        });
        object.scale.set(4, 4, 4);
        object.position.y = -600; //height
        object.rotation.y = Math.PI * .175;

        alec.add(object);

    }, onProgress, onError);



    // User

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

    var userVideoGeometry = new THREE.SphereGeometry(50, 50, 50);
    userVideoGeometry.applyMatrix(new THREE.Matrix4().makeScale(0.45, 1.4, 1.2));
    userVideoScreen = new THREE.Mesh(userVideoGeometry, userVideoMaterial);
    userVideoScreen.rotation.y = Math.PI * 1.65;
    userVideoScreen.position.y = 10; //height
    userVideoScreen.position.z = 35;
    userVideoScreen.position.x = 30;
    user.add(userVideoScreen);


    // Alec

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

    var alecVideoGeometry = new THREE.SphereGeometry(50, 50, 50);
    alecVideoGeometry.applyMatrix(new THREE.Matrix4().makeScale(0.45, 1.4, 1.2));
    alecVideoScreen = new THREE.Mesh(alecVideoGeometry, alecVideoMaterial);
    alecVideoScreen.position.y = 75; //height
    alecVideoScreen.rotation.y = Math.PI * 1.5;
    alecVideoScreen.position.x = 12;
    alecVideoScreen.position.z = 34;

    alec.add(alecVideoScreen);

    user.position.set(100, 5, 0);
    user.rotation.y = Math.PI * -.15;
    bodies.add(user);

    alec.position.set(-100, 5, 0);
    bodies.add(alec);

    scene.add(bodies);


    var ambient = new THREE.AmbientLight(0x505080);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, .5, 1);
    scene.add(directionalLight);


    camera.position.set(500, 0, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));


}


navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

var userVideo = document.getElementById('uservideo');
var alecVideo = document.getElementById('alecvideo');

navigator.getUserMedia({
    video: true
}, gotStream, noStream);

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
    bodies.lookAt(camera.position);
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
