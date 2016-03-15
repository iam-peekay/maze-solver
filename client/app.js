const getMaze = document.getElementById('getMaze');
const solveMaze = document.getElementById('solveMaze');
const submitSolution = document.getElementById('submitSolution');
const currentMaze = document.getElementById('currentMaze');
const solvedMaze = document.getElementById('solvedMaze');
const submitMaze = document.getElementById('submitMaze');
var spinner = '<div id="spinner-div" class="box box--foo"><p>Solving puzzle…</p><p><span class="spinner">Loading…</span></p></div>'

getMaze.addEventListener('click', handleGetMaze);
solveMaze.addEventListener('click', handleSolvetMaze);
submitSolution.addEventListener('click', handleSubmitSolution);

function handleGetMaze() {
  currentMaze.innerHTML = '';
  solvedMaze.innerHTML = '';
  submitMaze.innerHTML = '';

  axios('/api/getMaze')
  .then((response) => {
    currentMaze.insertAdjacentHTML('afterbegin', `<pre><b>Height:</b> ${response.data.height} \n<b>Width:</b> ${response.data.width} \n<b>ID:</b> ${response.data.id}
     </pre>`);
  })
  .catch((response) => {
    console.log(response);
  });
}

function handleSolvetMaze() {
  startSpinner();
  axios('/api/solvemaze')
  .then((response) => {
    stopSpinner();
    var output = '';
    if (response.data.path === []) {
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
  });
}


function handleSubmitSolution() {
  axios('/api/submitmaze')
  .then((response) => {
    submitMaze.insertAdjacentHTML('afterbegin', `<pre><b>Response:</b> ${response.data.data} </pre>`);
  })
  .catch((response) => {
    console.log('Error: ', response);
  });
}

function startSpinner() {
  solvedMaze.insertAdjacentHTML('afterbegin', spinner);
}

function stopSpinner() {
  var spinner = document.getElementById('spinner-div');
  solvedMaze.removeChild(spinner);
}
