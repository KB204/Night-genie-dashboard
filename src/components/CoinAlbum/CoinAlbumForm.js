import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { Button, Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel,Input } from '@mui/material';

const CoinAlbumForm = ({ onSubmit, initialData, buttonText }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nom_coin: '',
    image1: null,
    image2: null,
    image3: null,
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesResponse = await fetch('http://localhost:8000/coin/api/coin/');
        
        if (!citiesResponse.ok) {
          throw new Error('Failed to fetch cities or categories');
        }

        const citiesData = await citiesResponse.json();
      
        setCities(citiesData);
        
        if (id) {
          const coinResponse = await fetch(`http://localhost:8000/coin/api/coinalbum/${id}/`);
          if (coinResponse.ok) {
            const coinData = await coinResponse.json();

            setSelectedCityId(coinData.coin?.id || '');

            setFormData((prevData) => ({
              ...prevData,
              nom_coin: coinData.nom_coin,
              image1: null,
              image2: null,
              image3: null,
            }));
          }
        } else if (initialData) {
          setSelectedCityId(initialData.nom_coin.id || '');

          setFormData(initialData);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [initialData, id]);

 
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: file || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = id ? `http://localhost:8000/coin/api/coinalbum/${id}/` : 'http://localhost:8000/coin/api/coinalbum/';
    const method = id ? 'PUT' : 'POST';

    try {
      const form = new FormData();
      form.append('nom_coin', formData.nom_coin);
      if (formData.image1 !== null) {
        form.append('image1', formData.image1);
      }
      
      if (formData.image2 !== null) {
        form.append('image2', formData.image2);
      }

      if (formData.image3 !== null) {
        form.append('image3', formData.image3);
      }
      
      form.append('coin', selectedCityId);

      const response = await fetch(url, {
        method,
        body: form,
      });

      if (response.ok) {
        const data = await response.json();
        if (onSubmit && typeof onSubmit === 'function') {
          onSubmit(data);
        }

        setSuccessMessage('Album updated successfully!');
        setErrorMessage(null);
      } else {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }
    } catch (error) {
      console.error('Error submitting album data:', error.message);
      setSuccessMessage(null);
      setErrorMessage('Error updating album. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="md">
        <Paper elevation={3} style={{ padding: '16px', marginTop: '32px' }}>
          <Typography variant="h5" component="div" style={{ marginBottom: '16px' }}>
            Edit Album
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
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
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
              Update Album
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default CoinAlbumForm;
