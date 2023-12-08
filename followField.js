class flowField {

	constructor(res) {

		this.resolution = res;
		this.cols = floor(width / this.resolution);
		this.rows = floor(height / this.resolution);
		this.flowField = [];
		this.cells = [];
		this.init();
	}

	init() {
		let angle;
		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				let index = x + y * this.cols;
				if (Pattern == 'StreamLineII'||Pattern == 'StreamLine' || Pattern == 'Haecceity'||Pattern == 'DotLine') {
					if (direction == 'Noise')
						angle = noise(xFactor * x / this.cols, yFactor * y / this.rows) * TWO_PI;
					else if (direction == 'Linear')
						angle = theangle;
					else if (direction == 'Radial-Cols')
						angle=-1 * x/this.cols * PI;
					else if (direction == 'Radial-ColsII')
						angle=x/this.cols * PI;
					else if(direction == 'Radial-Rows')
						angle=y / this.rows * PI;
					else if(direction == 'Radial-RowsII')
						angle=-1 * y / this.rows * PI;
					else if(direction == 'Ray')
						angle=atan2(y-this.rows * offset,x-this.cols * offset);
					else if(direction == 'Circular'){
						angle=atan2(y-this.rows * offset,x-this.cols * offset)+PI/2;
					}
					else if(direction == 'Spiral')
						angle=atan2(y-this.rows * offset,x-this.cols * offset)+PI * offsetAngle;
					else if(direction == 'Chaos')
						angle=atan2(y-this.rows * offset,x-this.cols * offset)+PI * random_int(1,7)/8;
					else if(direction == 'Radial-Cos'){
						angle=atan2(y-this.rows * offset,x-this.cols * offset)+PI/2;
						angle=angle+cos(angle);
					}
					else if(direction == 'Radial-Sin'){
						angle=atan2(y-this.rows * offset,x-this.cols * offset)+PI/2;
						angle=angle+sin(angle);
					}
					else if(direction == 'Radial-SinCos'){
						angle=atan2(y-this.rows * offset,x-this.cols * offset)+PI/2;
						angle=angle+sin(angle)+cos(angle);
					}
					// {
					// 	let n = random_int(0, 3);
					// 	switch (n) {
					// 		case 1:
					// 			angle = y / this.rows * PI;
					// 			break;
					// 		case 2:
					// 			angle = x / this.cols * PI;
					// 			break;
					// 		case 3:
					// 			angle = -1 *y / this.rows * PI;
					// 			break;
					// 		case 4:
					// 			angle = -1 *x / this.cols * PI;
					// 			break;
					// 	}
					// }
				} else
					angle = noise(xFactor * x / this.cols, yFactor * y / this.rows) * TWO_PI;
				let v = p5.Vector.fromAngle(angle);
				this.flowField.push(v);
				this.cells.push(new cell());
			}
		}
	}

	update() {

		for (let y = 0; y < this.rows; y++) {
			for (let x = 0; x < this.cols; x++) {
				let index = x + y * this.cols;
				let angle = noise(xFactor * x / this.cols, yFactor * y / this.rows) * TWO_PI;
				let v = p5.Vector.fromAngle(angle);
				this.flowField[index] = v;
			}
		}
	}

	show() {
		for (let i = 0; i < this.flowField.length; i++) {
			let arrowSize = 4;
			push();
			noFill();
			strokeWeight(0.5);
			stroke(0, 0, 100);
			let x = floor(i % this.cols);
			let y = floor(i / this.cols);
			translate(x * this.resolution, y * this.resolution);
			rotate(this.flowField[i].heading());
			line(0, 0, this.resolution, 0);
			line(this.resolution, 0, this.resolution - arrowSize, arrowSize / 2);
			line(this.resolution, 0, this.resolution - arrowSize, -arrowSize / 2);
			pop();
		}

	}
	//input one point position, and return the index on the flowfield/cells
	lookup(posx, posy) {
		let x = floor(constrain(posx / this.resolution, 0, this.cols - 1));
		let y = floor(constrain(posy / this.resolution, 0, this.rows - 1));
		let index = x + y * this.cols;
		return index;

	}
	//default , if one point is not on the border, return itself and its eight neighbors cell index
	lookupNeighbor(x, y) {
		let neighbor = [];
		// let x = floor(constrain(posx / this.resolution,0,this.cols-1));
		// let y = floor(constrain(posy / this.resolution,0,this.rows-1));
		if (x == 0 && y == 0) {
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y) * this.cols]);
			neighbor.push(this.cells[(x) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y + 1) * this.cols]);
		} else if (x == this.cols - 1 && y == this.rows - 1) {
			neighbor.push(this.cells[(x - 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[x + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
		} else if (x == 0 && y == this.rows - 1) {
			neighbor.push(this.cells[x + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y) * this.cols]);
		} else if (x == this.cols - 1 && y == 0) {
			neighbor.push(this.cells[(x - 1) + (y) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x) + (y + 1) * this.cols]);
		} else if (x == 0) {
			neighbor.push(this.cells[x + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y) * this.cols]);
			neighbor.push(this.cells[(x) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y + 1) * this.cols]);
		} else if (y == 0) {
			neighbor.push(this.cells[(x - 1) + (y) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y) * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y + 1) * this.cols]);
		} else if (x == this.cols - 1) {
			neighbor.push(this.cells[(x - 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[x + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x) + (y + 1) * this.cols]);
		} else if (y == this.rows - 1) {
			neighbor.push(this.cells[(x - 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[x + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y) * this.cols]);
		} else if (!(x == 0 || y == 0 || x == this.cols - 1 || y == this.rows - 1)) {
			neighbor.push(this.cells[(x - 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[x + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y - 1) * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y) * this.cols]);
			neighbor.push(this.cells[x + y * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y) * this.cols]);
			neighbor.push(this.cells[(x - 1) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x) + (y + 1) * this.cols]);
			neighbor.push(this.cells[(x + 1) + (y + 1) * this.cols]);
		}
		return neighbor;
	}

	isValidSample(posx, posy) {
		let isValid = true;
		let count = 0;
		let x = floor(constrain(posx / this.resolution, 0, this.cols - 1));
		let y = floor(constrain(posy / this.resolution, 0, this.rows - 1));
		if (x == 0 || y == 0 || x == this.cols - 1 || y == this.rows - 1)
			return false;
		else {
			let N = this.lookupNeighbor(x, y);
			let thePoints = N.filter(p => p.isNotEmpty());
			for (let n of thePoints) {
				for (let other of n.samplePoints) {
					if (other != null) {
						let d = p5.Vector.dist(other, createVector(posx, posy));
						if (d < dsep)
							count++;
					}
				}
			}
			if (count > 0) {
				isValid = false;
			}
		}

		return isValid;
	}


	isValidPos(posx, posy) {
		let isValid = true;
		let count = 0;
		let x = floor(constrain(posx / this.resolution, 0, this.cols - 1));
		let y = floor(constrain(posy / this.resolution, 0, this.rows - 1));
		let N = this.lookupNeighbor(x, y);
		let thePoints = N.filter(p => p.isNotEmpty());
		for (let n of thePoints) {
			for (let other of n.samplePoints) {
				if (other != null) {
					let d = p5.Vector.dist(other, createVector(posx, posy));
					if (d < dtest)
						count++;
				}
			}

			if (count > 0) {
				isValid = false;
			}
		}

		return isValid;
	}
	getValidColor(posx, posy){
		let colorGroup=[];
		let distance=[];
		let count = 0;
		let colorsPercent=[0.6,0.5,0.4,0.3,0.2];
		let x = floor(constrain(posx / this.resolution, 0, this.cols - 1));
		let y = floor(constrain(posy / this.resolution, 0, this.rows - 1));
		let N = this.lookupNeighbor(x, y);
		let thePoints = N.filter(p => p.isNotEmpty());
		for (let n of thePoints) {
			for (let other of n.samplePoints) {
				if (other != null && other.colors!=-1 && other.brights!=-1) 
					colorGroup.push(other);
			}
		}
		colorGroup.sort((a,b)=>{
		let da = p5.Vector.dist(a, createVector(posx, posy));
		let db = p5.Vector.dist(a, createVector(posx, posy));
		return da-db;
		});
		//下面这段代码有问题，应该使用While循环
		let colors=colorGroup[random_int(0,4)];
		let i=colorGroup.indexOf(colors);
		let r=random(2);
		if(r<colorsPercent[i])
		{return colors;
		}
		return -1;
	}
	
	showCell() {
		stroke(255);
		for (let c of this.cells) {
			for (let p of c.samplePoints) {
				rect(p.x, p.y, 6, 6);
			}
		}
	}

}