import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
} from '@mui/material';
import Navbar from '../Navbar';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [cityToDelete, setCityToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/cities/');
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
        }
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const showDeleteConfirmation = () => {
    if (!cityToDelete) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${cityToDelete.nom_ville}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirm();
      } else {
        setCityToDelete(null);
      }
    });
  };

  const handleDelete = (city) => {
    setCityToDelete(city);
    showDeleteConfirmation();
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/cities/${cityToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }

      setCities((prevCities) => prevCities.filter((city) => city.id !== cityToDelete.id));
      setCityToDelete(null);
    } catch (error) {
      console.error('Error deleting city:', error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '16px', textAlign: 'center' }}>
        <Button
          component={Link}
          to="/add-city"
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px' }}
        >
          Add City
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>City image</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cities.map(city => (
                <TableRow key={city.id}>
                  <TableCell>{city.nom_ville}</TableCell>
                  <TableCell>{city.description}</TableCell>
                  <TableCell>
                    {city.photo_ville ? (
                      <img src={`http://localhost:8000${city.photo_ville}`} alt={city.nom_ville} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/update-city/${city.id}`}
                      variant="outlined"
                      color="primary"
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      style={{ color: 'red', borderColor: 'red' }}
                      onClick={() => handleDelete(city)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default CityList;
