import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost, deletePost } from '../../store/postSlice';
import styles from './BlogModal.module.css';

const BlogModal = ({ isOpen, onRequestClose, post }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.user);
    const [editMode, setEditMode] = useState(false);
    const [editedPost, setEditedPost] = useState(post);
    const [comment, setComment] = useState('');

    const isAuthor = currentUser && currentUser.id === post.author;

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        dispatch(updatePost({ id: post.id, postData: editedPost }));
        setEditMode(false);
    };

    const handleDelete = () => {
        dispatch(deletePost(post.id));
        onRequestClose();
    };

    const handleComment = () => {
        console.log('New comment:', comment);
        setComment('');
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className={styles.modal}>
            <div className={styles.modalContent}>
                {editMode ? (
                    <>
                        <input
                            type="text"
                            value={editedPost.title}
                            onChange={(e) => setEditedPost({...editedPost, title: e.target.value})}
                        />
                        <textarea
                            value={editedPost.content}
                            onChange={(e) => setEditedPost({...editedPost, content: e.target.value})}
                        />
                        <button onClick={handleSave}>Save</button>
                    </>
                ) : (
                    <>
                        <h2>{post.title}</h2>
                        <img src={post.image} alt={post.title} className={styles.modalImage} />
                        <p>{post.content}</p>
                    </>
                )}
                <div className={styles.commentsSection}>
                    <h3>Comments</h3>
                    {post.comments && post.comments.map((comment, index) => (
                        <p key={index}>{comment.content} - {comment.author_name}</p>
                    ))}
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    <button onClick={handleComment}>Post Comment</button>
                </div>
                {isAuthor && !editMode && (
                    <>
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </>
                )}
                <button onClick={onRequestClose} className={styles.closeModalButton}>Close</button>
            </div>
        </Modal>
    );
};

export default BlogModal;
