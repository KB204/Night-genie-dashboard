import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel,TextareaAutosize,Input } from '@mui/material';

const AddCoin = () => {
  const [formData, setFormData] = useState({
    nom_ville: '',
    type: '',
    nom_coin: '',
    emplacement: '',
    avis: '',
    rating:'',
    info:'',
    photo_coin: null,
    photo_menu: null,
    latitude:'',
    longitude:'',
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesResponse = await fetch('http://localhost:8000/api/cities/');
        const categoriesResponse = await fetch('http://localhost:8000/categorie/api/category/');

        if (!citiesResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch cities or categories');
        }

        const citiesData = await citiesResponse.json();
        const categoriesData = await categoriesResponse.json();

        setCities(citiesData);
        setCategories(categoriesData);
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
    formDataForUpload.append('nom_ville', formData.nom_ville);
    formDataForUpload.append('type', formData.type);
    formDataForUpload.append('nom_coin', formData.nom_coin);
    formDataForUpload.append('emplacement', formData.emplacement);
    formDataForUpload.append('avis', formData.avis);
    formDataForUpload.append('rating', formData.rating);
    formDataForUpload.append('info', formData.info);
    formDataForUpload.append('photo_coin', formData.photo_coin);
    if (formData.photo_menu !== null) {
      formDataForUpload.append('photo_menu', formData.photo_menu);
    }
    formDataForUpload.append('latitude', formData.latitude);
    formDataForUpload.append('longitude', formData.longitude);
  
    // Add city and category data to formDataForUpload
    formDataForUpload.append('City', formData.nom_ville); 
    formDataForUpload.append('category', formData.type);   
  
    try {
      const response = await fetch('http://localhost:8000/coin/api/coin/', {
        method: 'POST',
        body: formDataForUpload,
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }
  
      const data = await response.json();
      setSuccessMessage('Place added successfully!');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error adding place:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error adding place. Please try again.');
    }
  };
  

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Add Place
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
              <InputLabel htmlFor="nom_ville">City</InputLabel>
              <Select
                value={formData.nom_ville}
                onChange={handleChange}
                name="nom_ville"
                label="City"
                required
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>{city.nom_ville}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="type">Category</InputLabel>
              <Select
                value={formData.type}
                onChange={handleChange}
                name="type"
                label="Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.type}</MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <TextField
              fullWidth
              label="Location"
              name="emplacement"
              variant="outlined"
              margin="normal"
              required
              value={formData.emplacement}
              onChange={handleChange}
            />

            <TextareaAutosize
              aria-label="Review"
              minRows={3}
              placeholder="Review"
              name="avis"
              required
              value={formData.avis}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '16px', resize: 'vertical' }}
            />

            <TextField
              fullWidth
              label="Rating"
              name="rating"
              variant="outlined"
              margin="normal"
              required
              type="number"
              value={formData.rating}
              onChange={handleChange}
            />

            <TextareaAutosize
              aria-label="Info"
              minRows={3}
              placeholder="Info"
              name="info"
              required
              value={formData.info}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '16px', resize: 'vertical' }}
            />

            <TextField
              fullWidth
              label="Latitude"
              name="latitude"
              variant="outlined"
              margin="normal"
              required
              value={formData.latitude}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Longitude"
              name="longitude"
              variant="outlined"
              margin="normal"
              required
              value={formData.longitude}
              onChange={handleChange}
            />

        
<FormControl fullWidth>
  <InputLabel shrink htmlFor="photo_coin">
    Place image
  </InputLabel>
  <Input
    type="file"
    id="photo_coin"
    name="photo_coin"
    onChange={(e) => handleFileChange(e, 'photo_coin')}
    accept="image/*"
    style={{ marginTop: '8px' }}
  />
</FormControl>

<FormControl fullWidth>
  <InputLabel shrink htmlFor="photo_menu">
    Place Menu
  </InputLabel>
  <Input
    type="file"
    id="photo_menu"
    name="photo_menu"
    onChange={(e) => handleFileChange(e, 'photo_menu')}
    accept="image/*"
    style={{ marginTop: '8px' }}
  />
</FormControl>

            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
              Add Place
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default AddCoin;
