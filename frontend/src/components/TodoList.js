// src/components/TodoList.js

import React, { useState, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../css/TodoList.css";
import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import "../css/Modal.css";
import deleteSound from "../assets/audio/delete_sound.mp3";
import clickSound from "../assets/audio/click-som.mp3";
import addSound from "../assets/audio/add-som.mp3";
import { API_URL, buildApiGetRequest, buildApiPostRequest, buildApiPutRequest, buildApiDeleteRequest } from "../api/api";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Booking Movie Tickets");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const [showModal, setShowModal] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(null);

  const audioDeleteRef = useRef(new Audio(deleteSound));
  const audioClickRef = useRef(new Audio(clickSound));
  const audioAddRef = useRef(new Audio(addSound));

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await buildApiGetRequest(API_URL);
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (newTodo) => {
    const newTask = { titulo: newTodo, status: 'pendente' };
    audioAddRef.current.play();

    try {
      await buildApiPostRequest(API_URL, newTask);
      // Atualiza a lista de tarefas após adicionar uma nova
      const updatedTodos = await buildApiGetRequest(API_URL);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
      alert('Houve um erro ao adicionar a tarefa. Por favor, tente novamente.');
    }
  };

  const removeTodo = async (index) => {
    const todoId = todos[index]._id;
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
    setEditingIndex(null);
    setIsEditing(false);
    audioDeleteRef.current.play();

    try {
      await buildApiDeleteRequest(`${API_URL}/${todoId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const saveTitleEdit = () => {
    setTitle(editingTitle);
    setIsEditingTitle(false);
  };

  const moveTodo = async (dragIndex, hoverIndex) => {
    const updatedTodos = [...todos];
    const [draggedTodo] = updatedTodos.splice(dragIndex, 1);
    updatedTodos.splice(hoverIndex, 0, draggedTodo);
    setTodos(updatedTodos);

    try {
      await buildApiPostRequest(`${API_URL}/reorder`, updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  const saveEdit = async (index, newText) => {
    const todoId = todos[index]._id;
    const updatedTodo = { ...todos[index], titulo: newText };
    setTodos((prevTodos) => prevTodos.map((todo, i) => (i === index ? updatedTodo : todo)));
    setEditingIndex(null);
    setIsEditing(false);
    audioAddRef.current.play();

    try {
      await buildApiPutRequest(`${API_URL}/${todoId}`, updatedTodo);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTodoCompletion = async (index) => {
    const todoId = todos[index]._id;
    const updatedTodo = { ...todos[index], status: todos[index].status === 'pendente' ? 'concluída' : 'pendente' };
    setTodos((prevTodos) => prevTodos.map((todo, i) => (i === index ? updatedTodo : todo)));
    audioClickRef.current.play();

    try {
      await buildApiPutRequest(`${API_URL}/${todoId}`, updatedTodo);
    } catch (error) {
      console.error(error);
    }
  };

  const startEditingFirstTask = () => {
    if (todos.length > 0) {
      setEditingIndex(0);
      setIsEditing(true);
    }
  };

  const openModal = (index) => {
    setIndexToRemove(index);
    setShowModal(true);
  };

  const confirmRemove = () => {
    if (indexToRemove !== null) {
      removeTodo(indexToRemove);
      setShowModal(false);
    }
  };

  const cancelRemove = (event) => {
    if (event.target.className === "modal-overlay") {
      setIndexToRemove(null);
      setShowModal(false);
    }
  };

  const addReminder = (index) => {
    alert(`Reminder added for task: ${todos[index].titulo}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="todo-container">
        <header className="todo-header">
          {isEditing && <div className="editing-indicator">Editing...</div>}
          {isEditingTitle ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={saveTitleEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveTitleEdit();
                }
              }}
              className="edit-title-input"
              autoFocus
            />
          ) : (
            <h1 className="todo-title" onClick={() => setIsEditingTitle(true)}>
              {title}
            </h1>
          )}

          <div className="controls-tasks">
            <p className="edit-title" onClick={startEditingFirstTask}>
              Tasks
            </p>
          </div>
          <div className="controls-edit">
            <p className="tasks-title" onClick={startEditingFirstTask}>
              Edit
            </p>
          </div>

          {editingIndex !== null && (
            <div className="controls-remove">
              <p
                className="remove"
                onClick={() => {
                  if (editingIndex !== null) {
                    openModal(editingIndex);
                  }
                }}
              >
                Remove
              </p>
            </div>
          )}
        </header>

        <ul className="todo-list">
          {todos.map((todo, index) => (
            <TaskItem
              key={index}
              index={index}
              todo={todo}
              editingIndex={editingIndex}
              setEditingIndex={setEditingIndex}
              setIsEditing={setIsEditing}
              moveTodo={moveTodo}
              toggleTodoCompletion={toggleTodoCompletion}
              saveEdit={saveEdit}
              removeTodo={removeTodo}
              addReminder={addReminder}
            />
          ))}
        </ul>

        <TaskForm onAdd={addTodo} />
        {isEditing && (
          <button
            className="save-button"
            onClick={() => saveEdit(editingIndex, todos[editingIndex].titulo)}
          >
            Save
          </button>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={cancelRemove}>
            <div className="modal-content">
              <div className="modal-title">Are you sure you want to remove this?</div>
              <div className="modal-actions">
                <button className="close-button" onClick={confirmRemove}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TodoList;
