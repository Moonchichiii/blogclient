import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById } from '../../store/postSlice';
import PostForm from '../../components/Posts/PostForm';
import { useParams } from 'react-router-dom';

const EditPost = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const post = useSelector(state => state.posts.posts.find(p => p.id === parseInt(id)));

    useEffect(() => {
        if (!post) {
            dispatch(fetchPostById(id));
        }
    }, [dispatch, id, post]);

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <h2>Edit Post</h2>
            <PostForm post={post} />
        </div>
    );
};

export default EditPost;
