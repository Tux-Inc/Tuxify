Welcome to the README of the poc mern stack project !

## Introduction

This project is a web application that allows you to manage your tasks. It is a proof of concept of a MERN stack application. The MERN stack is a JavaScript stack that is used for building modern web applications. MERN stands for MongoDB, Express, React, Node, after the four key technologies that make up the stack.

## Installation

To install the project, you must first clone the repository on your computer. Then, you must install the dependencies of the project. To do this, you must run the following command in the frontend folder and the backend folder of the project:

```bash
cd frontend && yarn install

cd ../backend && yarn install
```

## Usage

First go to Atlas MongoDB and create a new cluster. Then, you must create a .env file in the backend folder and fill in the following information:

```bash
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

Then, you must run the following command in the root folder of the project:

```bash
cd ./backend && yarn app
cd ../frontend && yarn start
```

Finally, you can access the application by going to the following address: http://localhost:3000/

## Contributors

- Alexandre Kévin De Freitas Martins
- Gwenaël Hubler
- Roman Lopes
- Stéphane Fievez
- Bouna Diallo

## License

[MIT](https://choosealicense.com/licenses/mit/)
