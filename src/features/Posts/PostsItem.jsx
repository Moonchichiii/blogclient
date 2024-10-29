// PostItem.jsx
import React, { useState } from 'react';
import { User, Calendar, Star, MessageSquare, Tag, Lock } from 'lucide-react';
import styles from './PostItem.module.css';
import { useComments } from '../Comments/hooks/useComments';
import { useRatings } from '../Ratings/hooks/useRatings';
import { useTags } from '../Tags/hooks/useTags';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../../features/Accounts/hooks/useAuth';

const PostItem = React.memo(({ post, isAuthenticated }) => {
  const { user, roles } = useAuth();
  const isStaffOrAdmin = roles.includes('admin') || roles.includes('staff');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('');

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
  
  const { tags, addTag } = useTags(isAuthenticated ? post.id : null);

  const handleAddComment = () => {
    if (newComment.trim() && isAuthenticated) {
      addComment({ content: newComment });
      setNewComment('');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && isAuthenticated) {
      addTag(newTag);
      setNewTag('');
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
              <span>
                <Star size={16} />
                {rating ? rating.value.toFixed(1) : 'N/A'}
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating?.value || ''}
                  onChange={handleRatingChange}
                />
              </span>
              <span onClick={handleToggleComments}>
                <MessageSquare size={16} /> {comments?.length || 0}
              </span>
              <span>
                <Tag size={16} /> {tags?.length || 0}
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
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={handleAddComment}>Post Comment</button>
              </div>
            )}

            <div className={styles.tagsSection}>
              {tags &&
                tags.map((tag) => (
                  <span key={tag.id} className={styles.tag}>
                    {tag.name}
                  </span>
                ))}
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
              />
              <button onClick={handleAddTag}>Add Tag</button>
            </div>

            {/* Conditional rendering for staff/admin actions */}
            {isStaffOrAdmin && (
              <div className={styles.adminActions}>
                <button onClick={() => approvePost(post.id)}>Approve</button>
                <button onClick={() => openDisapproveModal(post)}>Disapprove</button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.lockedContent}>
            <Lock size={24} />
            <p>Sign in to view full content, rate, comment, and add tags.</p>
          </div>
        )}
      </div>
    </article>
  );
});

export default PostItem;
