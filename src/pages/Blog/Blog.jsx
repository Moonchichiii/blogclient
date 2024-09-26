import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogPost from './BlogPost';
import SearchBar from '../../components/Searchbar/Searchbar';
import { fetchPosts } from '../../store/postSlice';
import { Loader } from 'lucide-react';
import styles from './Blog.module.css';

const POSTS_PER_PAGE = 10;

const Blog = () => {
  const dispatch = useDispatch();
  const { posts, totalCount, nextUrl, status, error } = useSelector(state => state.posts);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [page, setPage] = useState(1);

  const fetchPostsData = useCallback(() => {
    dispatch(fetchPosts({ 
      limit: POSTS_PER_PAGE, 
      offset: (page - 1) * POSTS_PER_PAGE,
      search: searchQuery,
      ordering: ordering
    }));
  }, [dispatch, page, searchQuery, ordering]);

  useEffect(() => {
    fetchPostsData();
  }, [fetchPostsData]);

  const loadMore = useCallback(() => {
    if (nextUrl) {
      setPage(prevPage => prevPage + 1);
    }
  }, [nextUrl]);

  const handleSearchChange = useCallback((newQuery) => {
    setSearchQuery(newQuery);
    setPage(1);
  }, []);

  const handleOrderingChange = useCallback((e) => {
    setOrdering(e.target.value);
    setPage(1);
  }, []);

  return (
    <div className={styles.blogContainer}>
      <h2 className={styles.title}>Blog Posts</h2>
      <SearchBar setSearchQuery={handleSearchChange} />
      <select onChange={handleOrderingChange} value={ordering} className={styles.orderingSelect}>
        <option value="-created_at">Newest First</option>
        <option value="created_at">Oldest First</option>
        <option value="-average_rating">Highest Rated</option>
      </select>
      {status === 'loading' ? (
        <Loader className="animate-spin" />
      ) : status === 'failed' ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <>
          <div className={styles.blogPosts}>
            {posts.map(post => (
              <BlogPost key={post.id} post={post} isAuthenticated={isAuthenticated} />
            ))}
          </div>
          {nextUrl && (
            <button onClick={loadMore} className={styles.loadMoreButton}>
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Blog;