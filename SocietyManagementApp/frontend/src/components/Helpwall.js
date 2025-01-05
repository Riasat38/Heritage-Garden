'use strict';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Helpwall.css';
import { getUserFromStorage } from './utils.js';

const HelpWall = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [helpDescr, setHelpDescr] = useState('');
  const [bloodDonation, setBloodDonation] = useState(false);
  const [commentContent, setCommentContent] = useState(''); // State for comment content

  useEffect(() => {
    const token = getUserFromStorage();

    if (!token) {
      // Redirect to login if no user is found
      window.location.href = '/society/login';
      return;
    }

    setUser({ token }); // Setting the token in the user state

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4069/society/homepage/wall', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setPosts(response.data);
        console.log('Help posts fetched:', response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    const token = user.token;
    const newPost = { help_descr: helpDescr, bloodDonation };

    try {
      const response = await axios.post('http://localhost:4069/society/homepage/wall', newPost, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Create post response:', response.data);
      setPosts([...posts, response.data.helpPost]);
      setHelpDescr('');
      setBloodDonation(false);
      console.log('Help post created:', response.data.helpPost);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert(`Failed to create post: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const handleUpdatePost = async (postId, updatedDescription) => {
    const token = user.token;

    try {
      const response = await axios.put(`http://localhost:4069/society/homepage/wall/${postId}/update`, { description: updatedDescription }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      console.log('Help post updated:', response.data.helpPost);
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleResolvePost = async (postId) => {
    const token = user.token;

    try {
      const response = await axios.put(`http://localhost:4069/society/homepage/wall/${postId}/resolve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      console.log('Help post resolved:', response.data.helpPost);
    } catch (error) {
      console.error('Failed to resolve post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = user.token;

    try {
      await axios.delete(`http://localhost:4069/society/homepage/wall/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.filter(post => post._id !== postId));
      console.log('Help post deleted:', postId);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    const token = user.token;

    try {
      const response = await axios.post(`http://localhost:4069/society/homepage/wall/${postId}/comment`, { content: commentContent }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      setCommentContent(''); 
      console.log('Comment added:', response.data.helpPost);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleUpdateComment = async (postId, commentId, updatedContent) => {
    const token = user.token;

    try {
      const response = await axios.put(`http://localhost:4069/society/homepage/wall/${postId}/comment/${commentId}`, { content: updatedContent }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      console.log('Comment updated:', response.data.helpPost);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const token = user.token;

    try {
      const response = await axios.delete(`http://localhost:4069/society/homepage/wall/${postId}/comments/${commentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setPosts(posts.map(post => post._id === postId ? response.data.helpPost : post));
      console.log('Comment deleted:', response.data.helpPost);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const renderPosts = () => (
    <div className="posts-list">
      {posts.map(post => {
        console.log('Rendering post:', post); // Debugging log
        return (
          <div key={post._id} className="post-item">
            <p><strong>Description:</strong> {post.description || 'No description available'}</p>
            {post.bloodDonation && <p><strong>Blood Donation Needed</strong></p>}
            <p><strong>Posted by:</strong> {post.user?.name}</p>
            <p><strong>Flat Number:</strong> {post.user?.flatno}</p>
            <p><strong>Contact Number:</strong> {post.user?.contactno}</p>
            {user.id === post.user?._id && !post.resolve_status && (
              <div>
                <button onClick={() => handleUpdatePost(post._id, prompt('Update description:', post.description))}>Update</button>
                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                <button onClick={() => handleResolvePost(post._id)}>Resolve</button>
              </div>
            )}
            <div className="comments-section">
              {post.comments?.map(comment => (
                <div key={comment._id} className="comment-item">
                  <p>{comment.content || 'No content'}</p>
                  <p><strong>By:</strong> {comment.user?.name || 'Anonymous'}</p>
                  {user.id === comment.user?._id && (
                    <div>
                      <button onClick={() => handleUpdateComment(post._id, comment._id, prompt('Update comment:', comment.content))}>Update</button>
                      <button onClick={() => handleDeleteComment(post._id, comment._id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
              <textarea
                placeholder="Add a comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              ></textarea>
              <button onClick={() => handleAddComment(post._id)}>Submit Comment</button>
            </div>
          </div>
        );
      })}
    </div>
  );
  
  

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h2>HelpWall</h2>
        <div className="content-sections">
          <div className="create-post-section">
            <div className="create-post-form">
              <h3>Create a Help Post</h3>
              <label>
                Description:
                <textarea value={helpDescr} onChange={(e) => setHelpDescr(e.target.value)}></textarea>
              </label>
              <label>
                Blood Donation Needed: <input type="checkbox" checked={bloodDonation} onChange={(e) => setBloodDonation(e.target.checked)} />
              </label>
              <button onClick={handleCreatePost}>Create Post</button>
            </div>
          </div>
          <div className="view-posts-section">
            {renderPosts()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpWall;
