import React, { useState, useEffect, useCallback } from 'react';
import { User, Calendar, Star, MessageSquare, Tag, Lock } from 'lucide-react';
import styles from './PostItem.module.css';
import { useComments } from '../Comments/hooks/useComments';
import { useRatings } from '../Ratings/hooks/useRatings';
import { useAuth } from '../Accounts/hooks/useAuth';
import { throttle } from 'lodash';
import showToast from '../../utils/toast';

const PostItem = React.memo(({ post, isAuthenticated, approvePost, openDisapproveModal }) => {
  const { roles } = useAuth();
  const isStaffOrAdmin = roles.includes('admin') || roles.includes('staff');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [localRating, setLocalRating] = useState(post.initialRating || 3);

  // Enhanced rating integration
  const { 
    rating, 
    ratePost, 
    isLoading: isRatingLoading,
    cleanup 
  } = useRatings(isAuthenticated ? post.id : null);

  // Existing comments functionality
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    addComment,
  } = useComments(
    isAuthenticated && showComments ? post.id : null,
    isAuthenticated && showComments
  );

  // Update localRating when the fetched rating changes
  useEffect(() => {
    if (rating) {
      setLocalRating(rating.value);
    } else {
      setLocalRating(3);
    }
  }, [rating]);

  // Optimized rating handler with debounce
  const debouncedRatePost = useCallback(
    throttle((value) => {
      if (isAuthenticated && !isRatingLoading) {
        ratePost(value);
      }
    }, 500, { leading: true, trailing: true }),
    [ratePost, isAuthenticated, isRatingLoading]
  );

  // Enhanced rating change handler
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (cleanup) cleanup();
    };
  }, [cleanup]);
  
  const handleRatingChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 1 && value <= 5 && isAuthenticated) {
      setLocalRating(value);
      debouncedRatePost(value);
    } else if (!isAuthenticated) {
      showToast('You must be signed in to rate posts.', 'warning');
    }
  };

  // Existing comment handlers
  const handleAddComment = () => {
    if (newComment.trim() && isAuthenticated) {
      addComment({ content: newComment });
      setNewComment('');
      showToast('Comment added successfully!', 'success');
    } else if (!isAuthenticated) {
      showToast('You must be signed in to comment.', 'warning');
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <article className={styles.postItem}>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className={styles.postImage}
        />
      )}
      <div className={styles.postContent}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        {isAuthenticated ? (
          <>
            <p className={styles.postExcerpt}>{post.content}</p>
            <div className={styles.postMeta}>
              <span>
                <User size={16} /> {post.author}
              </span>
              <span>
                <Calendar size={16} />{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className={`${styles.ratingSection} ${isRatingLoading ? styles.ratingLoading : ''}`}>
                <Star size={16} />
                <span className={styles.ratingValue}>
                  {rating ? rating.value.toFixed(1) : 'N/A'}
                </span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={localRating}
                  onChange={handleRatingChange}
                  className={`${styles.ratingSlider} ${isRatingLoading ? styles.ratingDisabled : ''}`}
                  disabled={isRatingLoading}
                  aria-label="Rate this post"
                />
              </span>
              <span onClick={handleToggleComments} className={styles.commentToggle}>
                <MessageSquare size={16} /> {comments?.length || 0}
              </span>
            </div>

            {showComments && (
              <div className={styles.commentsSection}>
                <h3>Comments</h3>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <p>{comment.content}</p>
                      <small>
                        {comment.author} -{' '}
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
                <div className={styles.addComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={styles.commentInput}
                    aria-label="Add a comment"
                  />
                  <button onClick={handleAddComment} className={styles.postCommentButton}>
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className={styles.tagsSection}>
                {post.tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    <Tag size={16} /> {tag.tagged_user}
                  </span>
                ))}
              </div>
            )}

            {isStaffOrAdmin && (
              <div className={styles.adminActions}>
                <button onClick={() => approvePost(post.id)} className={styles.approveButton}>
                  Approve
                </button>
                <button onClick={() => openDisapproveModal(post)} className={styles.disapproveButton}>
                  Disapprove
                </button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.lockedContent}>
            <Lock size={24} />
            <p>Sign in to view full content, rate, comment, and see tags.</p>
          </div>
        )}
      </div>
    </article>
  );
});

export default PostItem;