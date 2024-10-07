import React from 'react';
import { User, Calendar, Star, MessageSquare, Tag } from 'lucide-react';
import styles from './PostItem.module.css';

import Skeleton from 'react-loading-skeleton';


const PostItemSkeleton = () => (
    <div className={styles.skeletonPost}>
      <Skeleton height={200} />
      <Skeleton count={3} />
    </div>
  );
  
  if (isLoading) return <PostItemSkeleton />;

const PostItem = ({ post, isAuthenticated }) => {
  return (
    <article className={styles.postItem}>
      {post.image && <img src={post.image_url} alt={post.title} className={styles.postImage} />}
      <div className={styles.postContent}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.postExcerpt}>{post.content.substring(0, 150)}...</p>
        <div className={styles.postMeta}>
          <span><User size={16} /> {post.author}</span>
          <span><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString()}</span>
          <span><Star size={16} /> {post.average_rating.toFixed(1)}</span>
          <span><MessageSquare size={16} /> {post.comment_count}</span>
          <span><Tag size={16} /> {post.tag_count}</span>
        </div>
      </div>
    </article>
  );
};

export default PostItem;