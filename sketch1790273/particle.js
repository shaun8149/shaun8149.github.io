class Particle {

	constructor(x, y, flow, initLine) {
		this.pos = createVector(x, y);
		this.prev = this.pos.copy();
		this.showprev = this.pos.copy();
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.maxspeed = MAXSPEED;
		this.maxforce = MAXFORCE;
		this.currentPath = [];
		this.finished = false;
		this.currentPath.push(this.pos.copy());
		this.flow = flow;
		this.isInitLine = initLine;
		this.complete = true;
		this.linePath = [];
	}



	update() {
		let a = 10000;
		while (a-- > 0) {
			this.applyForce(this.follow(this.flow));
			this.vel.add(this.acc);
			this.vel.limit(this.maxspeed);
			this.pos.add(this.vel);
			//print("this.pos===",this.pos);
			this.acc.mult(0);
			//wait for the global configration
			if (Pattern == 'StreamLine' && p5.Vector.dist(this.showprev, this.pos) > 2) {
				this.linePath.push(this.pos.copy());
				this.showprev = this.pos.copy();
			}
			if (p5.Vector.dist(this.prev, this.pos) > samplePointsDistance) {
				this.currentPath.push(this.pos.copy());
				samplePoints.push(this.pos.copy());
				this.prev = this.pos.copy();
			}

			if (this.edges())
				break;
		}

		streamLines.push(this.currentPath);
		secondLines.push(this.currentPath);

		for (let p of this.currentPath) {
			let index = this.flow.lookup(p.x, p.y);
			this.flow.cells[index].samplePoints.push(p);
		}

	}

	applyForce(force) {
		this.acc.add(force);
		this.acc.limit(this.maxforce);
	}

	isFinished() {
		return this.finished;
	}
	isComplete() {
		return this.complete;
	}


	showParticle() {

		for (let i = this.currentPath.length - 1; i > 0; i--) {
			if (Pattern == 'DotLine') {
				if (this.isInitLine == true)
					stroke(40, 100, 100);
				else {
					noStroke();
					fill(colors, 50, brights);
				}
			} else if (Pattern == 'Handy') {
				colorMode(HSB, 360, 100, 100);
				fill(colors);
				if (this.isInitLine == true)
					fill(40, 50, 50);
			} else {
				let hue = map(this.currentPath[i].x, 0, width, 0, 75) + 5 - random(10);
				let saturation = map(this.currentPath[i].y, 0, height, 50, 70);
				fill(hue, saturation, 100);
			}
			this.DIYCircle(this.currentPath[i].x, this.currentPath[i].y, RADIUS_PARTICLE);
		}


	}
	showLine() {
		if (Pattern == 'StreamLine') {
			for (let i = this.linePath.length - 1; i > 0; i--)
				this.DIYLine(this.linePath[i].x, this.linePath[i].y, this.linePath[i - 1].x, this.linePath[i - 1].y);
		} else {
			for (let i = this.currentPath.length - 1; i > 0; i--)
				this.DIYLine(this.currentPath[i].x, this.currentPath[i].y, this.currentPath[i - 1].x, this.currentPath[i - 1].y);
		}
	}
	DIYLine(x1, y1, x2, y2) {
		if (Pattern == 'StreamLine')
			line(x1, y1, x2, y2);
		else if (Pattern == 'Haecceity') {
			this.fillLine(x1, y1, x2, y2);
		} else
			line(x1, y1, x2, y2);
	}
	DIYCircle(x, y, r) {

		if (Pattern == 'Handy') {
			scribble.scribbleEllipse(x, y, r, r);
		} else if (Pattern == 'DotLine') {
			circle(x, y, r);
			fill(360, 0, 100);
			circle(x, y, r / 2);
		} else
			circle(x, y, r);
	}

	showStart() {
		noFill();
		if (Pattern == 'Haecceity') {
			this.drawFlower(this.currentPath[0].x, this.currentPath[0].y, 5, 90, 90, 1);
		} else
			circle(this.currentPath[0].x, this.currentPath[0].y, RADIUS_START);
	}
	show() {
		if (Pattern == 'SeaAndLava' || Pattern == 'Phoenix' || Pattern == 'WaterFall')
			this.showSeaAndLava();
		else if (Pattern == 'StreamLine')
			this.showStreamLine();
		else if (Pattern == 'StreamLineII')
			this.showStreamLineII();
		else if (Pattern == 'Handy')
			this.showHandy();
		else if (Pattern == 'Haecceity')
			this.showHaecceity();
		else if (Pattern == 'DotLine')
			this.showDotLine();
		//this.showStart();
		//this.showParticle();
		//this.showLine();
	}
	showDotLine() {
		this.showStart();
		this.showParticle();
	}
	showStreamLineII() {
		colorMode(RGB);
		stroke(colors1);
		if (this.isInitLine == true) {
			colorMode(HSB, 360, 100, 100);
			stroke(40, 50, 90);
		}
		strokeWeight(2);
		this.showLine();
	}
	showSeaAndLava() {
		noStroke();
		this.showParticle();
	}
	showHandy() {
		noStroke();
		this.showParticle();
	}
	showStreamLine() {
		colorMode(HSB, 360, 100, 100);
		stroke(360, 0, 90);
		if (this.isInitLine == true)
			stroke(40, 50, 90);
		strokeWeight(6);
		//strokeCap(SQUARE);
		this.showStart();
		this.showLine();
	}
	showHaecceity() {
		strokeWeight(1);
		//noFill();
		stroke(360, 1, 1);
		fill(360, 1, 1);

		this.showLine();
		this.showStart();
	}
	edges() {
		if (this.isInitLine) {
			if (this.pos.x > width) this.finished = true;
			if (this.pos.x < 0) this.finished = true;
			if (this.pos.y > height) this.finished = true;
			if (this.pos.y < 0) this.finished = true;
		} else {
			if (this.flow.isValidPos(this.pos.x, this.pos.y) == false) {
				if (this.currentPath.length > 1) {
					this.finished = true;
					this.complete = false;
				}
			}
			if (this.pos.x > width) this.finished = true;
			if (this.pos.x < 0) this.finished = true;
			if (this.pos.y > height) this.finished = true;
			if (this.pos.y < 0) this.finished = true;
		}
		return this.finished;
	}



	follow() {
		let index = this.flow.lookup(this.pos.x, this.pos.y);
		let desired = this.flow.flowField[index];
		if (desired != null) {
			desired.normalize();
			desired.setMag(this.maxspeed);
			// Implement Reynolds: Steering = Desired - Velocity
			let steer = p5.Vector.sub(desired, this.vel);
			steer.limit(this.maxforce);
			return steer;
		} else
			return createVector(0, 0);
	}


	fillLine(x1, y1, x2, y2) {
		let centerX = (x1 + x2) / 2;
		let centerY = (y1 + y2) / 2;

		let v1 = createVector(x1, y1);
		let v2 = createVector(x2, y2);

		let dir = p5.Vector.sub(v2, v1).heading();

		push();
		translate(centerX, centerY);
		rotate(dir);

		let w = p5.Vector.dist(v1, v2) / 2;
		let h = w * 0.6;
		let border = 0;
		let step = floor(random(4, 8));



		if (random() > 0.5) {
			for (let y = -1 * h; y < h; y += step)
				for (let x = -1 * w; x < w; x += step) {
					let hue = map(x, 0, w * 2, 160, 210) + 15 - random(30);
					let saturation = map(y, 0, h * 2, 30, 50);
					let brightness = map(y, 0, h * 2, 50, 80);
					colorMode(HSB,360,100,100);
					stroke(hue, saturation, 100 - brightness);
					strokeWeight(0.15);
					noFill();
					line(x, y, x - step, y);
					line(x, y, x, y - step);
					line(x, y, x + step, y);
					line(x, y, x, y + step);
					//line(x, y, x + step, y + step);
				}
			noStroke();
		}
		for (let y = -1 * h; y < h; y += 4)
			for (let x = -1 * w; x < w; x += 4) {
				let hue = map(x, 0, w * 2, colors, colors + 10 - random(20)) + 5 - random(10);
				let saturation = map(y, 0, h * 2, 50, 70);
				colorMode(HSB,360,100,100);
				fill(hue, saturation, 100);
				if (random() > 0.8)
					scribble.scribbleEllipse(x, y, 6, 6);
				//circle(x,y,3);
			}

		pop();
	}

	drawFlower(x, y, hue, saturation, brightness, size = 1) {
		push()
		translate(x, y);
		colorMode(HSB,360,100,100);
		fill(5, 90, 90);
		ellipseMode(CORNER);
		scale(sqrt(random()) * 0.1);
		let n = 12;
		for (let i = 0; i < n; i++) {
			ellipse(30, -20, 120 * size, 40);
			line(30, 0, 150, -10);
			rotate(TWO_PI / n);
		}
		pop()
	}

}
