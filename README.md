# maze-solver

### To run:
```
git clone https://github.com/iam-peekay/maze-solver.git
cd maze-solver
npm install
npm start
```

### To solve maze:
__OPTION 1: INTERACTIVE FRONT END__
- Visit ```http://localhost:3000```
- Click on ```Get the next maze``` button to fetch maze
- Click on ```Solve the maze``` button to solve maze. A spinner will begin. Once the maze is solved, the solution path will appear
- Click on ```Submit my solution``` button to submit the current solution path!

__OPTION 2: POSTMAN or similar REST Client__
- GET ```http://localhost:3000/api/getmaze``` to fetch maze
- GET ```http://localhost:3000/api/solvemaze``` to solve the current maze (once solve, the response body will contain the path)
- GET ```http://localhost:3000/api/submitmaze``` to submit the current solution. Returns HTTP status code 200 if the solution is valid!
