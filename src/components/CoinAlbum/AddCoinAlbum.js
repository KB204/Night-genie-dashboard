import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { Button, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel,Input } from '@mui/material';

const AddCoinAlbum = () => {
  const [formData, setFormData] = useState({
    nom_coin: '',
    image1: null,
    image2: null,
    image3: null,
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesResponse = await fetch('http://localhost:8000/coin/api/coin/');

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
    formDataForUpload.append('nom_coin', formData.nom_coin);
    formDataForUpload.append('image1', formData.image1);
    if (formData.image2 !== null) {
      formDataForUpload.append('image2', formData.image2);
    }

    
    if (formData.image3  !== null) {
        formDataForUpload.append('image3 ', formData.image3);
    }

    formDataForUpload.append('coin', formData.nom_coin);   
  
    try {
      const response = await fetch('http://localhost:8000/coin/api/coinalbum/', {
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
              <InputLabel htmlFor="nom_coin">Place</InputLabel>
              <Select
                value={formData.nom_coin}
                onChange={handleChange}
                name="nom_coin"
                label="coin"
                required
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>{city.nom_coin}</MenuItem>
                ))}
              </Select>
            </FormControl>

           

        
                      <FormControl fullWidth>
                          <InputLabel shrink htmlFor="image1">
                              Image 1
                          </InputLabel>
                          <Input
                              type="file"
                              id="image1"
                              name="image1"
                              onChange={(e) => handleFileChange(e, 'image1')}
                              accept="image/*"
                              style={{ marginTop: '8px' }}
                          />
                      </FormControl>

                      <FormControl fullWidth>
                          <InputLabel shrink htmlFor="image2">
                              Image 2
                          </InputLabel>
                          <Input
                              type="file"
                              id="image2"
                              name="image2"
                              onChange={(e) => handleFileChange(e, 'image2')}
                              accept="image/*"
                              style={{ marginTop: '8px' }}
                          />
                      </FormControl>

                      <FormControl fullWidth>
                          <InputLabel shrink htmlFor="image3">
                              Image 3
                          </InputLabel>
                          <Input
                              type="file"
                              id="image3"
                              name="image3"
                              onChange={(e) => handleFileChange(e, 'image3')}
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

export default AddCoinAlbum;
