import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPosts, deletePost } from '../../store/postSlice'; // Define fetchUserPosts in your slice
import { Link } from 'react-router-dom';
import styles from './MyPosts.module.css';

const MyPosts = () => {
    const dispatch = useDispatch();
    const { posts, status } = useSelector(state => state.posts);

    useEffect(() => {
        dispatch(fetchUserPosts());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deletePost(id));
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.myPostsContainer}>
            <h2>My Posts</h2>
            {posts.length ? (
                posts.map(post => (
                    <div key={post.id} className={styles.postCard}>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                        <p>{post.content.substring(0, 100)}...</p>
                        <div className={styles.postActions}>
                            <Link to={`/edit-post/${post.id}`}>Edit</Link>
                            <button onClick={() => handleDelete(post.id)}>Delete</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default MyPosts;