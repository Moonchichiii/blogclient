import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogList from '../../components/Blog/BlogList';
import SearchBar from '../../components/Searchbar/Searchbar';
import { fetchUserPosts } from '../../store/postSlice';
import styles from './MyPosts.module.css';

const POSTS_PER_PAGE = 10;

const MyPosts = () => {
    const dispatch = useDispatch();
    const { posts, status } = useSelector(state => state.posts);
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('Fetching posts for user:', user);
            dispatch(fetchUserPosts());
        }
    }, [dispatch, isAuthenticated, user]);

    const filteredPosts = useMemo(() => {
        if (!Array.isArray(posts)) {
            return [];
        }
        return posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [posts, searchQuery]);

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        return filteredPosts.slice(0, startIndex + POSTS_PER_PAGE);
    }, [filteredPosts, currentPage]);

    const loadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    if (status === 'loading') {
        console.log('API is still loading');
        return <div>Loading...</div>;
    }

    console.log('Rendering MyPosts component');

    return (
        <div className={styles.myPostsContainer}>
            <h2>My Posts</h2>
            <SearchBar setSearchQuery={setSearchQuery} />
            <div className={styles.blogPosts}>
                {paginatedPosts.length ? (
                    <BlogList blogPosts={paginatedPosts} /> 
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
            {paginatedPosts.length < filteredPosts.length && (
                <button onClick={loadMore} className={styles.loadMoreButton}>
                    Load More
                </button>
            )}
        </div>
    );
};

export default MyPosts;
