const axios = require('axios');
const baseURL =  'http://ec2-52-32-160-115.us-west-2.compute.amazonaws.com:9099';
var currentBoard = [];
var currentMaze;

const checkValidPromise = (id, yPosition, xPosition) => {
  return new Promise((resolve, reject) => {
    axios.get(`${baseURL}/maze/${id}/check?x=${xPosition}&y=${yPosition}`)
      .then(function(response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject('Something bad happened: ', error)
      });
  });
}

function checkValidAsync(id, i, j) {
  axios.get(`${baseURL}/maze/${id}/check?x=${i}&y=${j}`)
    .then(function(response) {
      currentBoard[i][j] = true;
    })
    .catch(function (error) {
      currentBoard[i][j] = false;
    });
}

const makeBoard = (id, height, width, board) => {
  var funcs = [];
    for (var i = 0; i < height; i++) {
      board.push([]);
      funcs.push([]);
      for (var j = 0; j < width; j++) {
        funcs[i][j] = checkValidAsync.bind(null, id, i, j)();
      }
    }
};


// makeBoard('f1a3aaedaf4ee5b72db95d9754f735aefacd6ea4977d373f597eaaaef2badd3ae6fabd35b17abea8f8daabeae53dd55b55a6f4cdd6c5fb67b684d4ca3db7d7f4ada7515f555efe95fa5ab7d2f51aa669da7c3967fd46bcd546a4b3abbff95fee92ff', 28, 28, currentBoard);
//
// setTimeout(function() {
//   console.log(currentBoard);
// }, 20000);

const solvePuzzle = (currentMaze, currentBoard) => {
  // if no id, width and height provided, we can't proceed
  if (currentMaze === null || currentBoard === null) {
    throw new Error('please enter a valid maze and board');
  }

  const id = currentMaze.id;
  const lastCol = currentMaze.width - 1;
  const lastRow = currentMaze.height - 1;

  // Solution
  var path = [];
  // memoize positions which have already been checked to be
  // valid or invalid
  var memo = {};

  if (findPath(id, currentBoard, lastRow, lastCol, path, memo)) {
    return path;
  }
  // empty array if no solution found
  return [];

  // Helper function to find path
  function findPath(id, board, row, col, path, memo) {
    if (row < 0 || col < 0 || !board[currentCol][currentRow]) {
      return false;
    }

    var point = `{x: ${currentCol}, y: ${currentRow}}`;
    if (memo[point]) {
      return memo[point];
    }

    var atOrigin = currentRow === 0 && currentCol === 0;
    var pathExists = false;

    if (atOrigin || findPath(id, board, row - 1, col, path, memo) || findPath(id, board, row, col - 1, path, memo) || findPath(id, board, row - 1, col - 1, path, memo)) {
      path.push(point);
      pathExists = true;
    }
    memo[point] = pathExists;
    return pathExists;
  }
}



module.exports = (app) => {
  // Get current maze via Krypton API and build up board based
  // on current maze
  app.get('/getmaze', (req, res) => {
    axios.post(`${baseURL}/maze`)
      .then(function(maze) {
        currentMaze = maze.data;
        currentBoard = [];
        makeBoard(maze.data.id, maze.data.height, maze.data.width, currentBoard);
        res.status(200).send(currentMaze);
      })
      .catch(function (error) {
        throw new Error(error.stack);
      });
  });

  // Solve current maze and send path solution as response
  app.get('/solvemaze', (req, res) => {
    var path = solvePuzzle(currentMaze, currentBoard);
    res.status(200).send({'Path to end of maze': path});
  });

  // Submit maze to the Krypton API
  app.get('/submitmaze', (req, res) => {

  });

  // TEMP for testing
  app.get('/testing', (req, res) => {
    res.status(200).send({'Current board': currentBoard, 'Current maze': currentMaze});
  });

};
