import React from 'react';
import styles from './CommentList.module.css';

const CommentList = ({ comments, hasNextPage, fetchNextPage }) => {
  if (!comments?.length) {
    return (
      <div className={styles.noComments}>
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className={styles.commentsList}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.commentItem}>
          <div className={styles.commentAuthor}>
          <img
  src={comment.author_image || '/default-profile.png'}
  alt={comment.author}
  className={styles.commentAuthorImage}
/>
          </div>
          <div className={styles.commentContent}>
            <div className={styles.commentHeader}>
              <span className={styles.authorName}>{comment.author}</span>
              <span className={styles.commentDate}>
                {new Date(comment.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className={styles.commentText}>{comment.content}</p>
          </div>
        </div>
      ))}
      
      {hasNextPage && (
        <button 
          className={styles.loadMoreButton}
          onClick={() => fetchNextPage()}
        >
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default CommentList;