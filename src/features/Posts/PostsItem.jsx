import React, { useState } from 'react';
import { User, Calendar, Star, MessageSquare, Tag, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './PostItem.module.css';
import { useComments } from '../Comments/hooks/useComments';
import { useRatings } from '../Ratings/hooks/useRatings';
import { useAuth } from '../Accounts/hooks/useAuth';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const PostItem = React.memo(({ post, isAuthenticated, approvePost, openDisapproveModal }) => {
  const { roles, currentUser } = useAuth();
  const isOwner = post.author === currentUser?.profile_name;
  const isStaffOrAdmin = roles.includes('admin') || roles.includes('superuser');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const { rating, ratePost } = useRatings(isAuthenticated ? post.id : null);
  const {
    comments,
    fetchNextPage,
    hasNextPage,
    addComment,
  } = useComments(
    isAuthenticated && showComments ? post.id : null,
    isAuthenticated && showComments
  );

  const handleAddComment = () => {
    if (newComment.trim() && isAuthenticated) {
      addComment({ content: newComment });
      setNewComment('');
    }
  };

  const handleRatingChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 5 && isAuthenticated) {
      ratePost(value);
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <article className={`${styles.postItem} ${!post.is_approved ? styles.unapprovedPost : ''}`}>
      {/* Approval Status Badge */}
      {(isStaffOrAdmin || isOwner) && (
        <div className={`${styles.approvalBadge} ${post.is_approved ? styles.approved : styles.pending}`}>
          {post.is_approved ? (
            <>
              <CheckCircle size={16} />
              <span>Approved</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} />
              <span>Pending Approval</span>
            </>
          )}
        </div>
      )}

{post.image && (
  <LazyLoadImage
    src={post.image}
    alt={post.title}
    className={styles.postImage}
    effect="blur"
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
              <span>
                <Star size={16} />
                {post.average_rating ? post.average_rating.toFixed(1) : 'N/A'}
              </span>
              {!isOwner && (
                <span>
                  Your Rating:
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating?.value || ''}
                    onChange={handleRatingChange}
                    className={styles.ratingInput}
                  />
                </span>
              )}
              <span onClick={handleToggleComments}>
                <MessageSquare size={16} /> {comments?.length || 0}
              </span>
              <span>
                <Tag size={16} /> {post.tags?.length || 0}
              </span>
            </div>

            {showComments && (
              <div className={styles.commentsSection}>
                <InfiniteScroll
                  dataLength={comments.length}
                  next={fetchNextPage}
                  hasMore={hasNextPage}
                  loader={<h4>Loading...</h4>}
                >
                  {comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <p>{comment.content}</p>
                      <small>
                        {comment.author} -{' '}
                        {new Date(comment.created_at).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </InfiniteScroll>
                <div className={styles.addComment}>
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <button onClick={handleAddComment}>Post Comment</button>
                </div>
              </div>
            )}

            {post.tags?.length > 0 && (
              <div className={styles.tagsSection}>
                {post.tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    Tagged: {tag.tagged_user}
                  </span>
                ))}
              </div>
            )}

            {/* Admin Actions */}
            {isStaffOrAdmin && !post.is_approved && (
              <div className={styles.adminActions}>
                <button
                  onClick={() => approvePost(post.id)}
                  className={styles.approveButton}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => openDisapproveModal(post)}
                  className={styles.disapproveButton}
                >
                  <AlertCircle size={16} />
                  Disapprove
                </button>
              </div>
            )}

            {/* Owner Notice */}
            {isOwner && !post.is_approved && (
              <div className={styles.pendingNotice}>
                <AlertCircle size={16} />
                <p>This post is pending approval from moderators.</p>
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