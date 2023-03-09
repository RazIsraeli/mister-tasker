# mister-tasker
Backend + Frontend task management app, created with Vue.js and microservices

## Running the app:
1. Production: use this link: mister-tasker-production.up.railway.app
2. To run locally:
  2.1 open the backend folder with vscode and run "npm start" (should run the server on port 3030).
  2.2 open the frontend folder with vscode and run "npm start" (should create the app in port 5173).

## App Description
A task management app where the user can manage their tasks.
The app requires login (it is possible to sign up in the first time).
There are restrictions about editing/deleting tasks that were created by other users.

There is a micro service that is separated from the main server, which was created to run automatically upon user's decision and try to close tasks automatically.
The microservice will try to resolve the task up to 3 times, and in case of 3 consecutive failures will stop trying.

On the top left corner of the screen there is a button where the user can click to start/stop the microservice.

## Tech Stack
Vue.js,
Node.js,
Express,
HTML,
CSS,
