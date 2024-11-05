import React from 'react';
import Modal from '../../components/Modal/Modal';
import PostForm from './PostForm';
import styles from './PostModal.module.css';

const PostModal = React.memo(({ isOpen, onClose, postToEdit, viewOnly = false }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{viewOnly ? 'View Post' : postToEdit ? 'Edit Post' : 'Create Post'}</h2>
                </div>
                {viewOnly ? (
                    <div className={styles.viewPost}>
                        <h3>{postToEdit?.title}</h3>
                        {postToEdit?.image && (
                            <img 
                                src={postToEdit.image} 
                                alt={postToEdit.title}
                                className={styles.postImage}
                            />
                        )}
                        <p className={styles.postContent}>{postToEdit?.content}</p>
                        <div className={styles.postMeta}>
                            <span>By {postToEdit?.author}</span>
                            <span>{postToEdit?.formattedDate}</span>
                        </div>
                    </div>
                ) : (
                    <PostForm post={postToEdit} onPostSubmit={onClose} />
                )}
            </div>
        </Modal>
    );
});

export default PostModal;