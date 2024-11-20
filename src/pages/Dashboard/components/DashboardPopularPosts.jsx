import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, MessageSquare, Eye, Plus } from 'lucide-react';
import { useDashboardPosts } from '../hooks/useDashboardPosts';
import PostModal from '../../../features/Posts/PostModal';
import styles from './DashboardPopularPosts.module.css';

const DashboardPopularPosts = () => {
    const { data, isLoading, error } = useDashboardPosts();
    const [selectedPost, setSelectedPost] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleOpenCreateModal = () => {
        setSelectedPost(null); 
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
        setIsCreateModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className={`${styles.bentoBox} ${styles.popularPosts}`}>
                <div className={styles.sectionHeader}>
                    <TrendingUp size={24} />
                    <h2>Most Popular Posts</h2>
                </div>
                <div className={styles.loadingState}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={styles.skeletonPost}>
                            <div className={styles.skeletonTitle}></div>
                            <div className={styles.skeletonMetrics}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.bentoBox} ${styles.popularPosts}`}>
                <div className={styles.sectionHeader}>
                    <TrendingUp size={24} />
                    <h2>Most Popular Posts</h2>
                </div>
                <div className={styles.errorState}>
                    <p>Unable to load popular posts</p>
                    <button onClick={() => window.location.reload()} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { popularPosts } = data || { popularPosts: [] };

    if (!popularPosts?.length) {
        return (
            <div className={`${styles.bentoBox} ${styles.popularPosts}`}>
                <div className={styles.sectionHeader}>
                    <TrendingUp size={24} />
                    <h2>Most Popular Posts</h2>
                </div>
                <div className={styles.emptyState}>
                    <p>No popular posts yet</p>
                    <button onClick={handleOpenCreateModal} className={styles.createPostButton}>
                        <Plus size={16} /> Create your first post
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`${styles.bentoBox} ${styles.popularPosts}`}>
                <div className={styles.sectionHeader}>
                    <TrendingUp size={24} />
                    <h2>Most Popular Posts</h2>
                    <button onClick={handleOpenCreateModal} className={styles.createPostButton}>
                        <Plus size={16} /> Create New Post
                    </button>
                </div>
                <div className={styles.popularPostsList}>
                    {popularPosts.map((post) => (
                        <div key={post.id} className={styles.popularPostItem}>
                            <div className={styles.popularPostInfo}>
                                <h3>{post.title}</h3>
                                <div className={styles.postMetrics}>
                                    <span className={styles.metric}>
                                        <Star size={16} />
                                        {post.ratingDisplay}
                                    </span>
                                    <span className={styles.metric}>
                                        <MessageSquare size={16} />
                                        {post.comments_count || 0}
                                    </span>
                                    <span className={styles.metric}>
                                        <Eye size={16} />
                                        {post.engagementScore}
                                    </span>
                                </div>
                                <p className={styles.postDate}>{post.formattedDate}</p>
                            </div>
                            <Link 
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedPost(post);
                                    setIsCreateModalOpen(true);
                                }}
                                className={styles.viewLink}
                                title={`View ${post.title}`}
                            >
                                View →
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <PostModal 
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                postToEdit={selectedPost}
                viewOnly={!selectedPost} 
            />
        </>
    );
};

export default DashboardPopularPosts;
