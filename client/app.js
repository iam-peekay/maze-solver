const getMaze = document.getElementById('getMaze');
const solveMaze = document.getElementById('solveMaze');
const submitSolution = document.getElementById('submitSolution');

getMaze.addEventListener('click', handleGetMaze);

function handleGetMaze() {
  fetch('http://localhost:3000/api/getmaze')
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      console.log('woot');
    })
}
