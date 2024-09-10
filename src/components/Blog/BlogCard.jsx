import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import BlogModal from './BlogModal';
import styles from './BlogCard.module.css';

const BlogCard = ({ post }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={styles.blogCard}>
            <img src={post.image} alt={post.title} className={styles.blogImage} />
            <h2 className={styles.blogTitle}>{post.title}</h2>
            <p className={styles.blogExcerpt}>{post.content.substring(0, 100)}...</p>
            <div className={styles.postInfo}>
                <span>Author: {post.author_name}</span>
                <span>Average Rating: {post.average_rating?.toFixed(1) || 'N/A'}</span>
                <span>Total Ratings: {post.total_ratings}</span>
            </div>
            <button onClick={openModal} className={styles.readMoreButton}>
                {isAuthenticated ? 'Read Full Post' : 'View Card'}
            </button>
            
            {isAuthenticated && (
                <BlogModal 
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    post={post}
                />
            )}
        </div>
    );
};

export default BlogCard;