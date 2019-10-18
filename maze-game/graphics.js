var Scene = function (timeStart) {
	var canvas = $('#canvas-main')[0];
	var context = canvas.getContext('2d');
	var displayShortestPath_p = false;
	var displayBreadCrumb_p = false;
	var displayScore_p = false;
	var displayClue_p = false;
	context.strokeStyle = "white";
	context.font = "60px Sans-Serif";
	context.fillStyle = "red";
	CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
	this.init = function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
	};

	this.displayFinish = function (data) {
		var tempFont = context.font;
		context.fillStyle = 'white';
		context.fillText("Maze Complete!", 10, 50);
		context.font = "30px Sans-Serif";
		context.fillStyle = "red";
		context.fillText("Player Name: " + data['Player Name'], 20, 120);
		context.fillText("Score: " + data.Score, 20, 160);
		context.fillText("Time: " + data.Time, 20, 200);
		context.fillText("Maze Size: " + data['Maze Size'] + 'x' + data['Maze Size'], 20, 240);
		context.font = tempFont;
	}

	this.beginRender = function () {
		context.clear();
	};

	this.sceneData = {
		imageSP1: new Image(),
		imageSP2: new Image(),
		imageSP3: new Image(),
		imageBreadCrumb: new Image(),
		imageClue: new Image(),
		breadCrumbRotation: 0,
		timeStart: timeStart
	};

	this.sceneData.imageSP1.src = 'maze-game/shortestPath1.png';
	this.sceneData.imageSP2.src = 'maze-game/shortestPath2.png';
	this.sceneData.imageSP3.src = 'maze-game/shortestPath3.png';
	this.sceneData.imageBreadCrumb.src = 'maze-game/breadCrumb.png';
	this.sceneData.imageClue.src = 'maze-game/clue.png';

	this.getDSP = function () {
		return {'displayShortestPath_p': displayShortestPath_p};
	}
	function DSP_P (toggle_p) {
		if (toggle_p) {
			displayShortestPath_p = !displayShortestPath_p;
		}
		else {
			return displayShortestPath_p;
		}
	}

	this.getBreadCrumb = function () {
		return {'displayBreadCrumb_p': displayBreadCrumb_p};
	}
	function DBC_P (toggle_p) {
		if (toggle_p) {
			displayBreadCrumb_p = !displayBreadCrumb_p;
		}
		else {
			return displayBreadCrumb_p;
		}
	}

	this.getClue = function () {
		return {'displayClue_p': displayClue_p};
	};
	function DC_P (toggle_p) {
		if (toggle_p) {
			displayClue_p = !displayClue_p;
		}
		else {
			return displayBrdisplayClue_p;
		}
	}

	function DSS_P (toggle_p) {
		if (toggle_p) {
			displayScore_p = !displayScore_p;
		}
		else {
			return displayScore_p;
		}
	}
	this.drawScore = function (score=0) {
		if (displayScore_p) {
			context.fillText("Score: " + score, canvas.width/4,50);
		}
	};

	window.addEventListener('keydown', function(event) {
		if (event.key.toLowerCase() == 'p') {
			DSP_P(true);
		}
		if (event.key.toLowerCase() == 'b') {
			DBC_P(true);	
		}
		if (event.key.toLowerCase() == 'y') {
			console.log("score");
			DSS_P(true);	
		}
		if (event.key.toLowerCase() == 'h') {
			DC_P(true);
		}
	});

	this.Player = function (maze, pdata) {
		var mazeDimensions = maze.length;
		var wallLength = Math.floor(canvas.width/mazeDimensions);
		var imageWidth = 30;
		var imageHeight = 30;
		if (pdata) {
			imageWidth = pdata.width;
			imageHeight = pdata.height;
		}
		var ready = false;
		var playerImage = new Image();
		var _data = $.extend({
			imageSource: 'maze-game/playerImage.png',
			x: wallLength/2-imageWidth/2,
			y: wallLength/2-imageHeight/2,
			width: imageWidth,
			height: imageHeight,
			maze: maze,
			currenti: 0,
			currentj: 0,
			speed: imageWidth*.1,
			score: 0
		}, pdata);
		var Key = {
			_pressed: {},
			LEFT: 65,
			LEFT2: 100,
			UP: 87,
			UP2: 104,
			RIGHT: 68,
			RIGHT2: 102,
			DOWN: 83,
			DOWN2: 101,
			isDown: function(keyCode) {
			  	return this._pressed[keyCode];
			},
			onKeydown: function(event) {
			  	this._pressed[event.keyCode] = true;
			},
			onKeyup: function(event) {
				delete this._pressed[event.keyCode];
			}
		};

		this.score = function (val) {
			if (val) {
				_data.score += val;
			}
			else {
				return _data.score;
			}
		}

		this.getX = function () {
			return _data.currenti;
		};
		this.getY = function () {
			return _data.currentj;
		};

		this.move = function (direction) {
			if (direction == 'right') {
				_data.x += _data.speed;
			}
			if (direction == 'down') {
				_data.y += _data.speed;
			}
			if (direction == 'left') {
				_data.x -= _data.speed;
			}
			if (direction == 'up') {
				_data.y -= _data.speed;
			}
		};

		window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

		playerImage.onload = function () {
			ready = true;
		};
		playerImage.src = _data.imageSource;

		this.update = function () {
			var pCenterX = _data.x+imageWidth/2;
			var pCenterY = _data.y+imageHeight/2;
			var cellCenterX = (_data.currentj)*wallLength+(wallLength/2);
			var cellCenterY = (_data.currenti)*wallLength+(wallLength/2);

			if (pCenterX > (_data.currentj+1)*wallLength) {
				_data.currentj = _data.currentj + 1;
			}	
			if (pCenterX < (_data.currentj)*wallLength) {
				_data.currentj = _data.currentj - 1;
			}
			if (pCenterY > (_data.currenti+1)*wallLength) {
				_data.currenti = _data.currenti + 1
			}	
			if (pCenterY < (_data.currenti)*wallLength) {
				_data.currenti = _data.currenti - 1;
			}

			// Detect whether or not the player is try to move against a wall
			if (Key.isDown(Key.UP) || Key.isDown(Key.UP2)) {
				if (!_data.maze[_data.currenti][_data.currentj].topW) {
					this.move('up');
				}
				else {
					if (pCenterY-(imageWidth/2) > (_data.currenti)*wallLength) {
						this.move('up');
					}
				}
			}
			if (Key.isDown(Key.DOWN) || Key.isDown(Key.DOWN2)) {
				if (!_data.maze[_data.currenti][_data.currentj].bottomW) {
					this.move('down');
				}
				else {
					if (pCenterY+(imageWidth/2) < (_data.currenti+1)*wallLength) {
						this.move('down');
					}
				}
			}
			if (Key.isDown(Key.LEFT) || Key.isDown(Key.LEFT2)) {
				if (!_data.maze[_data.currenti][_data.currentj].leftW) {
					this.move('left');
				}
				else {
					if (pCenterX-(imageWidth/2) > (_data.currentj)*wallLength) {
						this.move('left');
					}
				}
			}
			if (Key.isDown(Key.RIGHT) || Key.isDown(Key.RIGHT2)) {
				if (!_data.maze[_data.currenti][_data.currentj].rightW) {
					this.move('right');
				}
				else {
					if (pCenterX+(imageWidth/2) < (_data.currentj+1)*wallLength) {
						this.move('right');
					}
				}
			}
		};

		this.draw = function () {
			if (ready) {
				context.save();

				context.drawImage(
					playerImage,
					_data.x,
					_data.y,
					_data.width,
					_data.height
				);

				context.restore();
			}
		};
	}

	//NOTE: the drawMaze assumes the canvas is a perfect square
	this.drawMaze = function (maze) {
		var mazeDimensions = maze.length;
		var wallLength = Math.floor(canvas.width/mazeDimensions);

		// paint start and ending points
		//========================================/
		var prevfillStyle = context.fillStyle;
		context.fillStyle = "green";
		context.fillRect(wallLength*.2, wallLength*.2, wallLength*.6, wallLength*.6);
		context.fillStyle = "red";
		context.fillRect(canvas.width-wallLength+wallLength*.2, canvas.width-wallLength+wallLength*.2, wallLength*.6, wallLength*.6);
		context.fillStyle = prevfillStyle;
		//========================================/

		// Paint the walls reflecting the maze generated in the mazeGenerator.
		for (let ii = 0; ii < mazeDimensions; ii = ii + 1) {
			for (let jj = 0; jj < mazeDimensions; jj = jj + 1) {
				if (maze[ii][jj].topW) {
					context.beginPath();
					context.moveTo(jj*(wallLength), ii*wallLength);
					context.lineTo((jj+1)*wallLength, ii*wallLength);
					context.stroke();
				}
				if (maze[ii][jj].rightW) {
					context.beginPath();
					context.moveTo((jj+1)*(wallLength), ii*wallLength);
					context.lineTo((jj+1)*wallLength, (ii+1)*wallLength);
					context.stroke();
				}
				if (maze[ii][jj].bottomW) {
					context.beginPath();
					context.moveTo((jj)*(wallLength), (ii+1)*wallLength);
					context.lineTo((jj+1)*wallLength, (ii+1)*wallLength);
					context.stroke();
				}
				if (maze[ii][jj].leftW) {
					context.beginPath();
					context.moveTo((jj)*(wallLength), (ii)*wallLength);
					context.lineTo((jj)*wallLength, (ii+1)*wallLength);
					context.stroke();
				}
			}
		}
	};

	this.drawClue = function (maze, data, width, height) {
		var mazeDimensions = maze.length;
		var wallLength = Math.floor(canvas.width/mazeDimensions);
		if (data.displayClue_p) {
			console.log("testing");
			var clueCount = 0;
			for (var ii = 0; ii < maze.length; ii = ii + 1) {
				if (clueCount >= 1) {
					break;
				}
				for (var jj = 0; jj < maze[0].length; jj = jj + 1) {
					if (maze[ii][jj].dynamicPartOfShortestPath_p) {
						if (clueCount >= 1) {
							context.save();

							context.drawImage(
								data['imageClue'],
								ii*wallLength + wallLength/2 - width/2,
								jj*wallLength + wallLength/2 - height/2,
								width,
								height
							);

							context.restore();
							break;
						}
						clueCount++;
					}
				}
			}
		}
	};

	this.drawShortestPath = function (maze, data, width, height) {
		var mazeDimensions = maze.length;
		var wallLength = Math.floor(canvas.width/mazeDimensions);
		if (data.displayShortestPath_p) {
			for (var ii = 0; ii < maze.length; ii = ii + 1) {
				for (var jj = 0; jj < maze[0].length; jj = jj + 1) {
					if (maze[ii][jj].dynamicPartOfShortestPath_p) {
						context.save();

						context.drawImage(
							data['imageSP' + Math.floor(Math.random()*(3-1+1)+1)],
							ii*wallLength + wallLength/2 - width/2,
							jj*wallLength + wallLength/2 - height/2,
							width,
							height
						);

						context.restore();
					}
				}
			}
		}
	};

	this.drawBreadCrumb = function (maze, data, width, height) {
		if (data.displayBreadCrumb_p) {
			var mazeDimensions = maze.length;
			var wallLength = Math.floor(canvas.width/mazeDimensions);
			for (var ii = 0; ii < maze.length; ii = ii + 1) {
				for (var jj = 0; jj < maze[0].length; jj = jj + 1) {
					if (maze[ii][jj].visited_p) {
						context.save();

						context.translate(ii*wallLength + wallLength/2, jj*wallLength + wallLength/2);
						context.rotate(this.sceneData.breadCrumbRotation*Math.PI/180);
						// this.sceneData.breadCrumbRotation += 5%180;
						context.translate(-(ii*wallLength + wallLength/2), -(jj*wallLength + wallLength/2));
						context.drawImage(
							data.imageBreadCrumb,
							ii*wallLength + wallLength/2 - width/2,
							jj*wallLength + wallLength/2 - height/2,
							width,
							height
						);

						context.restore();
					}
				}
			}
		}
	};

	this.breadCrumbUpdate = function () {
		this.sceneData.breadCrumbRotation += 20;
	};

	this.beginRender = function () {
		context.clear();
	};

	this.getCanvasWidthHeight = function () {
		return canvas.width;
	};
};