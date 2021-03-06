
var map = [ // 1  2  3  4  5  6  7  8  9
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
           [1, 1, 0, 0, 0, 0, 0, 1, 1, 1,], // 1
           [1, 1, 0, 0, 2, 0, 0, 0, 0, 1,], // 2
           [1, 0, 0, 0, 0, 2, 0, 0, 0, 1,], // 3
           [1, 0, 0, 2, 0, 0, 2, 0, 0, 1,], // 4
           [1, 0, 0, 0, 2, 0, 0, 0, 1, 1,], // 5
           [1, 1, 1, 0, 0, 0, 0, 1, 1, 1,], // 6
           [1, 1, 1, 0, 0, 1, 0, 0, 1, 1,], // 7
           [1, 1, 1, 1, 1, 1, 0, 0, 1, 1,], // 8
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
           ], mapW = map.length, mapH = map[0].length;

// Semi-constants
var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	ASPECT = WIDTH / HEIGHT,
	UNITSIZE = 250,
	WALLHEIGHT = UNITSIZE / 3,
	MOVESPEED = 100,
	LOOKSPEED = 0.075,
	BULLETMOVESPEED = MOVESPEED * 5,
	NUMAI = 5,
	PROJECTILEDAMAGE = 20;
// Global vars
var t = THREE, scene, cam, renderer, controls, clock, projector, model, skin;
var runAnim = true, mouse = { x: 0, y: 0 }, kills = 0, health = 100;
var healthCube, lastHealthPickup = 0;
/*
var finder = new PF.AStarFinder({ // Defaults to Manhattan heuristic
	allowDiagonal: true,
}), grid = new PF.Grid(mapW, mapH, map);
*/

// Initialize and run on document ready
$(document).ready(function() {
	$('body').append('<div id="intro"><br><img src="data:image/png;base64,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" alt="" /><br><span style="color: #fff; font-family: monospace;">Newgrounds Edition</span><div id="pie1"><br><span style="color: #fff; font-family: monospace; font-size: 40px;">SELECT MODE</span><br><button id="strtbtn">survival sandbox</button><br><button disabled>campaign</button><br><span style="color: #fff; font-family: monospace;">unlocks with 20000 points</span><button disabled>mmo deathmatch</button><br><span style="color: #fff; font-family: monospace;">unlocks with 20000 points</span><hr><span style="color: #fff; font-family: monospace;">only 1 mode is unlocked<br>TIP: your gun is disabled until an enemy appears</span></div></div>');
	$('#strtbtn').css({width: WIDTH, height: HEIGHT}).one('click', function(e) {
		e.preventDefault();
		$('#intro').fadeOut();
		init();
		setInterval(drawRadar, 1000);
		animate();
	});
	/*
	new t.ColladaLoader().load('models/Yoshi/Yoshi.dae', function(collada) {
		model = collada.scene;
		skin = collada.skins[0];
		model.scale.set(0.2, 0.2, 0.2);
		model.position.set(0, 5, 0);
		scene.add(model);
	});
	*/
});

// Setup
function init() {
	clock = new t.Clock(); // Used in render() for controls.update()
	projector = new t.Projector(); // Used in bullet projection
	scene = new t.Scene(); // Holds all objects in the canvas
	scene.fog = new t.FogExp2(0xD6F1FF, 0.0005); // color, density
	
	// Set up camera
	cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // FOV, aspect, near, far
	cam.position.y = UNITSIZE * .2;
	scene.add(cam);
	
	// Camera moves with mouse, flies around with WASD/arrow keys
	controls = new t.FirstPersonControls(cam);
	controls.movementSpeed = MOVESPEED;
	controls.lookSpeed = LOOKSPEED;
	controls.lookVertical = false; // Temporary solution; play on flat surfaces only
	controls.noFly = true;

	// World objects
	setupScene();
	
	// Artificial Intelligence
	setupAI();
	
	// Handle drawing as WebGL (faster than Canvas but less supported)
	renderer = new t.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	
	// Add the canvas to the document
	renderer.domElement.style.backgroundColor = '#D6F1FF'; // easier to see
	document.body.appendChild(renderer.domElement);
	
	// Track mouse position so we know where to shoot
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	// Shoot on click
	$(document).click(function(e) {
		e.preventDefault;
		if (e.which === 1) { // Left click only
			createBullet();
		}
	});
	
	// Display HUD
	$('body').append('<canvas id="radar" width="200" height="200"></canvas>');
	$('body').append('<div id="hud"><p>Health: <span id="health">100</span><br />Score: <span id="score">0</span></p></div>');
	$('body').append('<div id="credits"><p>Brooker v.1.0 alpha</p><p>WASD: MOVE | MOUSE POINTER: AIM/SHOOT</p></div>');
	
	// Set up "hurt" flash
	$('body').append('<div id="hurt"></div>');
	$('#hurt').css({width: WIDTH, height: HEIGHT,});
}

