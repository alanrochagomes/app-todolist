import React, { useRef, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit, faCalendar, faComment } from "@fortawesome/free-solid-svg-icons";
import "../css/TaskItem.css";
import TaskDetails from "../components/comment/CommentList";
import moveIcon from "../assets/img/move-icon.png";
import { buildApiDeleteRequest, API_URL } from "../api/api"; // Ajuste o caminho conforme necessário

const ItemType = "TODO";

const TaskItem = ({
  todo,
  index,
  editingIndex,
  setEditingIndex,
  setIsEditing,
  removeTodo,
  moveTodo,
  toggleTodoCompletion,
  saveEdit
}) => {
  const [editingText, setEditingText] = useState(todo.titulo);
  const [showDetails, setShowDetails] = useState(false);

  const isCurrentEditing = editingIndex === index;
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    canDrag: !isCurrentEditing,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveTodo(item.index, index);
        item.index = index;
      }
    },
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (isCurrentEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCurrentEditing]);

  const startEditing = () => {
    setEditingIndex(index);
    setEditingText(todo.titulo);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingText.trim()) {
      saveEdit(index, editingText);
      setEditingIndex(null);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await buildApiDeleteRequest(`${API_URL}/${todo._id}`);
      removeTodo(index);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <li
        ref={(node) => ref(drop(node))}
        className={`todo-item ${isDragging ? "dragging" : ""}`}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div className="todo-content">
          <img src={moveIcon} alt="Move Icon" className="move-icon" />
          <div className="todo-checkbox">
            <input
              type="checkbox"
              checked={todo.status === 'concluída'}
              onChange={() => toggleTodoCompletion(index)}
            />
            <div className="custom-checkbox"></div>
          </div>

          {isCurrentEditing ? (
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="edit-input"
              ref={inputRef}
            />
          ) : (
            <div
              className={`todo-text ${todo.status === 'concluída' ? "completed" : ""}`}
              onClick={startEditing}
            >
              {todo.titulo}
            </div>
          )}

          {isCurrentEditing ? (
            <button onClick={handleSaveEdit} className="save-button">Save</button>
          ) : (
            <div className="todo-actions">
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="remove-icon"
                onClick={handleDelete}
              />
              <FontAwesomeIcon
                icon={faEdit}
                className="edit-icon"
                onClick={startEditing}
              />
            </div>
          )}
        </div>
      </li>
      {showDetails && <TaskDetails task={todo} onClose={() => setShowDetails(false)} />}
    </>
  );
};

export default TaskItem;
