import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { updatePost, deletePost, approvePost, disapprovePost, fetchPost } from '../../store/postSlice';
import { fetchComments, addComment, updateComment, deleteComment } from '../../store/commentSlice';
import { ratePost } from '../../store/ratingsSlice';
import PostForm from './PostForm';
import useToast from '../../hooks/useToast';
import { MessageSquare, Star, Tag, Calendar, User, Edit, Trash2 } from 'lucide-react';
import styles from './BlogPost.module.css';

const BlogPost = ({ post: initialPost, isMyPost }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [post, setPost] = useState(initialPost);
  const currentUser = useSelector(state => state.auth.user);
  const userRating = useSelector(state => state.ratings.ratings[post.id]);
  const comments = useSelector(state => state.comments.comments[post.id] || []);
  const isAdmin = currentUser && currentUser.is_admin;

  useEffect(() => {
    if (isModalOpen) {
      dispatch(fetchComments(post.id));
    }
  }, [isModalOpen, dispatch, post.id]);

  const handleEdit = useCallback(() => setIsEditing(true), []);

  const handleSave = useCallback(async (updatedPost) => {
    try {
      const result = await dispatch(updatePost({ id: post.id, postData: updatedPost })).unwrap();
      setPost(result);
      setIsEditing(false);
      showToast('Post updated successfully!', 'success');
    } catch (error) {
      showToast(`Failed to update post: ${error.message}`, 'error');
    }
  }, [dispatch, post.id, showToast]);

  const handleDelete = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await dispatch(deletePost(post.id)).unwrap();
        showToast('Post deleted successfully!', 'success');
        setIsModalOpen(false);
      } catch (error) {
        showToast(`Failed to delete post: ${error.message}`, 'error');
      }
    }
  }, [dispatch, post.id, showToast]);

  const handleApprove = useCallback(async () => {
    try {
      const result = await dispatch(approvePost(post.id)).unwrap();
      setPost(result);
      showToast('Post approved successfully!', 'success');
    } catch (error) {
      showToast(`Failed to approve post: ${error.message}`, 'error');
    }
  }, [dispatch, post.id, showToast]);

  const handleDisapprove = useCallback(async () => {
    const reason = prompt("Please provide a reason for disapproval:");
    if (reason) {
      try {
        const result = await dispatch(disapprovePost({ id: post.id, reason })).unwrap();
        setPost(result);
        showToast('Post disapproved successfully!', 'success');
      } catch (error) {
        showToast(`Failed to disapprove post: ${error.message}`, 'error');
      }
    } else {
      showToast('Disapproval reason is required.', 'warning');
    }
  }, [dispatch, post.id, showToast]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleAddComment = useCallback(async () => {
    if (!currentUser) {
      showToast('Please log in to add a comment', 'error');
      return;
    }

    if (newComment.trim()) {
      try {
        await dispatch(addComment({ postId: post.id, content: newComment })).unwrap();
        setNewComment('');
        showToast('Comment added successfully', 'success');
        dispatch(fetchComments(post.id)); 
      } catch (error) {
        showToast(`Failed to add comment: ${error.message}`, 'error');
      }
    }
  }, [currentUser, newComment, dispatch, post.id, showToast]);

  const handleEditComment = useCallback(async (commentId, newContent) => {
    try {
      await dispatch(updateComment({ commentId, content: newContent })).unwrap();
      showToast('Comment updated successfully', 'success');
    } catch (error) {
      showToast(`Failed to update comment: ${error.message}`, 'error');
    }
  }, [dispatch, showToast]);

  const handleDeleteComment = useCallback(async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
        showToast('Comment deleted successfully', 'success');
      } catch (error) {
        showToast(`Failed to delete comment: ${error.message}`, 'error');
      }
    }
  }, [dispatch, showToast]);

  
