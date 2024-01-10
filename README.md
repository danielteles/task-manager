# Task manager

This task manager project was built using Node.js, Angular and PostgreSQL. It provides a user-friendly interface for managing tasks.

## Table of Contents

- [Task manager](#task-manager)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Step by step](#step-by-step)
  - [License](#license)
  - [Stack](#stack)

## Features

- CRUD (Create, Read, Update and Delete) for tasks
- Ordering: Possibility to order tasks based on their completion status.
- Search: Possibility to search for specific tasks using keywords.
- Responsive design: The application is designed to be responsive and optimized for different screen sizes.

## Requirements

Make sure you have the following software installed on your system:

- Node.js
- npm (Node Package Manager)
- PostgreSQL installed and running.

## Step by step

1. Navigate to the task manager folder and run the Makefile to install the project dependencies

  ```
  cd task-manager && make
  ```

2. If you're using VsCode just click the Launch and Debug icon, select **Launch Full Stack** and click on Run.
If you're using another editor, open two tabs on terminal and navigate to the client directory in one tab and to the server directory on the other. Then run ```npm start``` and ```node index.js``` respectively.

3. Open a web browser and visit `http://localhost:4200` to access the application.

## License

This project is licensed under the [MIT License](LICENSE).

## Stack

- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)