import React from 'react';
import styles from './CommentList.module.css';

const CommentList = ({ comments }) => {
  return (
    <div className={styles.commentList}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.commentItem}>
          <img
            src={comment.author_image || '/default-profile.png'}
            alt={comment.author}
            className={styles.commentAuthorImage}
          />
          <div>
            <p><strong>{comment.author}</strong></p>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;