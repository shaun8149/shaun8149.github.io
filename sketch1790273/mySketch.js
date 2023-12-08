/*
 ****** StreamLine 采样点系统的参数，desp是最重要的变量，一方面控制着flow field的分辨率【res】，一方面控制streamlines之间的距离
 *      dtest是一个阈值，也就是，当streamline的下一个点距离已有点的距离超过dtest的时候线将中止
 *      samplePointsDistance是放置采样点之间的距离
 */
let dsep = 2;
let dtest;
let dtestRatio = 0.5;
let samplePointsDistance;
let samplePointsDistanceRatio = 0.5;

/*****  xFactor用来控制X方向的noise
 *       yFactor用来控制Y方向的noise,这两个参数决定了streamlines的形状
 *       Flow Field系统还有更多的可能性，目前只是用两个维度的Noise
 *       此外，简单尝试了三个方向的线性形，四个方向的简单弧形，以及环形，螺旋形，射线形，以及一个bug导致的混乱形。
 *
 */
let xFactor = 1.9;
let yFactor = 1.8;

/***** Particle 系统的参数
 *      MAXSPEED是粒子的最大速度，也就是每次迭代的位置改变
 *      MAXFORCE是粒子的加速度，也就是粒子的转向
 *
 */

let MAXSPEED = 2;
let MAXFORCE = 0.25;

/***** particle 系统的形状参数
 *      这里才是这个系统的核心，应该从三个方面来着手，分别是形状，颜色和大小
 *      目前的形状主要用圆，也就是点，分别用边框和填充来区别，需要探索其他形状
 *      需要探索用分解的方式来生成圆形来获得更为自然的形状，在本次项目中涉及较少
 *      颜色方面，目前主要用GRADIENTS，需要探索更多的映射方式
 *      大小方面，需要探索更多的方式。
 *      目前主要欠缺对于半径的判断。
 */

let RADIUS_PARTICLE = 2;
let RADIUS_CLONE = 4;
let RADIUS_START = 15;
let StrokeWeightOfSmallClone = 0.15;
/******
 *
 */

let Mode = ['Point', 'Line', 'Plane'][random_int(0, 2)];
//let Pattern=['SeaAndLava','Phoenix','WaterFall'][random_int(0,2)];
let Pattern = ['SeaAndLava', 'Phoenix', 'WaterFall', 'DotLine', 'StreamLine', 'StreamLineII', 'Handy', 'Haecceity', 'DotLine', 'StreamLine', 'StreamLineII', 'Handy', 'Haecceity'][random_int(0,12)];
let bgcolor;
let colors;
let theangle;
let res;
let particle = [];
let cloneParticle = [];
let debug = false;
let normalmode = false;
let streamLines = [];
let secondLines = []
let cloneLines = [];
let samplePoints = [];
let initLine;
let currentLine;
let currentIndex;
let flow;
let streamLineComplete = [];
let streamLineUnComplete = [];
let scribble;

/*
 *       Features
 */

let Resolution;
let theBackGround;
let Career = ['O', 'O', 'O', 'O', 'O', 'N', 'E', 'A', 'P', 'M', 'L', 'A', 'M', 'M', 'B', 'B', 'B', 'D', 'D', 'D', 'D', 'A', 'G', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'N', 'I', 'I', 'I', 'F', 'F', 'Y'][random_int(0, 39)];

