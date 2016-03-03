const axios = require('axios');
const baseURL =  'http://ec2-52-32-160-115.us-west-2.compute.amazonaws.com:9099';
var currentBoard = [];
var count = 0;

const checkValidAsync = (id, xPosition, yPosition) => {
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

function testing(id, i, j) {
  axios.get(`${baseURL}/maze/${id}/check?x=${i}&y=${j}`)
    .then(function(response) {
      currentBoard[i][j] = true;
    })
    .catch(function (error) {
      currentBoard[i][j] = false;
    });
}

const makeBoard = (id, width, height, board) => {
  var funcs = [];
    for (var i = 0; i < height; i++) {
      funcs.push([]);
      board.push([]);
      for (var j = 0; j < width; j++) {
        funcs[i][j] = testing.bind(null, id, i, j)();
      }
    }
};

makeBoard('aeffca45ed4ceb6e766f3f57a5e97aa74df0c976ebaef7ed7', 14, 14, currentBoard);

const solvePuzzle = (id, height, width) => {
  // if no id, width and height provided, we can't proceed
  if (id === null || height === null || width === null) {
    throw new Error('please enter a maze id');
  }

  var path = [];
  var lastRow = height - 1;
  var lastCol = width - 1;
  // memoize positions which have already been checked to be
  // valid or invalid
  var memo = {};

  // Helper function to find path
  function findPath(id, lastRow, lastCol, currentRow, currentCol, path, memo) {
    if (currentCol > lastCol || currentRow > lastRow || currentRow < 0 || currentCol < 0) {
      return false;
    }

    var atOrigin = currentRow === 0 && currentCol === 0;
    var pathExists = false;
    var key = `{x: ${currentCol}, y: ${currentRow}}`;

    if (memo[key] !== undefined) {
        if (atOrigin || findPath(id, lastRow, lastCol, currentRow + 1, currentCol, path, memo) || findPath(id, lastRow, lastCol, currentRow, currentCol + 1, path, memo) || findPath(id, lastRow, lastCol, currentRow + 1, currentCol + 1, path, memo)) {

        }
    } else {
    }
  }


  if (findPath(id, lastRow, lastCol, path, memo)) {
    return path;
  }
  // empty array if no solution found
  return [];
}



module.exports = (app) => {
  // Get Maze
  app.get('/getmaze', (req, res) => {
    axios.post(`${baseURL}/maze`)
      .then(function(maze) {
        console.log(maze.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  app.get('/solvemaze', (req, res) => {
    var id = req.body.id;
    var height = req.body.height;
    var width = req.body.width;

  });

  app.get('/submitmaze', (req, res) => {
    res.send('Submit maze')
  });

  app.get('/testing', (req, res) => {
    res.send(currentBoard);
  });

};
