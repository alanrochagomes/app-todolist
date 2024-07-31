const Joi = require('joi');

const todos = Joi.object({
    titulo: Joi.string().min(3).max(30).required(),
    descricao: Joi.string().min(3).max(100).required(),
    status: Joi.string().valid('pendente', 'concluida').required(),
    data: Joi.date().optional() // Adicione outros campos conforme necessário
});

module.exports = todos;