function setup() {

	if (innerWidth > innerHeight) {
		createCanvas(innerHeight, innerHeight);
	} else {
		createCanvas(innerWidth, innerWidth);
	}
	noLoop();

	colorMode(HSB, 360, 100, 100);

	let seed = ~~(Genify.random() * 123456789);
	randomSeed(seed);
	noiseSeed(seed);

	/*首先根据不同的pattern设置desp和其他显示参数,如果是普通模式，则res在2到100之间取随机值。
	 */
	switch (Pattern) {
		case 'SeaAndLava':
			dsep = 4;
			xFactor = 1.9;
			yFactor = 1.8;
			MAXSPEED = 2;
			MAXFORCE = 0.25;
			RADIUS_PARTICLE = 2;
			RADIUS_CLONE = 4;
			RADIUS_START = 15;
			StrokeWeightOfSmallClone = 0.15;
			break;
		case 'Phoenix':
			dsep = 2;
			xFactor = 1.9;
			yFactor = 1.8;
			MAXSPEED = 2;
			MAXFORCE = 0.25;
			RADIUS_PARTICLE = 2;
			RADIUS_CLONE = 4;
			RADIUS_START = 15;
			StrokeWeightOfSmallClone = 0.15;
			break;
		case 'WaterFall':
			dsep = 2;
			xFactor = 1.9;
			yFactor = 1.8;
			MAXSPEED = 2;
			MAXFORCE = 0.25;
			RADIUS_PARTICLE = 2;
			RADIUS_CLONE = 4;
			RADIUS_START = 15;
			StrokeWeightOfSmallClone = 0.15;
			break;
		case 'DotLine':
			dsep = 4 * random_int(2, 3);
			xFactor = random(1, 4);
			yFactor = xFactor;
			MAXSPEED = random(1, 4);
			MAXFORCE = random();
			RADIUS_PARTICLE = 2;
			RADIUS_CLONE = 4;
			RADIUS_START = 15;
			StrokeWeightOfLine = dsep * 0.05;
			colors = 20 * random_int(0, 17);
			brights = 10 * random_int(3, 9);
			offset = [1 / 5, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 4 / 5][random_int(0, 6)];
			offsetAngle = [1 / 4, 3 / 4][random_int(0, 1)];
			direction = ['Linear', 'Linear', 'Noise', 'Noise', 'Radial-Cols', 'Radial-Rows', 'Radial-ColsII', 'Radial-RowsII', 'Ray', 'Circular', 'Spiral', 'Spiral', 'Spiral', 'Spiral', 'Spiral', 'Chaos'][random_int(0, 15)];
			theangle = [0, PI / 4, PI / 2][random_int(0, 2)];
			break;
		case 'StreamLine':
			dsep = random(12, 25);
			xFactor = random(0.8, 2);
			yFactor = xFactor;
			MAXSPEED = 2;
			MAXFORCE = 0.25;
			RADIUS_PARTICLE = 2;
			RADIUS_CLONE = 4;
			RADIUS_START = 12;
			StrokeWeightOfLine = dsep * 0.05;
			offset = [1 / 5, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 4 / 5][random_int(0, 6)];
			offsetAngle = [1 / 4, 3 / 4][random_int(0, 1)];
			direction = ['Linear', 'Linear', 'Noise', 'Noise', 'Radial-Cols', 'Radial-Rows', 'Radial-ColsII', 'Radial-RowsII', 'Ray', 'Circular', 'Spiral', 'Spiral', 'Spiral', 'Spiral', 'Spiral', 'Chaos'][random_int(0, 15)];
			theangle = [0, PI / 4, PI / 2][random_int(0, 2)];
			break;
		case 'StreamLineII':
			dtestRatio = random(0.1,0.2);
			samplePointsDistanceRatio = 0.8;
			dsep = 4;
			xFactor = random(0.8, 2);
			yFactor = xFactor;
			MAXSPEED = 2;
			MAXFORCE = 0.25;
			RADIUS_PARTICLE = 2;
			RADIUS_CLONE = 4;
			RADIUS_START = 12;
			StrokeWeightOfLine = dsep * 0.05;
			colors1 = definingPerfect();
			colors2 = definingBackground();
			direction = 'Noise';
			theangle = [0, PI / 4, PI / 2][random_int(0, 2)];
			break;
		case 'Handy':
			dsep = random(30, 60);
			xFactor = random(1, 4);
			yFactor = xFactor;
			MAXSPEED = random();
			MAXFORCE = 0.2;
			RADIUS_PARTICLE = dsep * 0.25;
			RADIUS_CLONE = dsep * 0.45;
			RADIUS_START = dsep * 0.65;
			StrokeWeightOfLine = dsep * 0.1;
			colors = definingBackground();
			break;
		case 'Haecceity':
			dsep = random(20, 40);
			xFactor = random(1, 4);
			yFactor = xFactor;
			MAXSPEED = random();
			MAXFORCE = 0.2;
			RADIUS_PARTICLE = 2;
			RADIUS_CLONE = 4;
			RADIUS_START = 15;
			StrokeWeightOfLine = dsep * 0.05;
			colors = random(350);
			offset = [1 / 5, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 4 / 5][random_int(0, 6)];
			offsetAngle = [1 / 4, 3 / 4][random_int(0, 1)];
			direction = ['Linear', 'Noise', 'Radial-Cols', 'Radial-Rows', 'Radial-Cos', 'Radial-Sin', 'Radial-SinCos'][random_int(0, 6)];
			theangle = [0, PI / 4, PI * 3 / 4][random_int(0, 2)];
			break;

	}
	res = dsep;
	dtest = dsep * dtestRatio; //the stop distance of two streamline
	samplePointsDistance = samplePointsDistanceRatio * dsep; //the max distance of two sample points on the streamline

	flow = new flowField(res);
	let initx = random(width);
	let inity = random(height);

	particle.push(new Particle(initx, inity, flow, true));
	cloneParticle.push(new clone(initx, inity, flow, true));

	for (let p of particle) {
		p.update();
	}
	for (let c of cloneParticle) {
		c.update();
	}
	initLine = cloneParticle[0].currentPath.filter(p => 1 > 0).reverse();
	let initseed = initLine.pop();
	initLine = initLine.concat(particle[0].currentPath);
	let initIndex = initLine.findIndex(p => p.x == initseed.x);

	scribble = new Scribble();
}

