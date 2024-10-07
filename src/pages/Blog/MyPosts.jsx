import React from 'react';
import PostList from '../../features/Posts/PostList';
import styles from './MyPosts.module.css';

const MyPosts = () => {
  return (
    <div className={styles.myPostsContainer}>
      <h2 className={styles.title}>My Posts</h2>
      <PostList onlyMyPosts={true} />
    </div>
  );
};

export default MyPosts;