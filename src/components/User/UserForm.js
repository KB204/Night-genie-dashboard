import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';

const UserForm = ({ onSubmit, initialData, buttonText }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    email: '',
    comment: '',
    email2: '',
    review: '',
    stars: '',
    nom_coin:'',
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (id) {
      const fetchCityData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/utilisateurs/api/users/${id}/`);
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
          }
          const cityData = await response.json();
          setFormData(cityData);
        } catch (error) {
          console.error('Error fetching city data:', error.message);
        }
      };

      fetchCityData();
    }
  }, [initialData, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = id ? `http://localhost:8000/utilisateurs/api/users/${id}/` : 'http://localhost:8000/utilisateurs/api/users/';
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      onSubmit(data);
      setSuccessMessage('User updated successfully!');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error submitting User data:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error updating User. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Update User
          </Typography>
          {successMessage && (
            <div style={{ backgroundColor: 'lightgreen', padding: '8px', marginBottom: '16px' }}>
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div style={{ backgroundColor: 'lightcoral', padding: '8px', marginBottom: '16px' }}>
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
          <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Comment"
              name="comment"
              variant="outlined"
              margin="normal"
              required
              value={formData.comment}
              onChange={handleChange}
            />

             <TextField
              fullWidth
              label="Email2"
              name="email2"
              variant="outlined"
              margin="normal"
              required
              value={formData.email2}
              onChange={handleChange}
            />

             <TextField
              fullWidth
              label="Review"
              name="review"
              variant="outlined"
              margin="normal"
              required
              value={formData.review}
              onChange={handleChange}
            />

           <TextField
              fullWidth
              label="Stars"
              name="stars"
              variant="outlined"
              margin="normal"
              required
              value={formData.stars}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Place"
              name="nom_coin"
              variant="outlined"
              margin="normal"
              required
              value={formData.nom_coin}
              onChange={handleChange}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
              Update User
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default UserForm;
