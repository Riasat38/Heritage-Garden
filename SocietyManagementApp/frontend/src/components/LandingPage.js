import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

function LandingPage() {
  const [rentalListings, setRentalListings] = useState([]);
  const [recruitmentPosts, setRecruitmentPosts] = useState([]);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleForgetPassword = () => { 
    navigate('/register'); 
  };

  useEffect(() => {
    const fetchRentalListings = async () => {
      try {
        const response = await axios.get('http://localhost:4055/society/homepage/rent-post');
        setRentalListings(response.data);
      } catch (error) {
        console.error('Error fetching rental listings:', error);
      }
    };

    const fetchRecruitmentPosts = async () => { 
      try { 
        const response = await axios.get('http://localhost:4055/society/adminPanel/recruitments'); 
        setRecruitmentPosts(response.data); 
      } catch (error) { 
        console.error('Error fetching recruitment posts:', error); 
      }
    };

    fetchRentalListings();
    fetchRecruitmentPosts();
  }, []);

  return (
    <div className="landing-page">
      <div className="welcome-banner">
        <h2>Welcome to the Official Website of Heritage Garden!</h2>
        <p>Everything you need in one Platform!</p>
      </div>
      
      <div className="auth-options">
        <button className="auth-button" onClick={handleLogin}>Login</button>
        <button className="auth-button" onClick={handleRegister}>Register</button>
        <p className="forget-password" onClick={handleForgetPassword}>Forgot Password?</p>
      </div>
      
      <div className="rentals-section">
        <h2>Flats for Rent</h2>
        {rentalListings.length === 0 ? (
          <p>No flats available for rent at the moment.</p>
        ) : (
          rentalListings.map((rental) => (
            <div key={rental.id} className="rental-item">
              <p><strong>Rent Amount:</strong> {rental.rent_amount}</p>
              <p><strong>Available From:</strong> {new Date(rental.availablefrom).toLocaleDateString()}</p>
              <p><strong>Flat Number:</strong> {rental.flat}</p>
              <p><strong>Description:</strong> {rental.description}</p>
              <p><strong>Contact:</strong> {rental.contact}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="recruitment-section"> 
        <h2>Recruitment Posts for Staff</h2>   
        {recruitmentPosts.length === 0 ? ( 
          <p>No recruitment posts available at the moment.</p> 
          ) : ( 
            recruitmentPosts.map((post) => ( 
            <div key={post.id} className="recruitment-item"> 
            <p><strong>Job Position:</strong> {post.jobPosition}</p> 
            <p><strong>Description:</strong> {post.description}</p> 
            <p><strong>Contact:</strong> {post.contact}</p> 
            <p><strong>Deadline:</strong> {new Date(post.deadline).toLocaleDateString()}</p> 
          </div> 
        )) 
      )} 
    </div>



    </div>
  );
}

export default LandingPage;