const handleRate = useCallback(async (value) => {
  try {
    const result = await dispatch(ratePost({ postId: post.id, value })).unwrap();
    showToast(`You rated this post ${value} stars!`, 'success');
    // update the local state.
  } catch (error) {
    const errorMessage = error.message || 'Failed to rate post';
    showToast(errorMessage, 'error');
  }
}, [dispatch, post.id, showToast]);

  const postTags = useMemo(() => (
    currentUser && (
      <div className={styles.tags}>
        {post.tags.map(tag => (
          <span key={tag.id} className={styles.tag}>{tag.tagged_user_name}</span>
        ))}
      </div>
    )
  ), [currentUser, post.tags]);

  const approvalStatus = useMemo(() => (
    currentUser && currentUser.is_superuser && (
      <div className={styles.approvalStatus}>
        {post.is_approved ? (
          <span className={styles.approved}>Approved</span>
        ) : (
          <span className={styles.pending}>Pending Approval</span>
        )}
      </div>
    )
  ), [currentUser, post.is_approved]);

  return (
    <>
      <article className={styles.blogPost} onClick={handleOpenModal}>
        {post.image && <img src={post.image} alt={post.title} className={styles.blogImage} />}
        <div className={styles.blogContent}>
          <h2 className={styles.blogTitle}>{post.title}</h2>
          <p className={styles.blogExcerpt}>{post.content.substring(0, 150)}...</p>
          <div className={styles.blogMeta}>
            <span><User size={16} /> {post.author_name}</span>
            <span><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString()}</span>
            <span><Star size={16} /> {post.average_rating ? post.average_rating.toFixed(1) : 'N/A'} ({post.total_ratings})</span>
            <span><MessageSquare size={16} /> {comments.length}</span>
            <span><Tag size={16} /> {post.tags.length}</span>
          </div>
          {postTags}
          {approvalStatus}
        </div>
      </article>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        {isEditing ? (
          <PostForm post={post} onSubmit={handleSave} onCancel={() => setIsEditing(false)} />
        ) : (
          <div className={styles.modalContent}>
            <button onClick={() => setIsModalOpen(false)} className={styles.closeButton}>&times;</button>
            <h2>{post.title}</h2>
            {post.image && <img src={post.image} alt={post.title} className={styles.modalImage} />}
            <p>{post.content}</p>
            <div className={styles.ratingSection}>
              <h3>Your Rating:</h3>
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  onClick={() => handleRate(value)}
                  fill={value <= (userRating || 0) ? "gold" : "none"}
                  stroke="currentColor"
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
            <CommentsSection
      comments={comments}
      currentUser={currentUser}
      isAdmin={isAdmin}
      newComment={newComment}
      setNewComment={setNewComment}
      handleAddComment={handleAddComment}
      handleEditComment={handleEditComment}
      handleDeleteComment={handleDeleteComment}
    />
            {currentUser && currentUser.is_superuser && !isMyPost && (
              <div className={styles.actions}>
                {!post.is_approved && (
                  <button onClick={handleApprove} className={styles.approveButton}>Approve</button>
                )}
                {post.is_approved && (
                  <button onClick={handleDisapprove} className={styles.disapproveButton}>Disapprove</button>
                )}
              </div>
            )}
            {(isAdmin || isMyPost) && (
              <div className={styles.actions}>
                <button onClick={handleEdit} className={styles.editButton}>Edit</button>
                <button onClick={handleDelete} className={styles.deleteButton}>Delete</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

const CommentsSection = ({ comments, currentUser, isAdmin, newComment, setNewComment, handleAddComment, handleEditComment, handleDeleteComment }) => (
  <div className={styles.commentsSection}>
    <h3>Comments:</h3>
    {comments && comments.length > 0 ? (
      comments.map(comment => (
        <div key={comment.id} className={styles.comment}>
        <div className={styles.commentHeader}>
          <img src={comment.author_image || '/default-avatar.png'} alt={comment.author_name} className={styles.commentAuthorImage} />
          <div className={styles.commentInfo}>
            <strong>{comment.author_name}</strong>
            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </div>
          {(currentUser && currentUser.id === comment.author || isAdmin) && (
            <div className={styles.commentActions}>
              <button onClick={() => handleEditComment(comment.id, comment.content)} className={styles.editCommentButton}>
                <Edit size={16} />
              </button>
              <button onClick={() => handleDeleteComment(comment.id)} className={styles.deleteCommentButton}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        <p>{comment.content}</p>
      </div>
    ))
  ) : (
    <p>No comments yet.</p>
  )}
  <div className={styles.addComment}>
    <textarea
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Add a comment..."
    />
    <button onClick={handleAddComment}>Post Comment</button>
  </div>
</div>
);

export default BlogPost;