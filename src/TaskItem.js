import React, { useRef, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import icon from "./assets/icon.png";
import "./TaskItem.css"; // Import the CSS file for TaskItem

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
}) => {
  const [editingText, setEditingText] = useState(todo.text);
  const [showCommentBox, setShowCommentBox] = useState(false);
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
    setEditingText(todo.text);
    setIsEditing(true);
  };

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  return (
    <>
      <li
        ref={(node) => ref(drop(node))}
        className="todo-item"
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onClick={toggleCommentBox}
      >
        <div className="todo-content">
          <img src={icon} alt="icon" className="Move-icon" />
          <div className="todo-checkbox">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodoCompletion(index)}
            />
            <div className="custom-checkbox"></div>
          </div>
          {isCurrentEditing ? (
            <input
              type="text"
              value={editingText}
              onChange={(e) => {
                setEditingText(e.target.value);
                todo.text = e.target.value;
              }}
              className="edit-input"
              ref={inputRef}
            />
          ) : (
            <div
              className={`todo-text ${todo.completed ? "completed" : ""}`}
              onClick={startEditing}
            >
              {todo.text}
            </div>
          )}
        </div>
        {isCurrentEditing && (
          <div className="todo-actions">
            <button
              className="remove-title"
              onClick={() => removeTodo(index)}
            ></button>
          </div>
        )}
      </li>
      {showCommentBox && (
        <div className="comment-box">
          <div className="comment-content">
            <textarea placeholder="Write a comment here..."></textarea>
            <button onClick={toggleCommentBox}>Comment</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskItem;
