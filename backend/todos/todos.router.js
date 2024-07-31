const express = require('express');
const router = express.Router();

// Simula uma base de dados
let todos = [
  { _id: '1', titulo: 'Primeira tarefa', status: 'pendente' },
  { _id: '2', titulo: 'Segunda tarefa', status: 'concluída' },
];

// GET /todos
router.get('/', (req, res) => {
  res.json(todos);
});

// POST /todos
router.post('/', (req, res) => {
  const newTodo = { _id: Date.now().toString(), ...req.body };
  todos.push(newTodo);
  res.json(newTodo);
});

// PUT /todos/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedTodo = req.body;
  todos = todos.map(todo => (todo._id === id ? updatedTodo : todo));
  res.json(updatedTodo);
});

// DELETE /todos/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo._id !== id);
  res.status(204).end();
});

module.exports = router;
