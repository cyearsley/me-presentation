console.log("gameLoop.js loaded!");

// Test to see if a string is an integer
function isInteger(string) {
	return /^\+?(0|[1-9]\d*)$/.test(string);
}

// Game Loop OBJECT
//	This object is not the official game loop.
var gameLoop = function (initData) {
	'use strict';
	var _gameData = $.extend({
		scene: null,
		maze: null,
		mazeStatus: {
			status: 'pending',
			dimensions: 0
		}
	}, initData);
	var me = this;
	var highScores = [];

	$('.new-maze-link').on('click', function () {
		_gameData.mazeStatus.status = 'create';
		_gameData.mazeStatus.dimensions = parseInt($(this).attr('mazesize'));
	});

	// Initialze the gameloop
	//	This init function begins the gameLoop
	this.init = function (initialTimestamp) {
		_gameData.previousTimestamp = initialTimestamp;
		window.requestAnimationFrame(_gameLoop);
	};

	function finishRound (score, initialTime, finishingTime, mazeSize) {
		highScores.push({
			'Player Name': $('.player-name-input')[0].value,
			Score: score,
			Time: ((finishingTime-initialTime)/1000).toFixed(2) + ' seconds',
			'Maze Size': mazeSize
		});
		$('.hs-list')[0].innerHTML = '';

		for (var i = 0; i < highScores.length; i++) {
			var hs = highScores[i]
			var hsHtml = "<li><br />Player Name: " + hs['Player Name'] + '<br />Score: ' + hs.Score + '<br />Time: ' + hs.Time + '<br />Maze Size: ' + hs['Maze Size'] + '<br />==============<br /></li>'
			$('.hs-list').append(hsHtml);
			console.log(highScores[i]);
		}
		_gameData.scene.beginRender();
		_gameData.scene.displayFinish(highScores[highScores.length-1]);
		_gameData.scene = null;
		_gameData.maze = null;
	}

	// ========================================================= //
	//
	// G A M E   L O O P
	//
	// ========================================================= //
	var _gameLoop = function (currentTimestamp) {

		_gameData.previousTimestamp = currentTimestamp;

		// Call UPDATE
		_update(currentTimestamp);

		// Call RENDER
		_render();

		// REQUEST ANIMATION FRAME
		window.requestAnimationFrame(_gameLoop);
	};

	// ========================================================= //
	//
	// U P D A T E
	//
	// ========================================================= //
	var _update = function (currentTimestamp) {
		if (_gameData.mazeStatus.status == 'render') {
			_gameData.mazeStatus.status = 'pending';
		}
		if (_gameData.mazeStatus.status == 'create') {
			_gameData.mazeStatus.status = 'render';
			_gameData.maze = new mazeGenerator(_gameData.mazeStatus.dimensions);
			_gameData.maze.setShortestPath(_gameData.maze.findShortestPath())
			console.log(_gameData.maze.findShortestPath());
			_gameData.scene = new Scene(currentTimestamp);

			// Create the player and their dimensions.
			var playerDimensions = (_gameData.scene.getCanvasWidthHeight()/_gameData.maze.getMaze().length) - (_gameData.scene.getCanvasWidthHeight()/_gameData.maze.getMaze().length)*.2
			_gameData.player = new _gameData.scene.Player(_gameData.maze.getMaze(), {width: playerDimensions, height: playerDimensions});
			
			_gameData.scene.init();
		}
		if (_gameData.maze && _gameData.player) {
			var i = _gameData.player.getY();
			var j = _gameData.player.getX();
			_gameData.player.score(_gameData.maze.setBreadCrumb(i, j));
			_gameData.maze.findCurrentShortestPath(j, i);

			if (i == _gameData.maze.getMaze().length-1 && j == _gameData.maze.getMaze().length-1) {
				finishRound(_gameData.player.score(), _gameData.scene.sceneData.timeStart, currentTimestamp, _gameData.maze.getMaze().length);
			}
		}
		if (_gameData.player) {
			_gameData.player.update();
		}
		if (_gameData.scene) {
			_gameData.scene.breadCrumbUpdate();
		}
	};

	// ========================================================= //
	//
	// R E N D E R
	//
	// ========================================================= //
	var _render = function () {
		
		if (_gameData.scene) {
			_gameData.scene.beginRender();
			_gameData.scene.drawMaze(_gameData.maze.getMaze());
			if (_gameData.player) {
				_gameData.scene.drawScore(_gameData.player.score());
			}

			var spriteDimensions = (_gameData.scene.getCanvasWidthHeight()/_gameData.maze.getMaze().length) - (_gameData.scene.getCanvasWidthHeight()/_gameData.maze.getMaze().length)*.7
			_gameData.scene.drawShortestPath(_gameData.maze.getMaze(), $.extend(_gameData.scene.sceneData, _gameData.scene.getDSP()), spriteDimensions, spriteDimensions);
			_gameData.scene.drawClue(_gameData.maze.getMaze(), $.extend(_gameData.scene.sceneData, _gameData.scene.getClue()), spriteDimensions, spriteDimensions);
			_gameData.scene.drawBreadCrumb(_gameData.maze.getMaze(), $.extend(_gameData.scene.sceneData, _gameData.scene.getBreadCrumb()), spriteDimensions, spriteDimensions);
			_gameData.player.draw();
		}
	};
};
