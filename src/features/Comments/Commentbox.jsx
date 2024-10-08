import React, { useState } from 'react';

const CommentBox = ({ postId, addComment }) => {
    const [comment, setComment] = useState('');

    const handleInputChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            addComment(postId, comment);
            setComment('');
        }
    };

    return (
        <div className="comment-box">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={comment}
                    onChange={handleInputChange}
                    placeholder="Write a comment..."
                    rows="4"
                    cols="50"
                />
                <button type="submit">Post Comment</button>
            </form>
        </div>
    );
};

export default CommentBox;