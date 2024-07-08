import React, { useState } from "react";
import "./TaskDetails.css";

const TaskDetails = ({ task, onClose }) => {
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [editComment, setEditComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [reminderText, setReminderText] = useState(
    "Use your phone or something else. But don’t forget."
  );
  const [isEditingReminder, setIsEditingReminder] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  const handleEditComment = (index) => {
    setEditIndex(index);
    setEditComment(comments[index]);
  };

  const handleUpdateComment = () => {
    if (editComment.trim()) {
      const updatedComments = comments.map((comment, index) =>
        index === editIndex ? editComment : comment
      );
      setComments(updatedComments);
      setEditIndex(-1);
      setEditComment("");
    }
  };

  const handleCommentChange = (event) => {
    if (editIndex === -1) {
      setNewComment(event.target.value);
    } else {
      setEditComment(event.target.value);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    setIsEditingReminder(!isEditingReminder);
  };

  const handleReminderChange = (event) => {
    setReminderText(event.target.value);
  };

  return (
    <div className="task-details">
      <div className="task-details-header">
        <div className="task-details-header-content">
          <h3>{task.title}</h3>
        </div>
        <div className="task-details-close" onClick={onClose}>
          &times;
        </div>
      </div>
      <div className="task-details-content">
        {isEditingReminder ? (
          <input
            type="text"
            value={reminderText}
            onChange={handleReminderChange}
            onBlur={() => setIsEditingReminder(false)}
          />
        ) : (
          <p>{reminderText}</p>
        )}
        <button className="task-details-button">Add reminder</button>
        <div className="task-details-icon" onClick={toggleComments} />
      </div>
    </div>
  );
};

export default TaskDetails;
