
console.log("mazeAlgorithm.js loaded!");
var mazeGenerator = function (dimensions) {
	'use strict';

	var _maze = [];
	var _frontierCells = [];
	for (let ii = 0; ii < dimensions; ii = ii + 1) {
		_maze.push([]);
		for (let jj = 0; jj < dimensions; jj = jj + 1) {
			_maze[ii].push({
				topW: true,
				rightW: true,
				bottomW: true,
				leftW: true,
				partOfMaze_p: false,
				partOfShortestPath_p: false,
				dynamicPartOfShortestPath_p: false,
				isStart_p: false,
				isEnd_p: false,
				visited_p: false,
				color: 'teal'
			});
		}
	}
	_maze[0][0].isStart_p = true;
	_maze[0][0].color = 'green';
	_maze[0][0].visited_p = true;
	_maze[dimensions-1][dimensions-1].isEnd_p = true;
	_maze[dimensions-1][dimensions-1].color = 'red';

	var x = getRandomNumberInInterval(0, _maze.length-1);
	var y = getRandomNumberInInterval(0, _maze[0].length-1);
	_maze[x][y].partOfMaze_p = true;
	createFrontier(x, y);
	// console.log('frontier: ', _frontierCells);
	// console.log ('x, y: ', x, ',', y);
	while (_frontierCells.length) {
		// select a random _frontierCell
		var fCellIndex = getRandomNumberInInterval(0, _frontierCells.length-1);
		x = parseInt(_frontierCells[fCellIndex].split(',')[0]);
		y = parseInt(_frontierCells[fCellIndex].split(',')[1]);

		var neighbors = getNeighborsPartOfMaze(x, y);
		// console.log("neighbors: ", neighbors, ' - x,y: ', x,y);

		var neighborIndex = getRandomNumberInInterval(0, neighbors.length-1);
		var fx = parseInt(neighbors[neighborIndex].split(',')[0]);
		var fy = parseInt(neighbors[neighborIndex].split(',')[1]);

		_maze[x][y].partOfMaze_p = true;
		_frontierCells.splice(fCellIndex, 1);

		if (x < fx) {
			_maze[x][y].bottomW = false;
			_maze[fx][fy].topW = false;
		}
		else if (x > fx) {
			_maze[x][y].topW = false;
			_maze[fx][fy].bottomW = false;
		}
		else if (y < fy) {
			_maze[x][y].rightW = false;
			_maze[fx][fy].leftW = false;
		}
		else if (y > fy) {
			_maze[x][y].leftW = false;
			_maze[fx][fy].rightW = false;
		}


		createFrontier(x, y);
	}

	this.findCurrentShortestPath = function (x, y) {
		var path = this.findShortestPath(x, y, []);
		// reset the shortest path
		for (var ii = 0; ii < _maze.length; ii = ii + 1) {
			for (var jj = 0; jj < _maze[0].length; jj = jj + 1) {
				_maze[ii][jj].dynamicPartOfShortestPath_p = false;
			}
		}
		for (var ii = 0; ii < path.length; ii = ii + 1) {
			// console.log(path[ii]);
			var x = parseInt(path[ii].split(',')[1]);
			var y = parseInt(path[ii].split(',')[0]);
			_maze[x][y].dynamicPartOfShortestPath_p = true;
		}
	}

	this.setShortestPath = function (path) {
		for (var ii = 0; ii < path.length; ii = ii + 1) {
			// console.log(path[ii]);
			var x = parseInt(path[ii].split(',')[1]);
			var y = parseInt(path[ii].split(',')[0]);
			_maze[x][y].partOfShortestPath_p = true;
			_maze[x][y].dynamicPartOfShortestPath_p = true;
		}
	};

	this.setBreadCrumb = function (x, y) {
		var score = 0;
		if (!_maze[x][y].visited_p) {
			if (_maze[x][y].partOfShortestPath_p) {
				score = 5;
			}
			else {
				if (
					(_maze[x-1] && _maze[x-1][y].partOfShortestPath_p) ||
					(_maze[x+1] && _maze[x+1][y].partOfShortestPath_p) ||
					(_maze[x][y-1] && _maze[x][y-1].partOfShortestPath_p) ||
					(_maze[x][y+1] && _maze[x][y+1].partOfShortestPath_p)
				) {
					score = -2;
				}
				else {
					score = -5
				}
			}
		}
		_maze[x][y].visited_p = true;
		return score;
	};

	this.findShortestPath = function (x=0, y=0, currentPath=[]) {
		if (_maze[x][y].isEnd_p) {
			currentPath.push(x + ',' + y);
			return currentPath;
		}

		if (
			(_maze[x][y].topW || currentPath.indexOf((x-1) + ',' + y) != -1) &&
			(_maze[x][y].bottomW || currentPath.indexOf((x+1) + ',' + y) != -1) &&
			(_maze[x][y].leftW || currentPath.indexOf(x + ',' + (y-1)) != -1) &&
			(_maze[x][y].rightW || currentPath.indexOf(x + ',' + (y+1)) != -1)
			) {

				return false;
		}
		currentPath.push(x + ',' + y);
		if (!_maze[x][y].topW && currentPath.indexOf((x-1) + ',' + y) == -1) {
			var pathA = this.findShortestPath(x-1, y, currentPath);
		}
		else {
			var pathA = false;
		}
		if (!_maze[x][y].bottomW && currentPath.indexOf((x+1) + ',' + y) == -1) {
			var pathB = this.findShortestPath(x+1, y, currentPath);
		}
		else {
			var pathB = false;
		}
		if (!_maze[x][y].leftW && currentPath.indexOf(x + ',' + (y-1)) == -1) {
			var pathC = this.findShortestPath(x, y-1, currentPath);
		}
		else {
			var pathC = false;
		}
		if (!_maze[x][y].rightW && currentPath.indexOf(x + ',' + (y+1)) == -1) {
			var pathD = this.findShortestPath(x, y+1, currentPath);
		}
		else {
			var pathD = false;
		}

		if (!pathA && !pathB && !pathC && !pathD) {
			currentPath.splice(currentPath.indexOf(x + ',' + y), 1);
		}

		return (pathA || pathB || pathC || pathD);
	};

	function createFrontier(x, y) {
		x = parseInt(x);
		y = parseInt(y);
		if (_maze[x+1] && _maze[x+1][y] && !_maze[x+1][y].partOfMaze_p) {
			if (!valueInArray(_frontierCells, (x+1)+','+y)) {
				_frontierCells.push((x+1)+','+y);
			}
		}
		if (_maze[x-1] && _maze[x-1][y] && !_maze[x-1][y].partOfMaze_p) {
			if (!valueInArray(_frontierCells, (x-1)+','+y)) {
				_frontierCells.push((x-1)+','+y);
			}
		}
		if (_maze[x][y+1] && !_maze[x][y+1].partOfMaze_p) {
			if (!valueInArray(_frontierCells, x+','+(y+1))) {
				_frontierCells.push(x+','+(y+1));
			}
		}
		if (_maze[x][y-1] && !_maze[x][y-1].partOfMaze_p) {
			if (!valueInArray(_frontierCells, x+','+(y-1))) {
				_frontierCells.push(x+','+(y-1));
			}
		}
		return;
	}

	function valueInArray (arr, val) {
		if (arr.indexOf(val) >= 0) {
			return true;
		}
		else {
			return false;
		}
	}

	function getNeighborsPartOfMaze(x, y) {
		var neighborList = [];
		x = parseInt(x);
		y = parseInt(y);

		if (_maze[x+1] && _maze[x+1][y] && _maze[x+1][y].partOfMaze_p) {
			neighborList.push((x+1)+','+y);
		}
		if (_maze[x-1] && _maze[x-1][y] && _maze[x-1][y].partOfMaze_p) {
			neighborList.push((x-1)+','+y);
		}
		if (_maze[x][y+1] && _maze[x][y+1].partOfMaze_p) {
			neighborList.push(x+','+(y+1));
		}
		if (_maze[x][y-1] && _maze[x][y-1].partOfMaze_p) {
			neighborList.push(x+','+(y-1));
		}
		return neighborList;
	}

	function getRandomNumberInInterval (a, b) {
		return Math.floor(Math.random()*(b-a+1)+a);
	}

	this.getMaze = function () {
		return _maze;
	}

	this.printMaze = function () {
		for (let ii = 0; ii < _maze.length; ii = ii + 1) {
			var line = '';
			for (let jj = 0; jj < _maze[ii].length; jj = jj + 1) {
				let cell = _maze[ii][jj];
				if (cell.topW && cell.leftW) {
					line += '|^~';
				}
				else if (cell.topW && cell.rightW) {
					line += '~^|';
				}
				else if (cell.bottomW && cell.leftW) {
					line += '|._';
				}
				else if (cell.bottomW && cell.rightW) {
					line += '_.|';
				}
				else if (cell.topW) {
					line += '~^~';
				}
				else if (cell.rightW) {
					line += '  |';
				}
				else if (cell.bottomW) {
					line += '_._';
				}
				else if (cell.leftW) {
					line += '|  ';
				}
				else {
					line += '   ';
				}
			}
			console.log(line);
		}
	};

};

// maze = new mazeGenerator(20);
// console.log(maze.getMaze());
// maze.printMaze();
