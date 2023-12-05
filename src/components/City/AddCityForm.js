import React, { useState } from 'react';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';

const AddCityForm = () => {
  const [formData, setFormData] = useState({
    nom_ville: '',
    description: '',
    photo_ville: null,
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      photo_ville: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataForUpload = new FormData();
    formDataForUpload.append('nom_ville', formData.nom_ville);
    formDataForUpload.append('description', formData.description);
    if (formData.photo_ville) {
      formDataForUpload.append('photo_ville', formData.photo_ville);
    }

    try {
      const response = await fetch('http://localhost:8000/api/cities/', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      setSuccessMessage('City added successfully!');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error adding city:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error adding city. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Add City
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
              label="Name"
              name="nom_ville"
              variant="outlined"
              margin="normal"
              required
              value={formData.nom_ville}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              variant="outlined"
              margin="normal"
              required
              value={formData.description}
              onChange={handleChange}
            />
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="photo_ville">City image:</label>
              <input
                type="file"
                id="photo_ville"
                name="photo_ville"
                onChange={handleFileChange}
                accept="image/*"
                style={{ marginLeft: '8px' }}
              />
            </div>
            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
              Add City
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default AddCityForm;
