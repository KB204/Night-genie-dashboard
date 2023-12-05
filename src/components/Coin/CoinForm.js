import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel,TextareaAutosize,Input } from '@mui/material';

const CoinForm = ({ onSubmit, initialData, buttonText }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nom_ville: '',
    type: '',
    nom_coin: '',
    emplacement: '',
    avis: '',
    rating: '',
    info: '',
    photo_coin: null,
    photo_menu: null,
    latitude: '',
    longitude: '',
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

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

        if (id) {
          const coinResponse = await fetch(`http://localhost:8000/coin/api/coin/${id}/`);
          if (coinResponse.ok) {
            const coinData = await coinResponse.json();

            setSelectedCityId(coinData.City?.id || '');
            setSelectedCategoryId(coinData.category?.id || '');

            setFormData((prevData) => ({
              ...prevData,
              nom_ville: coinData.City || '',
              type: coinData.category || '',
              nom_coin: coinData.nom_coin,
              emplacement: coinData.emplacement,
              avis: coinData.avis,
              rating: coinData.rating,
              info: coinData.info,
              photo_coin: null,
              photo_menu: null,
              latitude: coinData.latitude,
              longitude: coinData.longitude,
            }));
          }
        } else if (initialData) {
          setSelectedCityId(initialData.nom_ville.id || '');
          setSelectedCategoryId(initialData.type.id || '');

          setFormData(initialData);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [initialData, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'nom_ville' ? cities.find(city => city.id === value) : 
              name === 'type' ? categories.find(category => category.id === value) :
              value, 
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

    const url = id ? `http://localhost:8000/coin/api/coin/${id}/` : 'http://localhost:8000/coin/api/coin/';
    const method = id ? 'PUT' : 'POST';

    try {
      const form = new FormData();
      form.append('nom_ville', formData.nom_ville);
      form.append('type', formData.type);
      form.append('nom_coin', formData.nom_coin);
      form.append('emplacement', formData.emplacement);
      form.append('avis', formData.avis);
      form.append('rating', formData.rating);
      form.append('info', formData.info);
      if (formData.photo_coin !== null) {
        form.append('photo_coin', formData.photo_coin);
      }
      if (formData.photo_menu !== null) {
        form.append('photo_menu', formData.photo_menu);
      }
      form.append('latitude', formData.latitude);
      form.append('longitude', formData.longitude);

      form.append('City', selectedCityId);
      form.append('category', selectedCategoryId);

      const response = await fetch(url, {
        method,
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        if (onSubmit && typeof onSubmit === 'function') {
          onSubmit(data);
        }

        setSuccessMessage('Place updated successfully!');
        setErrorMessage(null);
      } else {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error('Error submitting place data:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error updating place. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Edit Place
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
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
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
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
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
              Update Place
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CoinForm;