// Helper function for browser frames
function animate() {
	if (runAnim) {
		requestAnimationFrame(animate);
	}
	render();
}

// Update and display
function render() {
	var delta = clock.getDelta(), speed = delta * BULLETMOVESPEED;
	var aispeed = delta * MOVESPEED;
	controls.update(delta); // Move camera
	
	// Rotate the health cube
	healthcube.rotation.x += 0.004
	healthcube.rotation.y += 0.008;
	// Allow picking it up once per minute
	if (Date.now() > lastHealthPickup + 60000) {
		if (distance(cam.position.x, cam.position.z, healthcube.position.x, healthcube.position.z) < 15 && health != 100) {
			health = Math.min(health + 50, 100);
			$('#health').html(health);
			lastHealthPickup = Date.now();
		}
		healthcube.material.wireframe = false;
	}
	else {
		healthcube.material.wireframe = true;
	}

	// Update bullets. Walk backwards through the list so we can remove items.
	for (var i = bullets.length-1; i >= 0; i--) {
		var b = bullets[i], p = b.position, d = b.ray.direction;
		if (checkWallCollision(p)) {
			bullets.splice(i, 1);
			scene.remove(b);
			continue;
		}
		// Collide with AI
		var hit = false;
		for (var j = ai.length-1; j >= 0; j--) {
			var a = ai[j];
			var v = a.geometry.vertices[0];
			var c = a.position;
			var x = Math.abs(v.x), z = Math.abs(v.z);
			//console.log(Math.round(p.x), Math.round(p.z), c.x, c.z, x, z);
			if (p.x < c.x + x && p.x > c.x - x &&
					p.z < c.z + z && p.z > c.z - z &&
					b.owner != a) {
				bullets.splice(i, 1);
				scene.remove(b);
				a.health -= PROJECTILEDAMAGE;
				var color = a.material.color, percent = a.health / 100;
				a.material.color.setRGB(
						percent * color.r,
						percent * color.g,
						percent * color.b
				);
				hit = true;
				break;
			}
		}
		// Bullet hits player
		if (distance(p.x, p.z, cam.position.x, cam.position.z) < 25 && b.owner != cam) {
			$('#hurt').fadeIn(75);
			health -= 10;
			if (health < 0) health = 0;
			val = health < 25 ? '<span style="color: darkRed">' + health + '</span>' : health;
			$('#health').html(val);
			bullets.splice(i, 1);
			scene.remove(b);
			$('#hurt').fadeOut(350);
		}
		if (!hit) {
			b.translateX(speed * d.x);
			//bullets[i].translateY(speed * bullets[i].direction.y);
			b.translateZ(speed * d.z);
		}
	}
	
	// Update AI.
	for (var i = ai.length-1; i >= 0; i--) {
		var a = ai[i];
		if (a.health <= 0) {
			ai.splice(i, 1);
			scene.remove(a);
			kills++;
			$('#score').html(kills * 100);
			addAI();
		}
		// Move AI
		var r = Math.random();
		if (r > 0.995) {
			a.lastRandomX = Math.random() * 2 - 1;
			a.lastRandomZ = Math.random() * 2 - 1;
		}
		a.translateX(aispeed * a.lastRandomX);
		a.translateZ(aispeed * a.lastRandomZ);
		var c = getMapSector(a.position);
		if (c.x < 0 || c.x >= mapW || c.y < 0 || c.y >= mapH || checkWallCollision(a.position)) {
			a.translateX(-2 * aispeed * a.lastRandomX);
			a.translateZ(-2 * aispeed * a.lastRandomZ);
			a.lastRandomX = Math.random() * 2 - 1;
			a.lastRandomZ = Math.random() * 2 - 1;
		}
		if (c.x < -1 || c.x > mapW || c.z < -1 || c.z > mapH) {
			ai.splice(i, 1);
			scene.remove(a);
			addAI();
		}
		/*
		var c = getMapSector(a.position);
		if (a.pathPos == a.path.length-1) {
			console.log('finding new path for '+c.x+','+c.z);
			a.pathPos = 1;
			a.path = getAIpath(a);
		}
		var dest = a.path[a.pathPos], proportion = (c.z-dest[1])/(c.x-dest[0]);
		a.translateX(aispeed * proportion);
		a.translateZ(aispeed * 1-proportion);
		console.log(c.x, c.z, dest[0], dest[1]);
		if (c.x == dest[0] && c.z == dest[1]) {
			console.log(c.x+','+c.z+' reached destination');
			a.PathPos++;
		}
		*/
		var cc = getMapSector(cam.position);
		if (Date.now() > a.lastShot + 750 && distance(c.x, c.z, cc.x, cc.z) < 2) {
			createBullet(a);
			a.lastShot = Date.now();
		}
	}

	renderer.render(scene, cam); // Repaint
	
	// Death
	if (health <= 0) {
		runAnim = false;
		$(renderer.domElement).fadeOut();
		$('#radar, #hud, #credits').fadeOut();
		$('#intro').fadeIn();
		$('#intro').html('<br><img src="data:image/png;base64,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" alt="" /><br><span style="color: #fff; font-family: monospace;">Newgrounds Edition</span><div id="pie1"><br><span style="color: #fff; font-family: monospace; font-size: 40px;">YOU DIED</span><br><button id="strtbtn">survival sandbox</button><br><button disabled>campaign</button><br><span style="color: #fff; font-family: monospace;">unlocks with 20000 points</span><button disabled>mmo deathmatch</button><br><span style="color: #fff; font-family: monospace;">unlocks with 20000 points</span><hr><span style="color: #fff; font-family: monospace;">only 1 mode is unlocked<br>TIP: your gun is disabled until an enemy appears</span></div>');
		$('#strtbtn').one('click', function() {
			location = location;
			/*
			$(renderer.domElement).fadeIn();
			$('#radar, #hud, #credits').fadeIn();
			$(this).fadeOut();
			runAnim = true;
			animate();
			health = 100;
			$('#health').html(health);
			kills--;
			if (kills <= 0) kills = 0;
			$('#score').html(kills * 100);
			cam.translateX(-cam.position.x);
			cam.translateZ(-cam.position.z);
			*/
		});
	}
}

