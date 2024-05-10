
    import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const LoadMoreButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  font-weight: 600;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #808080;
    cursor: default;
  }
`;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visiblePosts, setVisiblePosts] = useState(8); // Number of initially visible posts

  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/api/v1/posts', {
          params: { start: 0, limit: isSmallerDevice ? 5 : 10 },
        });
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate loading delay for demonstration purposes
    setTimeout(() => {
      setVisiblePosts(visiblePosts + 2); // Increase the number of visible posts
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.slice(0, visiblePosts).map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {visiblePosts < posts.length && ( // Render Load More button only if there are more posts to load
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
