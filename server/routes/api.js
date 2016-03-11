const axios = require('axios');
const baseURL =  'http://ec2-52-32-160-115.us-west-2.compute.amazonaws.com:9099';
// These variables represent the current state of the maze
var currentBoard = [];
var currentMaze;
var currentPath;

const checkValidAsync = (id, i, j) => {
  axios.get(`${baseURL}/maze/${id}/check?x=${i}&y=${j}`)
    .then(function(response) {
      currentBoard[i][j] = 1;
    })
    .catch(function (error) {
      currentBoard[i][j] = 0;
    });
}

const makeBoard = (id, height, width, board) => {
  var funcs = [];
    for (var i = 0; i < height; i++) {
      board.push([]);
      funcs.push([]);
      for (var j = 0; j < width; j++) {
        board[i][j] = 'todo';
        funcs[i][j] = checkValidAsync.bind(null, id, i, j)();
      }
    }
};


const solvePuzzle = (currentMaze, currentBoard) => {
  // if no id, width and height provided, we can't proceed
  if (currentMaze === undefined || currentBoard === undefined) {
    throw new Error('please enter a valid maze and board');
  }

  const id = currentMaze.id;
  const lastColumn = currentMaze.width - 1;
  const lastRow = currentMaze.height - 1;

  // Solution
  var path = [];
  // memoize positions which have already been checked to be
  // valid or invalid
  var memo = {};

  // Return a path if solution is found
  if (findPath(id, currentBoard, lastColumn, lastRow, path, memo)) {
    return path;
  }
  // Return empty array if no solution found
  return [];

  // Inner helper function to find path
  function findPath(id, board, col, row, path, memo) {
    if (row < 0 || col < 0 || row > lastRow || col > lastColumn || (board[row][col] === 0)) {
      return false;
    }

    // Strinify the current point so we can use it as the key
    // for our hash table
    var point = `{x: ${row}, y: ${col}}`;
    if (memo[point] !== undefined) {
      return memo[point];
    }

    // Check if there exists a path from the start (0, 0) to
    // the current point (col, row). We do this by working backwards
    // from the max x-value (width - 1) and max y-value (height - 1)
    // of the maze, and find a path to all of it's adjacent cells.
    // I make the assumption that we can only move right, up or
    // diagonal up (right + up)
    var pathExists = false;
    // findPath(id, board, col - 1, row - 1, path, memo)
    // If we are at the origin, we know that the path exists
    var atOrigin = row === 0 && col === 0;
    // Check all adjacent points, working backwards
    if (atOrigin || findPath(id, board, col, row - 1, path, memo) || findPath(id, board, col - 1, row, path, memo)) {
      path.push({x: row, y: col});
      pathExists = true;
    }
    memo[point] = pathExists;
    return pathExists;
  }
}

module.exports = (app) => {
  // Get current maze via Krypton API and build up board based
  // on current maze w x h dimensions
  app.get('/getmaze', (req, res) => {
    axios.post(`${baseURL}/maze`)
      .then((maze) => {
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
    currentPath = solvePuzzle(currentMaze, currentBoard);
    res.status(200).send({'Path to end of maze': currentPath, 'Current board': currentBoard});
  });

  // Submit maze to the Krypton API
  app.get('/submitmaze', (req, res) => {
    var id = currentMaze.id;
    console.log(currentMaze, currentPath);
    console.log(currentBoard);
    axios.post(`${baseURL}/maze/${id}/solve`, currentPath)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          res.status(200).send(response);
        }
      })
      .catch((error) => {
        res.status(500).send(error);
        throw new Error(error.stack);
      });
  });

  // TEMP for testing
  app.get('/testing', (req, res) => {
    res.status(200).send({'Current board': currentBoard, 'Current maze': currentMaze});
  });

};
