import React, { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import PostForm from '../../features/Posts/PostForm';

const PostModal = React.memo(({ isOpen, onClose, postToEdit }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>{postToEdit ? 'Edit Post' : 'Create Post'}</h2>
            <PostForm post={postToEdit} onPostSubmit={onClose} />
        </Modal>
    );
});

export default PostModal;
