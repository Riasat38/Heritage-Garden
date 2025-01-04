import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Feedback.css';

const Feedback = () => {
    return(
        <div className="page-container">
          <Sidebar />
          <div className="main-content">
            <header className="feedback-header">
              <h1>Feedback, Complaints and Suggestions</h1>
              <p>
                We, the residents of Heritage Garden, are more than a family. We are always trying to give you the best services possible. As you have chosen us to serve you, we are bound to answer you for any of your issues. We value your feedback, complaints and suggestions. Please fill out the form below and let us know how we can improve our services.
                //form goes here
              </p>
            </header>
          </div>    
        </div>  
    );
};
export default Feedback;