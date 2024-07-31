const { ObjectId } = require("mongodb");
const { getDatabase } = require("../db/database-connection");

function getCollection() {
  return getDatabase().collection("todos");
}

function readAll() {
  return getCollection().find().toArray();
}

function readById(id) {
  return getCollection().findOne({ _id: new ObjectId(id) });
}

function create(newItem) {
  return getCollection().insertOne(newItem);
}

function updateById(id, newItem) {
  return getCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: newItem }
  );
}

function deleteById(id) {
  return getCollection().deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  readAll,
  readById,
  create,
  updateById,
  deleteById,
};
