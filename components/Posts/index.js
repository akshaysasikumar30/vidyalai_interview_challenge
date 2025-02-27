import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visiblePosts, setVisiblePosts]=useState(8);
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  
  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    const fetchPost = async () => {
      const { data: fetchedPosts } = await axios.get('/api/v1/posts', {
        params: { start: 0, limit: isSmallerDevice ? 5 : 10 },
      });
      setPosts(fetchedPosts);
      if (fetchedPosts.length <= visiblePosts) {
        setAllPostsLoaded(true); 
      }
    };

    fetchPost();
  }, [isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setVisiblePosts(visiblePosts + 2); // Increase the number of visible posts
      setIsLoading(false);
      if (visiblePosts + 2 >= posts.length) {
        setAllPostsLoaded(true); 
      }
    }, 3000);
  };

  return (
    <Container>
      <PostListContainer>
      {posts.slice(0, visiblePosts).map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {!allPostsLoaded && (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LoadMoreButton onClick={handleClick} disabled={isLoading}>
          {!isLoading ? 'Load More' : 'Loading...'}
        </LoadMoreButton>
      </div>
      )};
    </Container>
    )};

