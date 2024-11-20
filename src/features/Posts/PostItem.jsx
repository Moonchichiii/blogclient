import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Calendar,
  Star,
  MessageSquare,
  Lock,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import styles from './PostItem.module.css';
import { useComments } from '../Comments/hooks/useComments';
import { useRatings } from '../Ratings/hooks/useRatings';
import { useAuth } from '../Accounts/hooks/useAuth';
import { throttle } from 'lodash';
import showToast from '../../utils/toast';
import PostModal from './PostModal';

const PostItem = ({
  post,
  onApprove,
  onDisapprove,
  onEdit,
  onDelete,
  showApprovalActions = false,
  isAuthenticated,
  pageContext = 'blog'
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const isOwner = post.is_owner;
  const isAdmin = user?.account?.roles?.is_admin || user?.account?.roles?.is_superuser;
  const isStaff = user?.account?.roles?.is_staff;

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [localRating, setLocalRating] = useState(post.average_rating || 3);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibilityFlags = {
    showEditDelete: (
      (pageContext === 'myPosts' && isOwner) || 
      (pageContext === 'blog' && isOwner) ||
      (isAdmin || isStaff)
    ),
    showApprovalButtons: (
      showApprovalActions && 
      !post.is_approved && 
      (pageContext === 'adminPosts' || (isAdmin || isStaff))
    ),
    showContent: isAuthenticated || pageContext === 'adminPosts',
    showPostStatus: pageContext === 'myPosts' || pageContext === 'adminPosts',
    showInteractions: isAuthenticated && pageContext !== 'adminPosts'
  };

  const PostActions = () => {
    if (!visibilityFlags.showEditDelete && !visibilityFlags.showApprovalButtons) return null;

    return (
      <div className={styles.postActions}>
        {visibilityFlags.showEditDelete && (
          <div className={styles.ownerActions}>
            <button onClick={() => onEdit?.(post)} className={styles.editButton} title="Edit post">
              <Edit size={16} /> Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this post?')) {
                  onDelete?.(post.id);
                }
              }}
              className={styles.deleteButton}
              title="Delete post"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
        {visibilityFlags.showApprovalButtons && (
          <div className={styles.adminActions}>
            <button onClick={() => onApprove?.(post.id)} className={styles.approveButton} title="Approve post">
              <CheckCircle size={16} /> Approve
            </button>
            <button onClick={() => onDisapprove?.(post)} className={styles.disapproveButton} title="Disapprove post">
              <XCircle size={16} /> Disapprove
            </button>
          </div>
        )}
      </div>
    );
  };

  const PostStatus = () => {
    if (!visibilityFlags.showPostStatus) return null;
    
    return post.is_approved ? (
      <div className={`${styles.postStatus} ${styles.approved}`}>
        <CheckCircle size={16} /> Published
      </div>
    ) : (
      <div className={`${styles.postStatus} ${styles.pending}`}>
        <XCircle size={16} /> Pending Approval
      </div>
    );
  };

  const handlePostClick = () => {
    if (visibilityFlags.showContent) {
      setIsModalOpen(true);
    } else {
      showToast('Please login to view the full post.', 'info');
    }
  };

  const { rating, ratePost, isLoading: isRatingLoading, cleanup } = useRatings(
    visibilityFlags.showInteractions ? post.id : null
  );
  
  const { comments = [], fetchNextPage, hasNextPage, addComment } = useComments(
    visibilityFlags.showInteractions && showComments ? post.id : null
  );

  useEffect(() => {
    if (rating) setLocalRating(rating.value);
  }, [rating]);

  const debouncedRatePost = useCallback(
    throttle((value) => {
      if (visibilityFlags.showInteractions && !isRatingLoading) ratePost(value);
    }, 500, { leading: true, trailing: true }),
    [ratePost, visibilityFlags.showInteractions, isRatingLoading]
  );

  useEffect(() => cleanup && cleanup(), [cleanup]);

  const handleRatingChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 1 && value <= 5 && visibilityFlags.showInteractions) {
      setLocalRating(value);
      debouncedRatePost(value);
    } else if (!isAuthenticated) {
      showToast('You must be signed in to rate posts.', 'warning');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && visibilityFlags.showInteractions) {
      addComment({ content: newComment });
      setNewComment('');
      showToast('Comment added successfully!', 'success');
    } else if (!isAuthenticated) {
      showToast('You must be signed in to comment.', 'warning');
    }
  };

  const handleToggleComments = () => setShowComments((prev) => !prev);

  return (
    <article className={styles.postItem}>
      <PostStatus />
      {post.image && <img src={post.image} alt={post.title} className={styles.postImage} />}
      <div className={styles.postContent}>
        <div className={styles.postHeader}>
          <h2 className={styles.postTitle} onClick={handlePostClick}>{post.title}</h2>
          <PostActions />
        </div>

        {visibilityFlags.showContent ? (
          <>
            <p className={styles.postExcerpt}>{post.content}</p>
            <div className={styles.postMeta}>
              <span><User size={16} /> {post.author}</span>
              <span><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString()}</span>
              {visibilityFlags.showInteractions && (
                <>
                  <span className={`${styles.ratingSection} ${isRatingLoading ? styles.ratingLoading : ''}`}>
                    <Star size={16} />
                    <span className={styles.ratingValue}>{rating ? rating.value.toFixed(1) : 'N/A'}</span>
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
                    <MessageSquare size={16} /> {comments.length}
                  </span>
                </>
              )}
            </div>

            {visibilityFlags.showInteractions && showComments && (
              <div className={styles.commentsSection}>
                <h3>Comments</h3>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <p>{comment.content}</p>
                      <small>{comment.author} - {new Date(comment.created_at).toLocaleString()}</small>
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
          </>
        ) : (
          <div className={styles.lockedContent}>
            <Lock size={24} />
            <p>Sign in to view full content, rate, and comment.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <PostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postToEdit={post}
          viewOnly={true}
        />
      )}
    </article>
  );
};

export default PostItem;
