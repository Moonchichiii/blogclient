import React from 'react';
import Modal from '../../components/Modal/Modal';
import PostForm from '../../features/Posts/PostForm';
import styles from './PostModal.module.css';

const PostModal = React.memo(({ isOpen, onClose, postToEdit }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{postToEdit ? 'Edit Post' : 'Create Post'}</h2>
                </div>
                <PostForm post={postToEdit} onPostSubmit={onClose} />
            </div>
        </Modal>
    );
});

export default PostModal;