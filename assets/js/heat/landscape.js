if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer, scene, camera;

init();
animate();


function init() {

	var container = document.getElementById( 'heat' );
	var width = $("#heat").width(),
	    height = $("#heat").width();

	scene = new THREE.Scene();
	scene.background = new THREE.Color( "#222222" );

	camera = new THREE.PerspectiveCamera( 25, width / height, 1, 1000 );
	camera.position.set( -25, -25, 10 );
	camera.up.set( 0, 0, 1 );

	var group = new THREE.Group();
	scene.add( group );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
	directionalLight.position.set( 0.75, 0.75, 1.0 ).normalize();
	scene.add( directionalLight );

	var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.2 );
	scene.add( ambientLight );

	var helper = new THREE.GridHelper( 10, 10 );
	helper.rotation.x = Math.PI / 2;
	helper.position.set( 0, 0, 0 );
	group.add( helper );

	// var w1 = makeTextSprite( "w1", { fontsize: 20 } );
	// var w2 = makeTextSprite( "w2", { fontsize: 20 } );
	// w1.position.set(0,-12,0);
	// w2.position.set(-12,0,0);
	// group.add( w1 );
	// group.add( w2 );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(width , height);
	container.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera, renderer.domElement );

	// Comment to stop rotation
	controls.autoRotate = true;
	controls.minDistance = 10;
	controls.maxDistance = 50;

	window.addEventListener( 'resize', onWindowResize, false );

}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );
	var dist = (camera.position.x**2 + camera.position.y**2 + camera.position.z**2)**0.25;
	camera.lookAt(0,0,dist) 

	// Comment to stop rotation
	controls.update();

	render();

}

function render() {

	renderer.render( scene, camera );

}


var geometry, object, material;

function removeLandscape() {

	scene.remove(object);
	if (object != undefined) {
		object.geometry.dispose();
		object.material.dispose();
		object = undefined;
	} 

}

function addLandscape(loss, x, param) {

	material = new THREE.MeshPhongMaterial( {
					color: 0x156289,
					emissive: 0x072534,
					side: THREE.DoubleSide,
					flatShading: true,
					transparent: true,
					opacity: 0.8
				} );
	geometry = new THREE.ParametricBufferGeometry( THREE.ParametricGeometries[loss](x, param, 2,2), 100, 100 );
	object = new THREE.Mesh( geometry, material );
	object.position.set( 0, 0, 0 );
	object.scale.multiplyScalar( 5 );

	scene.add( object );
}




THREE.ParametricGeometries = {

	Gaussian: function ( data, param, width, height ) {
		return function ( u, v, target ) {

			u -= 0.5;
			v -= 0.5;
			
			var w1 = u * width;
			var w2 = v * height;

			var mu1 = param[0];
			var mu2 = param[1];
			var std = param[2];

			var Q = (w1 - mu1)**2 + (w2 - mu2)**2
			var a = 2 * Math.PI * std**2
			var z = Math.exp(-Q/(2*std**2)) / a;

			target.set( w1, w2, z );
		};
	},

};


var params = function() {
  this.mu1 = 0,
  this.mu2 = 0,
  this.std = 0.5;
};


$(window).on("load", function () {
	var gui = new dat.GUI({ autoPlace: false });
	document.getElementById('heat-control').appendChild(gui.domElement);
	var p = new params();
	var update = function() {
		removeLandscape();
		addLandscape("Gaussian", [], [p.mu1, p.mu2, p.std]);
	}
	gui.add(p, 'mu1', -1, 1).onChange(update).name('mu_1');
	gui.add(p, 'mu2', -1, 1).onChange(update).name('mu_2');
	gui.add(p, 'std', 0.1, 4).onChange(update).name('sigma');
	update();
});
