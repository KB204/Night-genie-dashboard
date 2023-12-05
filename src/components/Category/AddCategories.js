import React, { useState } from 'react';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';

const AddCategories = () => {
  const [formData, setFormData] = useState({
    type: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataForUpload = new FormData();
    formDataForUpload.append('type', formData.type);
    try {
      const response = await fetch('http://localhost:8000/categorie/api/category/', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      setSuccessMessage('Category added successfully!');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error adding Category:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error adding Category. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Add Category
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
              Add Category
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default AddCategories;
