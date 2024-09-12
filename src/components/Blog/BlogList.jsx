import React from 'react';
import BlogCard from './BlogCard';

const BlogList = ({ blogPosts }) => {
    return (
        <div>
            {blogPosts.map(post => (
                <BlogCard key={post.id} post={post} />
            ))}
        </div>
    );
};

export default BlogList;