function draw() {

	let finished = false;
	if (Pattern == 'Handy' || Pattern == 'Haecceity') {
		colorMode(RGB);
		let c = definingWhiteBackground();
		background(c);
	}
	else if (Pattern == 'StreamLine') {
		colorMode(RGB);
		let c = definingBackground();
		background(c);
	} else if (Pattern == 'StreamLineII') {
		colorMode(RGB);
		let c = definingBlackBackground();
		background(c);
	} else
		background(0);

	let a = 10000;
	// noprotect
	while (a-- > 0) {
		if (streamLines.length == 0)
			break;
		else {
			currentLine = streamLines.shift();
			let seedpoints = generateFromCurrentLine(currentLine);
			for (let seedpoint of seedpoints) {
				let tempx = seedpoint.x;
				let tempy = seedpoint.y;
				if (flow.isValidSample(tempx, tempy)) {
					let p = new Particle(tempx, tempy, flow, false);
					let c = new clone(tempx, tempy, flow, false);
					particle.push(p);
					cloneParticle.push(c);
					p.update();
					c.update();
				}
			}
		}
	}

	for (let p of particle) {
		p.show();
	}
	for (let c of cloneParticle) {
		c.show();
	}
	showBorder();
	//flow.show();

	Resolution = getResolution();
	theBackGround = getTheBackGround();
	window.$genFeatures = {
		"Pattern": Pattern,
		"Resolution": Resolution,
		"theBackGround": theBackGround,
		"Career": Career,
		"xFactor":xFactor.toFixed(2),
		"yFactor":yFactor.toFixed(2),
		"MAXSPEED":MAXSPEED.toFixed(2),
		"MAXFORCE":MAXFORCE.toFixed(2),
		"samplePointsDistance":samplePointsDistance
	};

}

/*
 *目前对于种子点放置的探索还很原始，未来会尝试更多的种子点放置的算法。比如Mebarki的最远距离种子点放置
 *当前的算法，如果两个循环中的一个，会出现流线不能完全覆盖画布的情况，可以作为一个特性
 */

function generateFromCurrentLine(currentLine) {

	let seeds = [];
	let seed;
	for (let i = 0; i < currentLine.length - 1; i++) {
		seed = p5.Vector.sub(currentLine[i], currentLine[i + 1]);
		seed.rotate(PI / 2);
		seed.setMag(dsep * 1.01);
		seed = p5.Vector.add(seed, currentLine[i + 1]);
		seeds.push(seed);
	}

	for (let i = 0; i < currentLine.length - 1; i++) {
		seed = p5.Vector.sub(currentLine[i], currentLine[i + 1]);
		seed.rotate(-1 * PI / 2);
		seed.setMag(dsep * 1.01);
		seed = p5.Vector.add(seed, currentLine[i + 1]);
		seeds.push(seed);
	}



	return seeds;
}


function random_num(a, b) {
	return a + (b - a) * lambrand();
}

function random_int(a, b) {
	return Math.floor(random_num(a, b + 1));
}

function lambrand() {
	//return Math.random();
	return Genify.random();
}

function showBorder() {
	noFill();
	colorMode(HSB, 360, 100, 100);
	stroke(360, 1, 100);
	strokeWeight(25);
	rect(0, 0, width, height);
}


function windowResized() {
	let s = min(windowWidth, windowHeight);
	resizeCanvas(s, s);
}

function keyTyped() {
	if (key == 's' || key == 'S') saveCanvas('name', 'png');
}

function getResolution() {
	if (dsep < 8) return "Low"
	else if (dsep < 16) return "Medium"
	else return "High"
}

function getTheBackGround() {
	if (Pattern == 'Handy' || Pattern == 'Haecceity')
		return "White";
	else if (Pattern == 'StreamLine') {
		return "Color";
	} else if (Pattern == 'StreamLineII')
		return "Dark";
	else
		return "Default"
}



