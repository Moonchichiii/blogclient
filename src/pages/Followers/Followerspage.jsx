import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import FollowersList from '../../features/Followers/FollowersList';
import PopularFollowers from '../../features/Followers/PopularFollowers';

import { useFollowers} from '../../features/Followers/hooks/useFollowers';
import { useAuth } from '../../features/Accounts/hooks/useAuth';
import styles from './FollowersPage.module.css';

const FollowersChart = ({ data }) => (
  <div className={styles.chartContainer}>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="followers" 
          stroke="var(--primary-color)" 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const FollowersPage = () => {
  const { user } = useAuth();
  const {
    followers,
    isLoadingFollowers,
    followersError,
    popularFollowers,
    isLoadingPopularFollowers,
    popularFollowersError,
    follow,
    unfollow,
  } = useFollowers(user?.id);

  if (isLoadingFollowers || isLoadingPopularFollowers) {
    return (
      <div className={styles.followersPage}>
        <div>Loading followers data...</div>
      </div>
    );
  }

  if (followersError || popularFollowersError) {
    return (
      <div className={styles.followersPage}>
        <div>Error: {followersError?.message || popularFollowersError?.message}</div>
      </div>
    );
  }

  const followerData = followers?.reduce((acc, follower) => {
    const month = new Date(follower.created_at).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(followerData || {}).map(([name, followers]) => ({
    name,
    followers,
  }));

  return (
    <div className={styles.followersPage}>
      <h1>Your Followers</h1>
      <FollowersChart data={chartData} />
      <div className={styles.popularFollowers}>
        <PopularFollowers 
          popularFollowers={popularFollowers} 
          onFollow={follow}
          onUnfollow={unfollow}
        />
      </div>
      <div className={styles.followersList}>
        <FollowersList 
          followers={followers} 
          onUnfollow={unfollow}
        />
      </div>
    </div>
  );
};

export default FollowersPage;