const axios = require('axios');
const request = require('sync-request');
const baseURL =  'http://ec2-52-32-160-115.us-west-2.compute.amazonaws.com:9099';
// These variables represent the current state of the maze
// var currentBoard = [];
var currentMaze;
var currentPath;

const solvePuzzle = (currentMaze) => {
  // if no id, width and height provided, we can't proceed
  if (currentMaze === undefined) {
    throw new Error('please enter a valid maze and board');
  }

  const id = currentMaze.id;
  const lastColumn = currentMaze.width - 1;
  const lastRow = currentMaze.height - 1;

  // Solution
  var path = [];
  // Memoize positions which have already been checked as being
  // valid or invalid
  var memo = {};
  // Return a path if solution is found
  if (findPath(id, lastColumn, lastRow, path, memo)) {
    return path;
  }
  // Return empty array if no solution found
  return [];

  // Inner helper function to find path
  function findPath(id, col, row, path, memo) {
    // If we are out of bounds, return immediately to save us
    // the extra API call
    if (row < 0 || col < 0) {
      return false;
    }

    // Check if the current position is valid
    var res = request('GET', `${baseURL}/maze/${id}/check?x=${row}&y=${col}`);
    // Since some of the responses are returning internal server
    // error, let's check for this and re-run the request if we
    // get internal server error
    while(res.statusCode > 500) {
      res = request('GET', `${baseURL}/maze/${id}/check?x=${row}&y=${col}`);
    }

    // If invalid position, return false.
    if (res.statusCode === 403) {
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
    // We can only move right or up
    var pathExists = false;
    // If we are at the origin, we know that the path exists
    var atOrigin = row === 0 && col === 0;
    // Check all adjacent points down and left (working backwards)
    if (atOrigin || findPath(id, col, row - 1, path, memo) || findPath(id, col - 1, row, path, memo)) {
      path.push({x: row, y: col});
      pathExists = true;
    }
    // Mark point with either path existing or not existing
    memo[point] = pathExists;
    return pathExists;
  }
}

module.exports = (app) => {
  // Get current maze via Krypton API
  app.get('/getmaze', (req, res) => {
    axios.post(`${baseURL}/maze`)
      .then((maze) => {
        currentMaze = maze.data;
        res.status(200).send(currentMaze);
      })
      .catch(function (error) {
        throw new Error(error.stack);
      });
  });

  // Solve current maze and send path solution as response
  app.get('/solvemaze', (req, res) => {
    currentPath = solvePuzzle(currentMaze);
    res.status(200).send({'Path to end of maze': currentPath});
  });

  // Submit the solved maze to the Krypton API
  app.get('/submitmaze', (req, res) => {
    var id = currentMaze.id;
    console.log('Current maze:', currentMaze);
    console.log('Current path: ', currentPath);
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
}


/* ==============================================================
   BELOW ARE ONLY USEFUL IF WE WANT TO BUILD UP THE BOARD FIRST
   AND THEN SOLVE THE MAZE. IGNORE.
   ==============================================================
*/
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
          board[i][j] = -1;
          funcs[i][j] = checkValidAsync.bind(null, id, i, j)();
        }
      }
  };

  const makeBoardSync = (id, height, width, board) => {
      for (var i = 0; i < height; i++) {
        board.push([]);
        for (var j = 0; j < width; j++) {
          board[i][j] = -1;
          var res = request('GET', `${baseURL}/maze/${id}/check?x=${i}&y=${j}`);
          while(res.statusCode > 500) {
            res = request('GET', `${baseURL}/maze/${id}/check?x=${i}&y=${j}`);
          }
          if (res.statusCode === 200) {
              board[i][j] = 1;
          } else {
            board[i][j] = 0;
          }
        }
      }
      console.log(board);
  };

// Used in "getMaze" api method when we want to build up the
// board first:
// currentBoard = [];
// makeBoardSync(maze.data.id, maze.data.height, maze.data.width, currentBoard);

// Then in "findPath", add this line and remove the synchronous
// calls to API
// if (row < 0 || col < 0 || (board[row][col] === 0)) {
//   return false;
// }
