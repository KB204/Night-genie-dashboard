import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';

const CategoriesForm = ({ onSubmit, initialData, buttonText }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    type: '',
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (id) {
      const fetchCityData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/categorie/api/category/${id}/`);
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

    const url = id ? `http://localhost:8000/categorie/api/category/${id}/` : 'http://localhost:8000/categorie/api/category/';
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
      setSuccessMessage('Category updated successfully!');

      // Clear the success message after a delay
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      setErrorMessage(null);
    } catch (error) {
      console.error('Error submitting Category data:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error updating Category. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Update Category
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
              label="Type"
              name="type"
              variant="outlined"
              margin="normal"
              required
              value={formData.type}
              onChange={handleChange}
            />
            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
              Update Category
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CategoriesForm;