function generateColor(i, j, Xmax, Ymax) {
	let r;
	let g;
	let b;

	let theHue = map(i, 0, Xmax, 0, 360);
	let theSaturation = 1;
	let theBrightness = 1;

	r = hsv2rgb(theHue, theSaturation, theBrightness)[0] * 255;
	g = hsv2rgb(theHue, theSaturation, theBrightness)[1] * 255;
	b = hsv2rgb(theHue, theSaturation, theBrightness)[2] * 255;

	let bright = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);

	let pg = createGraphics(1, 1);
	pg.loadPixels();
	colorMode(RGB);

	pg.set(0, 0, color(255 - bright));
	pg.updatePixels();
	pg.loadPixels();
	let px = pg.get(0, 0);
	let r1 = px[0];
	let g1 = px[1];
	let b1 = px[2];

	r = (r + r1) / 2;
	g = (g + g1) / 2;
	b = (b + b1) / 2;
	colorMode(RGB);
	let c = color(r, g, b);

	let hh = hue(c);
	let ss = saturation(c);
	let vv = brightness(c);
	let ll = lightness(c);

	let x = i * 100 / Xmax;

	if (x >= 20 && x < 35) {
		ratio = 1 - ((x - 20) / 15);
		ss = ss * ratio;
	}
	if (x >= 35 && x <= 50) {
		ratio = ((x - 35) / 15);
		ss = ss * ratio;
	}
	if (x >= 60 && x < 80) {
		ratio = 1 - 0.5 * ((x - 60) / 20);
		ss = ss * ratio;
	}
	if (x >= 80 && x <= 100) {
		ratio = 0.5 + 0.5 * ((x - 80) / 20);
		ss = ss * ratio;
	}

	j = j * 100 / Ymax;
	if (j <= 50) {
		let limit = ll;
		ll = map(j, 0, 50, 0, limit);
	}
	if (j > 50 && j < 100) {
		let limit = 100 - ll;
		let offset = map(j, 50, 100, 0, limit);
		ll = ll + offset;
	}



	if (x >= 12 && x <= 18 && floor(j) >= 60 && floor(j) <= 80) {
		ratio = 1 - 0.25 * ((x - 12) / 6);
		ss = ss * ratio;
	}

	if (x > 18 && x <= 24 && floor(j) >= 60 && floor(j) <= 80) {
		ratio = 0.85 + 0.15 * ((x - 18) / 6);
		ss = ss * ratio;
	}
	colorMode(HSL);
	let c2 = color(hh, ss, ll);

	r = red(c2);
	g = green(c2);
	b = blue(c2);

	//bright = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
	colorMode(RGB);
	return color(r, g, b);

}

function definingWhiteBackground() {
	let y = floor(random(90, 100));
	let x = floor(random(0, 61));

	let c = generateColor(x, y, 100, 100);

	return c;
}

function definingBlackBackground() {
	let y = floor(random(0, 21));
	let x = floor(random(0, 61));

	let c = generateColor(x, y, 100, 100);

	return c;
}


function definingBackground() {
	let y = floor(random(15, 61));
	let x;
	if (y >= 15 && y < 20) {
		x = floor(random(10, 36));
	}

	if (y >= 20 && y < 50) {
		x = floor(random(0, 61));
	}

	if (y >= 50 && y <= 60) {
		if (random() > 0.33) {
			x = floor(random(40, 61));
		} else if (random() > 0.5) {
			x = floor(random(0, 6));
		} else {
			x = floor(random(95, 101));
		}
	}

	let c = generateColor(x, y, 100, 100);

	return c;
}

function definingColor() {
	let y = floor(random(40, 86));
	let x;
	if (y >= 80 && y < 86) {
		x = floor(random(10, 36));
	}

	if (y >= 50 && y < 80) {
		x = floor(random(0, 61));
	}

	if (y >= 40 && y < 50) {
		if (random() > 0.33) {
			x = floor(random(40, 61));
		} else if (random() > 0.5) {
			x = floor(random(0, 6));
		} else {
			x = floor(random(95, 101));
		}
	}

	let c = generateColor(x, y, 100, 100);

	return c;
}

function definingPerfect() {
	let y = 50;
	let x = random(1, 61);


	let c = generateColor(x, y, 100, 100);

	return c;
}

let hsv2rgb = (h, s, v, f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)) => [f(5), f(3), f(1)];
