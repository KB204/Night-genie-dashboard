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

const EventAlbumList = () => {
  const [cities, setCities] = useState([]);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/categorie/api/eventalbum/');
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
        (typeof city.name === 'string' && city.nom_coin.toLowerCase().includes(searchQuery.toLowerCase()))
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
      text: `You are about to delete ${cityToDelete.name}.`,
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
      const response = await fetch(`http://localhost:8000/categorie/api/eventalbum/${cityToDelete.id}/`, {
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
      console.error('Error deleting event album:', error.message);
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
          to="/add-event-album"
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px' }}
        >
          Add Album
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Event name</strong></TableCell>
                <TableCell><strong>Event image 1</strong></TableCell>
                <TableCell><strong>Event image 2</strong></TableCell>
                <TableCell><strong>Event image 3</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? cities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : cities
              ).map((city) => (
                <TableRow key={city.id}>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>
                    {city.img1 ? (
                      <img src={`http://localhost:8000${city.img1}`} alt={city.name} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    {city.img2 ? (
                      <img src={`http://localhost:8000${city.img2}`} alt={city.name} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    {city.img3 ? (
                      <img src={`http://localhost:8000${city.img3}`} alt={city.name} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/update-event-album/${city.id}`}
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

export default EventAlbumList;
