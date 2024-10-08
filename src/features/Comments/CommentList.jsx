import React from 'react';

const CommentList = ({ comments }) => {
    return (
        <div>
            <h2>Comments</h2>
            <ul>
                {comments.map((comment, index) => (
                    <li key={index}>
                        <p><strong>{comment.author}</strong></p>
                        <p>{comment.text}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentList;