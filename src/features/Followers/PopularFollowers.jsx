import React from 'react';
import { Card, Avatar, List, Tag, Progress } from 'antd';
import { StarOutlined, CommentOutlined, FileTextOutlined, LikeOutlined, UserOutlined } from '@ant-design/icons';

const PopularFollowers = ({ popularFollowers }) => {
  return (
    <Card title="Popular Followers" style={{ width: '100%' }}>
      <List
        itemLayout="horizontal"
        dataSource={popularFollowers}
        renderItem={follower => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={follower.image} icon={<UserOutlined />} />}
              title={follower.profile_name}
              description={
                <>
                  <div>
                    <StarOutlined /> Average Rating: {follower.average_rating.toFixed(2)}
                  </div>
                  <div>
                    {follower.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <div>
                    <CommentOutlined /> Comments: {follower.comment_count}
                  </div>
                  <div>
                    <FileTextOutlined /> Posts: {follower.post_count}
                  </div>
                  <div>
                    <LikeOutlined /> Popularity Score:
                    <Progress percent={follower.popularity_score} size="small" status="active" />
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default PopularFollowers;
