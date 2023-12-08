class clone extends Particle {
	constructor(x, y, flow, initLine) {
		super(x, y, flow, initLine);
	}
	applyForce(force) {
		this.acc.add(force.mult(-1));
		this.acc.limit(this.maxforce);
	}

	show() {
		if (Pattern == 'SeaAndLava' || Pattern == 'Phoenix')
			this.showSeaAndLava();
		else if (Pattern == 'WaterFall')
			this.showWaterFall();
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
	showHandy() {
		strokeWeight(1.5);
		//this.showStart();
		this.showParticle();
	}
	showSeaAndLava() {
		stroke(this.pos.x, this.pos.y, 100);
		strokeWeight(StrokeWeightOfSmallClone);
		this.showStart();
		this.showParticle();
	}
	showWaterFall() {
		strokeWeight(1);
		stroke(360, 1, 100);
		this.showLine();
	}
	showStreamLineII() {
		colorMode(RGB);
		stroke(colors2);
		if (this.isInitLine == true) {
			colorMode(HSB, 360, 100, 100);
			stroke(40, 50, 90);
		}
		strokeWeight(2);
		this.showLine();
	}
	showLine() {

		if (Pattern == 'StreamLine') {
			for (let i = this.linePath.length - 1; i > 0; i--)
				this.DIYLine(this.linePath[i].x, this.linePath[i].y, this.linePath[i - 1].x, this.linePath[i - 1].y);
		} else {
			for (let i = this.currentPath.length - 1; i > 0; i--) {
				if (Pattern == 'Haecceity') {
					let hue = map(this.currentPath[i].x, 0, width, 0, 75) + 5 - random(10);
					let saturation = map(this.currentPath[i].y, 0, height, 50, 70);
					colorMode(HSB,360,100,100);
					fill(hue, saturation, 100);
					stroke(hue, saturation, 100);
				}
				this.DIYLine(this.currentPath[i].x, this.currentPath[i].y, this.currentPath[i - 1].x, this.currentPath[i - 1].y);
			}
		}
	}

	showParticle() {

		for (let i = this.currentPath.length - 1; i > 0; i--) {
			if (Pattern == 'DotLine') {
				if (this.isInitLine == true)
					stroke(40, 100, 100);
				else
					stroke(colors, 50, brights);
			} else if (Pattern == 'Handy') {
				let hue = map(this.currentPath[i].x, 0, width, 160, 210) + 15 - random(30);
				let saturation = map(this.currentPath[i].y, 0, height, 30, 50);
				let brightness = map(this.currentPath[i].y, 0, height, 50, 80);
				colorMode(HSB, 360, 100, 100);
				stroke(hue, saturation, 100 - brightness);
				fill(colors);
				if (this.isInitLine == true)
					noFill();
			} else {
				let hue = map(this.currentPath[i].x, 0, width, 160, 210) + 15 - random(30);
				let saturation = map(this.currentPath[i].y, 0, height, 30, 50);
				let brightness = map(this.currentPath[i].y, 0, height, 50, 80);
				stroke(hue, saturation, 100 - brightness);
				noFill();
			}
			if (Pattern == 'SeaAndLava')
				rect(this.currentPath[i].x, this.currentPath[i].y, RADIUS_CLONE, RADIUS_CLONE);
			else
				this.DIYCircle(this.currentPath[i].x, this.currentPath[i].y, RADIUS_CLONE);

		}


	}
}