// Set up the objects in the world
function setupScene() {
	var UNITSIZE = 250, units = mapW;

	// Geometry: floor
	var floor = new t.Mesh(
			new t.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
			new t.MeshLambertMaterial({color: 0xEDCBA0,/*map: t.ImageUtils.loadTexture('images/floor-1.jpg')*/})
	);
	scene.add(floor);
	
	// Geometry: walls
	var cube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
	var materials = [
	                 new t.MeshLambertMaterial({/*color: 0x00CCAA,*/map: t.ImageUtils.loadTexture('images/wall-1.png')}),
	                 new t.MeshLambertMaterial({/*color: 0xC5EDA0,*/map: t.ImageUtils.loadTexture('images/wall-2.png')}),
	                 new t.MeshLambertMaterial({color: 0xFBEBCD}),
	                 ];
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			if (map[i][j]) {
				var wall = new t.Mesh(cube, materials[map[i][j]-1]);
				wall.position.x = (i - units/2) * UNITSIZE;
				wall.position.y = WALLHEIGHT/2;
				wall.position.z = (j - units/2) * UNITSIZE;
				scene.add(wall);
			}
		}
	}
	
	// Health cube
	healthcube = new t.Mesh(
			new t.CubeGeometry(30, 30, 30),
			new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/health.png')})
	);
	healthcube.position.set(-UNITSIZE-15, 35, -UNITSIZE-15);
	scene.add(healthcube);
	
	// Lighting
	var directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.7 );
	directionalLight1.position.set( 0.5, 1, 0.5 );
	scene.add( directionalLight1 );
	var directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.5 );
	directionalLight2.position.set( -0.5, -1, -0.5 );
	scene.add( directionalLight2 );
}

var ai = [];
var aiGeo = new t.CubeGeometry(40, 40, 40);
function setupAI() {
	for (var i = 0; i < NUMAI; i++) {
		addAI();
	}
}

function addAI() {
	var c = getMapSector(cam.position);
	var aiMaterial = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/faceRender.png')});
	var o = new t.Mesh(aiGeo, aiMaterial);
	do {
		var x = getRandBetween(0, mapW-1);
		var z = getRandBetween(0, mapH-1);
	} while (map[x][z] > 0 || (x == c.x && z == c.z));
	x = Math.floor(x - mapW/2) * UNITSIZE;
	z = Math.floor(z - mapW/2) * UNITSIZE;
	o.position.set(x, UNITSIZE * 0.15, z);
	o.health = 100;
	//o.path = getAIpath(o);
	o.pathPos = 1;
	o.lastRandomX = Math.random();
	o.lastRandomZ = Math.random();
	o.lastShot = Date.now(); // Higher-fidelity timers aren't a big deal here.
	ai.push(o);
	scene.add(o);
}

