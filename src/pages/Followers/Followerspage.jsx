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
import FollowersList from '../../components/FollowersList';
import PopularFollowers from '../../components/PopularFollowers';
import { useFollowers } from '../../hooks/useFollowers';
import { useAuth } from '../../hooks/useAuth';
import styles from './FollowersPage.module.css';

const FollowersChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="followers" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
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

  if (isLoadingFollowers || isLoadingPopularFollowers) return <div>Loading...</div>;
  if (followersError || popularFollowersError)
    return <div>Error: {followersError?.message || popularFollowersError?.message}</div>;

  const followerData = followers.reduce((acc, follower) => {
    const month = new Date(follower.created_at).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(followerData).map(([name, followers]) => ({ name, followers }));

  return (
    <div className={styles.followersPage}>
      <h1>Followers Page</h1>
      <div className={styles.chartContainer}>
        <FollowersChart data={chartData} />
      </div>
      <PopularFollowers popularFollowers={popularFollowers} />
      <FollowersList />
    </div>
  );
};

export default FollowersPage;
