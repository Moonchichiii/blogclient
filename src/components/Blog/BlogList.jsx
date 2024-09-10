import React from 'react';
import BlogCard from './BlogCard';
import styles from './BlogList.module.css';

const BlogList = ({ blogPosts }) => {
    return (
        <div className={styles.blogList}>
            {blogPosts.map(post => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default BlogList;