function getAIpath(a) {
	var p = getMapSector(a.position);
	do { // Cop-out
		do {
			var x = getRandBetween(0, mapW-1);
			var z = getRandBetween(0, mapH-1);
		} while (map[x][z] > 0 || distance(p.x, p.z, x, z) < 3);
		var path = findAIpath(p.x, p.z, x, z);
	} while (path.length == 0);
	return path;
}

/**
 * Find a path from one grid cell to another.
 *
 * @param sX
 *   Starting grid x-coordinate.
 * @param sZ
 *   Starting grid z-coordinate.
 * @param eX
 *   Ending grid x-coordinate.
 * @param eZ
 *   Ending grid z-coordinate.
 * @returns
 *   An array of coordinates including the start and end positions representing
 *   the path from the starting cell to the ending cell.
 */
function findAIpath(sX, sZ, eX, eZ) {
	var backupGrid = grid.clone();
	var path = finder.findPath(sX, sZ, eX, eZ, grid);
	grid = backupGrid;
	return path;
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function getMapSector(v) {
	var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW/2);
	var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW/2);
	return {x: x, z: z};
}

/**
 * Check whether a Vector3 overlaps with a wall.
 *
 * @param v
 *   A THREE.Vector3 object representing a point in space.
 *   Passing cam.position is especially useful.
 * @returns {Boolean}
 *   true if the vector is inside a wall; false otherwise.
 */
function checkWallCollision(v) {
	var c = getMapSector(v);
	return map[c.x][c.z] > 0;
}

// Radar
function drawRadar() {
	var c = getMapSector(cam.position), context = document.getElementById('radar').getContext('2d');
	context.font = '10px Helvetica';
	for (var i = 0; i < mapW; i++) {
		for (var j = 0, m = map[i].length; j < m; j++) {
			var d = 0;
			for (var k = 0, n = ai.length; k < n; k++) {
				var e = getMapSector(ai[k].position);
				if (i == e.x && j == e.z) {
					d++;
				}
			}
			if (i == c.x && j == c.z && d == 0) {
				context.fillStyle = '#0000FF';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
			else if (i == c.x && j == c.z) {
				context.fillStyle = '#AA33FF';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
				context.fillStyle = '#000000';
				context.fillText(''+d, i*20+8, j*20+12);
			}
			else if (d > 0 && d < 10) {
				context.fillStyle = '#FF0000';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
				context.fillStyle = '#000000';
				context.fillText(''+d, i*20+8, j*20+12);
			}
			else if (map[i][j] > 0) {
				context.fillStyle = '#666666';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
			else {
				context.fillStyle = '#CCCCCC';
				context.fillRect(i * 20, j * 20, (i+1)*20, (j+1)*20);
			}
		}
	}
}

var bullets = [];
var sphereMaterial = new t.MeshBasicMaterial({color: 0x333333});
var sphereGeo = new t.SphereGeometry(2, 6, 6);
function createBullet(obj) {
	if (obj === undefined) {
		obj = cam;
	}
	var sphere = new t.Mesh(sphereGeo, sphereMaterial);
	sphere.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z);

	if (obj instanceof t.Camera) {
		var vector = new t.Vector3(mouse.x, mouse.y, 1);
		projector.unprojectVector(vector, obj);
		sphere.ray = new t.Ray(
				obj.position,
				vector.subSelf(obj.position).normalize()
		);
	}
	else {
		var vector = cam.position.clone();
		sphere.ray = new t.Ray(
				obj.position,
				vector.subSelf(obj.position).normalize()
		);
	}
	sphere.owner = obj;
	
	bullets.push(sphere);
	scene.add(sphere);
	
	return sphere;
}

/*
function loadImage(path) {
	var image = document.createElement('img');
	var texture = new t.Texture(image, t.UVMapping);
	image.onload = function() { texture.needsUpdate = true; };
	image.src = path;
	return texture;
}
*/

function onDocumentMouseMove(e) {
	e.preventDefault();
	mouse.x = (e.clientX / WIDTH) * 2 - 1;
	mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}

// Handle window resizing
$(window).resize(function() {
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	ASPECT = WIDTH / HEIGHT;
	if (cam) {
		cam.aspect = ASPECT;
		cam.updateProjectionMatrix();
	}
	if (renderer) {
		renderer.setSize(WIDTH, HEIGHT);
	}
	$('#intro, #hurt').css({width: WIDTH, height: HEIGHT,});
});

// Stop moving around when the window is unfocused (keeps my sanity!)
$(window).focus(function() {
	if (controls) controls.freeze = false;
});
$(window).blur(function() {
	if (controls) controls.freeze = true;
});

//Get a random integer between lo and hi, inclusive.
//Assumes lo and hi are integers and lo is lower than hi.
function getRandBetween(lo, hi) {
 return parseInt(Math.floor(Math.random()*(hi-lo+1))+lo, 10);
}
