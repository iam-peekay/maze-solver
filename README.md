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
- __Step 1:__ Click on ```Get the next maze``` button to fetch maze
- __Step 2:__ Click on ```Solve the maze``` button to solve maze. A spinner will begin. Once the maze is solved, the solution path will appear. Now move to step 3
- __Step 3:__ Click on ```Submit this solution``` button to submit the current solution path
- __Step 4:__ Repeat!

__Option 2: Use Postman or a similar REST client__
- __Step 1:__ GET ```http://localhost:3000/api/getmaze``` to fetch maze
- __Step 2:__ GET ```http://localhost:3000/api/solvemaze``` to solve the current maze (once the maze is solved, the response body will contain the solution path)
- __Step 3:__ GET ```http://localhost:3000/api/submitmaze``` to submit the current solution. Returns 200 response if the solution is valid!
- __Step 4:__ Repeat!
