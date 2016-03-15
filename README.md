# maze-solver

### To run the program:
```
git clone https://github.com/iam-peekay/maze-solver.git
cd maze-solver
npm install
npm start
```

### To solve maze:
__Option 1: Interactive front-end__
- Visit ```http://localhost:3000```
- Click on ```Get the next maze``` button to fetch maze
- Click on ```Solve the maze``` button to solve maze. A spinner will begin. Once the maze is solved, the solution path will appear
- Click on ```Submit my solution``` button to submit the current solution path
- Repeat!

__Option 2: Use Postman or a similar REST client__
- GET ```http://localhost:3000/api/getmaze``` to fetch maze
- GET ```http://localhost:3000/api/solvemaze``` to solve the current maze (once solved, the response body will contain the path)
- GET ```http://localhost:3000/api/submitmaze``` to submit the current solution. Returns 200 response if the solution is valid!
