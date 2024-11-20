import React from 'react';
import Modal from '../../components/Modal/Modal';
import PostForm from './PostForm';
import styles from './PostModal.module.css';

const PostModal = React.memo(({ isOpen, onClose, postToEdit, viewOnly = false }) => {
    if (!isOpen) return null;

    // Helper function to safely format date
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString; // Fallback to whatever was passed
        }
    };

    // Helper function to safely get author name
    const getAuthorName = (author) => {
        if (typeof author === 'string') return author;
        return author?.profile_name || author?.name || 'Unknown Author';
    };

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
                            <span>By {getAuthorName(postToEdit?.author)}</span>
                            <span>{postToEdit?.formattedDate || formatDate(postToEdit?.created_at)}</span>
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