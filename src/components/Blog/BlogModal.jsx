import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { createPost, updatePost, deletePost } from '../../store/postSlice';
import styles from './BlogModal.module.css';

const BlogModal = ({ isOpen, onRequestClose, post, isAuthenticated, isAuthor }) => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [editedPost, setEditedPost] = useState(post);

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
                {isAuthenticated && (
                    <div className={styles.commentsSection}>
                        <h3>Comments</h3>
                        {post.comments.map((comment, index) => (
                            <p key={index}>{comment.content} - {comment.author_name}</p>
                        ))}
                    </div>
                )}
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