import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';

const CityForm = ({ onSubmit, initialData, buttonText }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nom_ville: '',
    description: '',
    photo_ville: null,
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (id) {
      const fetchCityData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/cities/${id}/`);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      photo_ville: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = id ? `http://localhost:8000/api/cities/${id}/` : 'http://localhost:8000/api/cities/';
    const method = id ? 'PUT' : 'POST';

    try {
      const form = new FormData();
      form.append('nom_ville', formData.nom_ville);
      form.append('description', formData.description);
      if (formData.photo_ville !== null) {
        form.append('photo_ville', formData.photo_ville);
      };

      const response = await fetch(url, {
        method,
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        if (onSubmit && typeof onSubmit === 'function') {
          onSubmit(data);
        } 
        
        setSuccessMessage('City updated successfully!');
        setErrorMessage(null);
      } else {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error('Error submitting city data:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error updating city. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Update City
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
              Update City
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CityForm;
