
require("dotenv").config();
const express = require("express");
const { connectToDatabase } = require("./db/database-connection");
const cors = require('cors')
require('express-async-errors')

const todosRouter = require("./todos/todos.router");

async function main() {
    await connectToDatabase();
  
    const app = express();
  
    app.use(express.json());
    app.use(cors());
  
    app.get("/", function (req, res) {
      res.send("Hello World");
    });
  
    app.use("/todos", todosRouter);
  
    app.use(function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send({ error: 'Algo deu errado!' });
    });
  
    // Endpoint catch-all
    app.use('*', (req, res) => {
      res.status(404).send({ error: 'Endpoint não encontrado' });
    });
  
    app.listen(3000, function () {
      console.log("Servidor rodando em http://localhost:3000");
    });
  }
  
  main();
  