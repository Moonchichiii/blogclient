import React from 'react';
import styles from './CommentList.module.css';

const CommentList = ({ comments }) => {
  return (
    <div className={styles.commentList}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.commentItem}>
          <img
            src={comment.author_image || '/default-profile.png'}
            alt={comment.author}
            className={styles.commentAuthorImage}
          />
          <div>
            <p><strong>{comment.author}</strong></p>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;

// to align well with the backends pagination!


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CommentSection = ({ postId }) => {
//   const [comments, setComments] = useState([]);
//   const [page, setPage] = useState(1);  // Current page number
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch comments from the backend
//   const fetchComments = async () => {
//     if (!hasMore || loading) return;

//     setLoading(true);
//     try {
//       const response = await axios.get(`/posts/${postId}/comments/`, {
//         params: { page_size: 10, page }  // Request the current page and page size
//       });

//       setComments((prevComments) => [...prevComments, ...response.data.results]);
//       setHasMore(response.data.next !== null);  // Check if there are more pages
//       setPage((prevPage) => prevPage + 1);  // Move to the next page
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//     setLoading(false);
//   };

//   // Load more comments when the user scrolls to the bottom
//   const handleScroll = () => {
//     if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
//       return;
//     }
//     fetchComments();
//   };

//   useEffect(() => {
//     fetchComments();  // Initial load
//   }, []);

//   useEffect(() => {
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [loading, hasMore]);

//   return (
//     <div className="comments-section">
//       {comments.map((comment) => (
//         <div key={comment.id} className="comment">
//           <p>{comment.author}: {comment.content}</p>
//         </div>
//       ))}
//       {loading && <p>Loading more comments...</p>}
//       {!hasMore && <p>No more comments to load.</p>}
//     </div>
//   );
// };

// export default CommentSection;
