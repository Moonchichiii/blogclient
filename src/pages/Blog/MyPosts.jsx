import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogPost from './BlogPost';
import SearchBar from '../../components/Searchbar/Searchbar';
import { fetchUserPosts } from '../../store/postSlice';
import { Loader } from 'lucide-react';
import styles from './MyPosts.module.css';

const POSTS_PER_PAGE = 10;

const MyPosts = () => {
  const dispatch = useDispatch();
  const { posts, totalCount, nextUrl, status, error } = useSelector(state => state.posts);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState('-created_at');
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    dispatch(fetchUserPosts({
      limit: POSTS_PER_PAGE,
      offset: (page - 1) * POSTS_PER_PAGE,
      search: searchQuery,
      ordering: ordering,
      author: 'current'
    }))
      .unwrap()
      .then(data => {
        setHasMore(data.next !== null);
      })
      .catch(error => console.error(`Error fetching posts: ${error.message}`));
  }, [dispatch, page, searchQuery, ordering]);

  const loadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);
    setPage(1);
  };

  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
    setPage(1);
  };

  if (status === 'loading') return <Loader className="animate-spin" />;
  if (status === 'failed') return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.myPostsContainer}>
      <h2 className={styles.title}>My Posts</h2>
      <div className={styles.controls}>
        <SearchBar setSearchQuery={handleSearchChange} />
        <select onChange={handleOrderingChange} value={ordering} className={styles.orderingSelect}>
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="-average_rating">Highest Rated</option>
        </select>
      </div>
      <div className={styles.blogPosts}>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map(post => (
            <BlogPost key={post.id} post={post} isMyPost={true} />
          ))
        ) : (
          <div className={styles.noPosts}>No posts available</div>
        )}
      </div>
      {hasMore && (
        <button onClick={loadMore} className={styles.loadMoreButton}>
          Load More
        </button>
      )}
      <div className={styles.postCount}>
        Showing {posts.length} of {totalCount} posts
      </div>
    </div>
  );
};

export default MyPosts;