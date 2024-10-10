import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postEndpoints } from '../../api/endpoints';
import { Image, X } from 'lucide-react';
import { showToast } from '../../utils/Toast';
import styles from './PostForm.module.css';

const PostForm = ({ post, onPostSubmit }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    tags: [],
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        image: post.image || null,
        tags: post.tags?.map(tag => tag.name) || [],
      });
      setImagePreview(post.image || null);
    }
  }, [post]);

  const createPostMutation = useMutation({
    mutationFn: postEndpoints.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      showToast('Post created successfully!', 'success');
      if (onPostSubmit) onPostSubmit();
    },
    onError: (error) => {
      showToast(error.message || 'Failed to create post', 'error');
      setErrors(error.response?.data || {});
    },
  });
  
  const updatePostMutation = useMutation({
    mutationFn: postEndpoints.updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      showToast('Post updated successfully!', 'success');
      if (onPostSubmit) onPostSubmit();
    },
    onError: (error) => {
      showToast(error.message || 'Failed to update post', 'error');
      setErrors(error.response?.data || {});
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image must be less than 2MB' }));
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData((prev) => ({ ...prev, tags }));
    setErrors((prev) => ({ ...prev, tags: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 200) newErrors.title = 'Title must be 200 characters or less';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.tags.length > 5) newErrors.tags = 'Maximum 5 tags are allowed';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('content', formData.content);
      if (formData.image instanceof File) {
        postData.append('image', formData.image);
      }
      formData.tags.forEach((tag) => postData.append('tags', tag));

      if (post) {
        updatePostMutation.mutate({ id: post.id, postData });
      } else {
        createPostMutation.mutate(postData);
      }
    }
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
        {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
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
        {errors.content && <span className={styles.errorMessage}>{errors.content}</span>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          className={errors.tags ? styles.inputError : ''}
        />
        {errors.tags && <span className={styles.errorMessage}>{errors.tags}</span>}
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
        {errors.image && <span className={styles.errorMessage}>{errors.image}</span>}
      </div>
      {imagePreview && (
        <div className={styles.imagePreviewContainer}>
          <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
          <button
            type="button"
            onClick={() => {
              setFormData((prev) => ({ ...prev, image: null }));
              setImagePreview(null);
            }}
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
