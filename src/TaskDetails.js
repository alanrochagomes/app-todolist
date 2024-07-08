import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faComment } from "@fortawesome/free-solid-svg-icons";
import "./TaskDetails.css";

const TaskDetails = ({ task, onClose }) => {
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState("");
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const commentWithUser = {
        user: "Jordan", // Altere para o nome do usuário correto
        text: newComment,
      };
      const updatedComments = [...comments, commentWithUser];
      setComments(updatedComments);
      task.comments = updatedComments; // Atualiza a task original
      setNewComment("");
      setIsCommentBoxVisible(false); // Fecha a caixa de comentário após salvar
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleToggleCommentBox = () => {
    setIsCommentBoxVisible(!isCommentBoxVisible);
  };

  return (
    <div className="task-details">
      <div className="task-details-header">
        <div className="task-details-header-content">
          <h3>{task.title}</h3>
        </div>
        <div className="task-details-icons">
          <FontAwesomeIcon
            icon={faComment}
            className="task-details-icon"
            onClick={handleToggleCommentBox}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className="task-details-icon"
            onClick={onClose}
          />
        </div>
      </div>
      <div className="task-details-content">
        <p>{task.description}</p>
        <button className="add-reminder">Add reminder</button>
      </div>

      {isCommentBoxVisible && (
        <div className="comment-box">
          <div className="comment-content">
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Write a comment here..."
            />
            <button onClick={handleAddComment}>Comment</button>
          </div>
        </div>
      )}

      {comments.length > 0 && (
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-user">
                <span className="user-icon">J</span> {/* Ícone do usuário */}
                <span className="user-name">{comment.user}</span>
              </div>
              <div className="comment-text">{comment.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
