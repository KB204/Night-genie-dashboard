import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
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
  TextField,
  TablePagination,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Navbar from '../Navbar';
import SearchIcon from '@mui/icons-material/Search';

const StyledTextField = styled(TextField)({
  width: '100%',
  backgroundColor: (theme) => theme.palette.common.white,
  borderRadius: (theme) => theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: (theme) => theme.palette.action.hover,
  },
});

const CoinList = () => {
  const [cities, setCities] = useState([]);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/coin/api/coin/');
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    // Perform the search based on the searchQuery
    const filteredCities = cities.filter((city) => {
      return (
        (typeof city.nom_ville === 'string' && city.nom_ville.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.type === 'string' && city.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.nom_coin === 'string' && city.nom_coin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.emplacement === 'string' && city.emplacement.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.avis === 'string' && city.avis.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.rating === 'string' && city.rating.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.info === 'string' && city.info.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.latitude=== 'string' && city.latitude.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (typeof city.longitude === 'string' && city.longitude.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  
    setCities(filteredCities);
  };
  

  const showDeleteConfirmation = () => {
    if (!cityToDelete) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${cityToDelete.nom_coin}.`,
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
      const response = await fetch(`http://localhost:8000/coin/api/coin/${cityToDelete.id}/`, {
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
      <Container style={{ marginTop: '30px', textAlign: 'center' }}>
      <StyledTextField
          label="Search"
          variant="outlined"
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          style={{ marginBottom: '30px' }}
        />
        <Button
          component={Link}
          to="/add-coin"
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px' }}
        >
          Add Place
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Place name</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Review</strong></TableCell>
                <TableCell><strong>Rating</strong></TableCell>
                <TableCell><strong>Info</strong></TableCell>
                <TableCell><strong>Place image</strong></TableCell>
                <TableCell><strong>Menu</strong></TableCell>
                <TableCell><strong>Latitude</strong></TableCell>
                <TableCell><strong>Longitude</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? cities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : cities
              ).map((city) => (
                <TableRow key={city.id}>
                  <TableCell>{city.nom_ville}</TableCell>
                  <TableCell>{city.type}</TableCell>
                  <TableCell>{city.nom_coin}</TableCell>
                  <TableCell>{city.emplacement}</TableCell>
                  <TableCell>{city.avis}</TableCell>
                  <TableCell>{city.rating}★</TableCell>
                  <TableCell>{city.info}</TableCell>
                  <TableCell>
                    {city.photo_coin ? (
                      <img src={`http://localhost:8000${city.photo_coin}`} alt={city.nom_coin} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    {city.photo_menu ? (
                      <img src={`http://localhost:8000${city.photo_menu}`} alt={city.nom_coin} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No Menu'
                    )}
                  </TableCell>
                  <TableCell>{city.latitude}</TableCell>
                  <TableCell>{city.longitude}</TableCell>

                  <TableCell>
                    <Button
                      component={Link}
                      to={`/update-coin/${city.id}`}
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Container>
    </>
  );
};

export default CoinList;
