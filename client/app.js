const getMaze = document.getElementById('getMaze');
const solveMaze = document.getElementById('solveMaze');
const submitSolution = document.getElementById('submitSolution');
const currentMaze = document.getElementById('currentMaze');
const solvedMaze = document.getElementById('solvedMaze');
const submitMaze = document.getElementById('submitMaze');
// Spinner for when maze is being solved
var spinner = '<div id="spinner-div" class="box box--foo"><p>Solving puzzle…</p><p><span class="spinner">Loading…</span></p></div>'

getMaze.addEventListener('click', handleGetMaze);
solveMaze.addEventListener('click', handleSolvetMaze);
submitSolution.addEventListener('click', handleSubmitSolution);

function handleGetMaze() {
  // Clear previous maze
  currentMaze.innerHTML = '';
  solvedMaze.innerHTML = '';
  submitMaze.innerHTML = '';

  // Hit our API endpoint to get a new maze. Upon response,
  // display the maze details
  axios('/api/getMaze')
  .then((response) => {
    currentMaze.insertAdjacentHTML('afterbegin', `<pre><b>Height:</b> ${response.data.height} \n<b>Width:</b> ${response.data.width} \n<b>ID:</b> ${response.data.id}
     </pre>`);
  })
  .catch((response) => {
    console.log(response);
    currentMaze.insertAdjacentHTML('afterbegin', `<pre>An error occured. Please try again.</pre>`);
  });
}

function handleSolvetMaze() {
  // Start the spinner to indicate to user that maze is being solved
  startSpinner();
  // Hit our API endpoint to begin solving maze. Upon response,
  // display the solution path
  axios('/api/solvemaze')
  .then((response) => {
    stopSpinner();
    var output = '';
    if (response.data.path.length === 0) {
      output = 'No solution found.'
    } else {
      response.data.path.forEach((item) => {
        output += 'x: ' + item.x +', y: ' + item.y + '\n';
      });
    }
    solvedMaze.insertAdjacentHTML('afterbegin', `<pre><b>Path:</b> \n${output} </pre>`);
  })
  .catch((response) => {
    console.log('Error: ', response);
    solvedMaze.insertAdjacentHTML('afterbegin', `<pre><b>An error occured. Please try again.</b> \n${output} </pre>`);
  });
}

// Hit our API endpoint to submit our current solution
// to Krypton. Upon response, display whether we got the
// correct answer or not!
function handleSubmitSolution() {
  axios('/api/submitmaze')
  .then((response) => {
    submitMaze.insertAdjacentHTML('afterbegin', `<pre><b>Response:</b> ${response.data.data} </pre>`);
  })
  .catch((response) => {
    console.log('Error: ', response);
    submitMaze.insertAdjacentHTML('afterbegin', `<pre><b>Response:</b> ${response.data.data} </pre>`);
  });
}

function startSpinner() {
  solvedMaze.insertAdjacentHTML('afterbegin', spinner);
}

function stopSpinner() {
  var spinner = document.getElementById('spinner-div');
  solvedMaze.removeChild(spinner);
}
