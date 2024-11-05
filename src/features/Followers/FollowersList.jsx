import React from 'react';
import useFollowers from './hooks/useFollowers';
import { useAuth } from '../Accounts/hooks/useAuth';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styles from './FollowerList.module.css';

const FollowersList = () => {
  const { user } = useAuth();
  const { followers, isLoadingFollowers, followersError, unfollow } = useFollowers(user?.id);

  if (isLoadingFollowers) return <div>Loading followers...</div>;
  if (followersError) return <div>Error loading followers: {followersError.message}</div>;

  return (
    <div className={styles.followersList}>
      <h2>Followers List</h2>
      <TransitionGroup component="ul">
        {followers.map((follower) => (
          <CSSTransition key={follower.id} timeout={300} classNames="fade">
            <li className={styles.followerItem}>
              {follower.profile_name}
              <button onClick={() => unfollow(follower.id)}>Unfollow</button>
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default FollowersList;
