import React from 'react';
import { useFollowers } from '../hooks/useFollowers';
import { useAuth } from '../hooks/useAuth';
import styles from './FollowersList.module.css';

const FollowersList = () => {
  const { user } = useAuth();
  const { followers, isLoading, error, follow, unfollow } = useFollowers(user?.id);

  if (isLoading) return <div>Loading followers...</div>;
  if (error) return <div>Error loading followers: {error.message}</div>;

  return (
    <div className={styles.followersList}>
      <h2>Followers List</h2>
      <ul>
        {followers.map(follower => (
          <li key={follower.id} className={styles.followerItem}>
            {follower.profile_name}
            <button onClick={() => unfollow(follower.id)}>Unfollow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowersList;