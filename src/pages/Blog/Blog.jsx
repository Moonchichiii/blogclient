import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogList from '../../components/Blog/BlogList';
import SearchBar from '../../components/Searchbar/Searchbar';
import { fetchPosts } from '../../store/postSlice';
import styles from './Blog.module.css';
import { Loader } from 'lucide-react';

const POSTS_PER_PAGE = 10;

const Blog = () => {
    const dispatch = useDispatch();
    const { posts, status, error } = useSelector(state => state.posts);
    const { isAuthenticated } = useSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPosts());
        }
    }, [status, dispatch]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [posts, searchQuery]);

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    }, [filteredPosts, currentPage]);

    const loadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    if (status === 'loading') {
        return <Loader className="animate-spin" />;
    }

    if (status === 'failed') {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.blogContainer}>
            <h2 className={styles.title}>Blog Posts</h2>
            <SearchBar setSearchQuery={setSearchQuery} />
            <div className={styles.blogPosts}>
                <BlogList blogPosts={paginatedPosts} isAuthenticated={isAuthenticated} />
                {paginatedPosts.length < filteredPosts.length && (
                    <button onClick={loadMore} className={styles.loadMoreButton}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default Blog;