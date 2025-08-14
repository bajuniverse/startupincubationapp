import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { addFeedback } from '../../services/feedbackService';
import { toast } from 'react-toastify';

const FeedbackForm = ({ applicationId, onFeedbackAdded }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please add a comment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        comment,
        rating: rating || null
      };
      
      const response = await addFeedback(applicationId, feedbackData, user.token);
      
      setComment('');
      setRating(0);
      toast.success('Feedback submitted successfully');
      
      // Notify parent component to refresh feedback list
      if (onFeedbackAdded) {
        onFeedbackAdded(response);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Add Feedback</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Your Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your feedback..."
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Rating (Optional)</Form.Label>
            <div className="d-flex">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <div key={i} className="me-2">
                    <FaStar
                      size={24}
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                );
              })}
              {rating > 0 && <span className="ms-2">{rating} of 5</span>}
            </div>
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting || !comment.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm;