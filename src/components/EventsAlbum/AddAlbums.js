import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { Button, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel,Input } from '@mui/material';

const AddAlbums = () => {
  const [formData, setFormData] = useState({
    name: '',
    img1: null,
    img2: null,
    img3: null,
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesResponse = await fetch('http://localhost:8000/categorie/api/event/');

        if (!citiesResponse.ok ) {
          throw new Error('Failed to fetch coin');
        }

        const citiesData = await citiesResponse.json();
        
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
  
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: file || null, 
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataForUpload = new FormData();
    formDataForUpload.append('name', formData.name);
    formDataForUpload.append('img1', formData.img1);
    if (formData.img2 !== null) {
      formDataForUpload.append('img2', formData.img2);
    }

    
    if (formData.img3  !== null) {
        formDataForUpload.append('img3 ', formData.img3);
    }

    formDataForUpload.append('event', formData.name);   
  
    try {
      const response = await fetch('http://localhost:8000/categorie/api/eventalbum/', {
        method: 'POST',
        body: formDataForUpload,
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }
  
      const data = await response.json();
      setSuccessMessage('Album added successfully!');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error adding album:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error adding album. Please try again.');
    }
  };
  

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Add Album
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
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Event</InputLabel>
              <Select
                value={formData.name}
                onChange={handleChange}
                name="name"
                label="event"
                required
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>{city.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

           

        
                      <FormControl fullWidth>
                          <InputLabel shrink htmlFor="img1">
                              Image 1
                          </InputLabel>
                          <Input
                              type="file"
                              id="img1"
                              name="img1"
                              onChange={(e) => handleFileChange(e, 'img1')}
                              accept="image/*"
                              style={{ marginTop: '8px' }}
                          />
                      </FormControl>

                      <FormControl fullWidth>
                          <InputLabel shrink htmlFor="img2">
                              Image 2
                          </InputLabel>
                          <Input
                              type="file"
                              id="img2"
                              name="img2"
                              onChange={(e) => handleFileChange(e, 'img2')}
                              accept="image/*"
                              style={{ marginTop: '8px' }}
                          />
                      </FormControl>

                      <FormControl fullWidth>
                          <InputLabel shrink htmlFor="img3">
                              Image 3
                          </InputLabel>
                          <Input
                              type="file"
                              id="img3"
                              name="img3"
                              onChange={(e) => handleFileChange(e, 'img3')}
                              accept="image/*"
                              style={{ marginTop: '8px' }}
                          />
                      </FormControl>

            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
              Add Album
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default AddAlbums;
