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

const API_URL = ""; 

const getTodos = async () => {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error("Erro ao buscar tarefas");
  }
  return await response.json();
};

const apiAddTodo = async (newTodo) => {
  const response = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: newTodo, completed: false }),
  });
  if (!response.ok) {
    throw new Error("Erro ao adicionar tarefa");
  }
  return await response.json();
};

const apiRemoveTodo = async (id) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Erro ao remover tarefa");
  }
  return await response.json();
};

const apiUpdateTodo = async (id, updatedTodo) => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  if (!response.ok) {
    throw new Error("Erro ao atualizar tarefa");
  }
  return await response.json();
};

const apiReorderTodos = async (todos) => {
  const response = await fetch(`${API_URL}/todos/reorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todos),
  });
  if (!response.ok) {
    throw new Error("Erro ao reordenar tarefas");
  }
  return await response.json();
};

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "Set a reminder beforehand", completed: false },
    { id: 2, text: "Find a location", completed: false },
    { id: 3, text: "Screenshot the address", completed: false },
    { id: 4, text: "Book the tickets", completed: false },
    { id: 5, text: "Find out the parking", completed: false },
    { id: 6, text: "Call them", completed: false },
  ]);

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
    // getTodos().then(setTodos).catch((error) => console.error(error));
  }, []);

  const addTodo = (newTodo) => {
    // Adiciona a nova tarefa na lista localmente
    const newTask = { id: Date.now(), text: newTodo, completed: false };
    setTodos((prevTodos) => [...prevTodos, newTask]);
    audioAddRef.current.play();

    // Chama a API para adicionar a tarefa
    apiAddTodo(newTodo).catch((error) => console.error(error));
  };

  const removeTodo = (index) => {
    const todoId = todos[index].id;
    setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
    setEditingIndex(null);
    setIsEditing(false);
    audioDeleteRef.current.play();

    // Chama a API para remover a tarefa
    apiRemoveTodo(todoId).catch((error) => console.error(error));
  };

  const saveTitleEdit = () => {
    setTitle(editingTitle);
    setIsEditingTitle(false);
  };

  const moveTodo = (dragIndex, hoverIndex) => {
    const updatedTodos = [...todos];
    const [draggedTodo] = updatedTodos.splice(dragIndex, 1);
    updatedTodos.splice(hoverIndex, 0, draggedTodo);
    setTodos(updatedTodos);

    // Chama a API para reordenar as tarefas
    apiReorderTodos(updatedTodos).catch((error) => console.error(error));
  };

  const saveEdit = (index, newText) => {
    const todoId = todos[index].id;
    const updatedTodo = { ...todos[index], text: newText };
    setTodos((prevTodos) => prevTodos.map((todo, i) => (i === index ? updatedTodo : todo)));
    setEditingIndex(null);
    setIsEditing(false);
    audioAddRef.current.play();

    // Chama a API para atualizar a tarefa
    apiUpdateTodo(todoId, updatedTodo).catch((error) => console.error(error));
  };

  const toggleTodoCompletion = (index) => {
    const todoId = todos[index].id;
    const updatedTodo = { ...todos[index], completed: !todos[index].completed };
    setTodos((prevTodos) => prevTodos.map((todo, i) => (i === index ? updatedTodo : todo)));
    audioClickRef.current.play();

    // Chama a API para atualizar a tarefa
    apiUpdateTodo(todoId, updatedTodo).catch((error) => console.error(error));
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
    alert(`Reminder added for task: ${todos[index].text}`);
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
            onClick={() => saveEdit(editingIndex, todos[editingIndex].text)}
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
