import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ratePost } from '../../api/posts';
import BlogModal from './BlogModal';
import styles from './BlogCard.module.css';

const BlogCard = ({ post }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleRating = async (value) => {
        if (isAuthenticated) {
            try {
                await ratePost(post.id, value);
                setRating(value);
                // You might want to update the post in the Redux store here
            } catch (error) {
                console.error('Error rating post:', error);
            }
        }
    };

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
            {isAuthenticated && (
                <div className={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={star <= rating ? styles.starFilled : styles.starEmpty}
                            onClick={() => handleRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            )}
            <button onClick={openModal} className={styles.readMoreButton}>
                {isAuthenticated ? 'Read Full Post' : 'View Card'}
            </button>
            
            <BlogModal 
                isOpen={isModalOpen} 
                onRequestClose={closeModal} 
                post={post} 
                isAuthenticated={isAuthenticated} 
            />
        </div>
    );
};

export default BlogCard;