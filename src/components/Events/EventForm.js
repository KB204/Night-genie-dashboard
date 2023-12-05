import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { TextField, Button, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel,TextareaAutosize,Input } from '@mui/material';

const CoinForm = ({ onSubmit, initialData, buttonText }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nom_ville: '',
    type: '',
    name: '',
    adress: '',
    description: '',
    rating:'',
    link:'',
    photo_events: null,
    date:'',
    latitude:'',
    longitude:'',
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
          const coinResponse = await fetch(`http://localhost:8000/categorie/api/event/${id}/`);
          if (coinResponse.ok) {
            const coinData = await coinResponse.json();

            setSelectedCityId(coinData.City?.id || '');
            setSelectedCategoryId(coinData.category?.id || '');

            setFormData((prevData) => ({
              ...prevData,
              nom_ville: coinData.City || '',
              type: coinData.category || '',
              name: coinData.name,
              adress: coinData.adress,
              description: coinData.description,
              rating: coinData.rating,
              link: coinData.link,
              date: coinData.date,
              photo_events: null,
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

    const url = id ? `http://localhost:8000/categorie/api/event/${id}/` : 'http://localhost:8000/categorie/api/event/';
    const method = id ? 'PUT' : 'POST';

    try {
      const form = new FormData();
      form.append('nom_ville', formData.nom_ville);
      form.append('type', formData.type);
      form.append('name', formData.name);
      form.append('adress', formData.adress);
      form.append('description', formData.description);
      form.append('rating', formData.rating);
      form.append('link', formData.link);
      form.append('date', formData.date);
      if (formData.photo_events !== null) {
        form.append('photo_events', formData.photo_events);
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

        setSuccessMessage('Event updated successfully!');
        setErrorMessage(null);
      } else {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error('Error submitting event data:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error updating event. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Edit Event
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
              label="Event"
              name="name"
              variant="outlined"
              margin="normal"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Location"
              name="adress"
              variant="outlined"
              margin="normal"
              required
              value={formData.adress}
              onChange={handleChange}
            />

            <TextareaAutosize
              aria-label="Review"
              minRows={3}
              placeholder="Review"
              name="description"
              required
              value={formData.description}
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

            <TextField
              fullWidth
              label="Link"
              name="link"
              variant="outlined"
              margin="normal"
              required
              value={formData.link}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              name="date"
              variant="outlined"
              margin="normal"
              required
              type="date"
              value={formData.date}
              onChange={handleChange}
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
                 <InputLabel shrink htmlFor="photo_events">
                      Event image
                  </InputLabel>
                 <Input
                   type="file"
                   id="photo_events"
                   name="photo_events"
                   onChange={(e) => handleFileChange(e, 'photo_events')}
                   accept="image/*"
                  style={{ marginTop: '8px' }}
                />
            </FormControl>

            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
              Update Event
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CoinForm;
