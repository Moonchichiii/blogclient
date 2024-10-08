import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postEndpoints, tagEndpoints, userEndpoints } from '../../api/endpoints';
import { Image, X } from 'lucide-react';
import showToast from '../../utils/Toast';
import styles from './PostForm.module.css';

const PostForm = ({ post, onPostSubmit }) => {
  const queryClient = useQueryClient();
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

  const createPostMutation = useMutation(postEndpoints.createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      showToast('Post created successfully!', 'success');
      if (onPostSubmit) onPostSubmit();
    },
    onError: (error) => {
      showToast(error.message || 'Failed to create post', 'error');
    },
  });

  const updatePostMutation = useMutation(postEndpoints.updatePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts');
      showToast('Post updated successfully!', 'success');
      if (onPostSubmit) onPostSubmit();
    },
    onError: (error) => {
      showToast(error.message || 'Failed to update post', 'error');
    },
  });

  const createTagMutation = useMutation(tagEndpoints.createTag);

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
          updatedPost = await updatePostMutation.mutateAsync({ id: post.id, postData: data });
        } else {
          updatedPost = await createPostMutation.mutateAsync(data);
        }

        // Handle tags
        const taggedUsernames = tags.split(',').map((tag) => tag.trim()).filter(Boolean);
        for (const username of taggedUsernames) {
          const userId = await userEndpoints.getUserIdByUsername(username);
          if (userId) {
            const contentTypeId = await postEndpoints.getContentTypeId('post');
            if (contentTypeId) {
              await createTagMutation.mutateAsync({
                contentType: contentTypeId,
                objectId: updatedPost.id,
                taggedUserId: userId,
              });
            } else {
              showToast('Failed to fetch content type ID', 'error');
            }
          } else {
            showToast(`User ${username} not found`, 'error');
          }
        }
      } catch (error) {
        showToast(error.message || 'An error occurred', 'error');
      }
    } else {
      showToast('Please fix the errors in the form', 'warning');
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