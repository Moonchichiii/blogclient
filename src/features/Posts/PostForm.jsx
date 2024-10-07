import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createPost, updatePost } from './postSlice';
import { createTag } from '../Tags/tagsSlice';
import { Image, X } from 'lucide-react';
import useToast from '../../hooks/useToast';
import api from '../../api/apiConfig';
import styles from './PostForm.module.css';

const PostForm = ({ post, onPostSubmit }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [tags, setTags] = useState(
    post ? post.tags.map((tag) => tag.tagged_user_name).join(', ') : ''
  );
  const [formData, setFormData] = useState({
    title: post ? post.title : '',
    content: post ? post.content : '',
    image: post ? post.image : null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(post ? post.image : null);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        image: post.image,
      });
      setImagePreview(post.image || null);
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image must be less than 2MB', 'warning', 5000);
        return;
      }
      setFormData((prevState) => ({ ...prevState, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
    }
  };

  const removeImage = () => {
    setFormData((prevState) => ({ ...prevState, image: null }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUserIdByUsername = async (username) => {
    try {
      const response = await api.get(`/api/users/?profile_name=${username}`);
      if (response.data.length > 0) {
        return response.data[0].id;
      }
    } catch (error) {
      console.error(`Failed to fetch user ID for username: ${username}`, error);
    }
    return null;
  };

  const fetchContentTypeId = async (model) => {
    try {
      const response = await api.get(`/api/content-types/?model=${model}`);
      if (response.data.length > 0) {
        return response.data[0].id;
      }
    } catch (error) {
      console.error(`Failed to fetch content type ID for model: ${model}`, error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (formData.image && formData.image !== post?.image) {
        data.append('image', formData.image);
      }

      try {
        let updatedPost;
        if (post) {
          updatedPost = await dispatch(
            updatePost({ id: post.id, postData: data })
          ).unwrap();
          showToast('Post updated successfully!', 'success');
        } else {
          updatedPost = await dispatch(createPost(data)).unwrap();
          showToast('Post created successfully!', 'success');
        }

        // Handle tags
        const taggedUsernames = tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
        for (const username of taggedUsernames) {
          const userId = await fetchUserIdByUsername(username);
          if (userId) {
            const contentTypeId = await fetchContentTypeId('post');
            if (contentTypeId) {
              await dispatch(
                createTag({
                  contentType: contentTypeId,
                  objectId: updatedPost.id,
                  taggedUserId: userId,
                })
              ).unwrap();
            } else {
              showToast('Failed to fetch content type ID', 'error');
            }
          } else {
            showToast(`User ${username} not found`, 'error');
          }
        }

        if (onPostSubmit) {
          onPostSubmit();
        }
      } catch (error) {
        const errorMessage =
          error.message ||
          `Failed to ${post ? 'update' : 'create'} post. Please try again.`;
        showToast(errorMessage, 'error');
      }
    } else {
      showToast('Please fix the errors in the form', 'warning');
    }
  };

  const handleError = (error) => {
    const errorMessage = error?.response?.data?.message || 'An error occurred';
    showToast(errorMessage, 'error');
  };
  


  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? styles.inputError : ''}
        />
        {errors.title && (
          <span className={styles.errorMessage}>{errors.title}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          className={errors.content ? styles.inputError : ''}
        />
        {errors.content && (
          <span className={styles.errorMessage}>{errors.content}</span>
        )}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="image" className={styles.imageUpload}>
          <Image size={24} />
          <span>{post ? 'Update Image' : 'Upload Image'}</span>
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className={styles.hiddenInput}
        />
        {errors.image && (
          <span className={styles.errorMessage}>{errors.image}</span>
        )}
      </div>
      {imagePreview && (
        <div className={styles.imagePreviewContainer}>
          <img
            src={imagePreview}
            alt="Preview"
            className={styles.imagePreview}
          />
          <button
            type="button"
            onClick={removeImage}
            className={styles.removeImageBtn}
          >
            <X size={24} />
          </button>
        </div>
      )}
      <button type="submit" className={styles.submitButton}>
        {post ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
};

export default PostForm;
