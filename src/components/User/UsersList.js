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

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/utilisateurs/api/users/');
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const showDeleteConfirmation = () => {
    if (!userToDelete) {
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${userToDelete.email}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirm();
      } else {
        setUserToDelete(null);
      }
    });
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    showDeleteConfirmation();
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8000/utilisateurs/api/users/${userToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status} (${response.statusText})`);
      }

      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Container style={{ marginTop: '16px', textAlign: 'center' }}>
        <Button
          component={Link}
          to="/add-user"
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px' }}
        >
          Add User
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>EMAIL</strong></TableCell>
                <TableCell><strong>Comment</strong></TableCell>
                <TableCell><strong>Email2</strong></TableCell>
                <TableCell><strong>Review</strong></TableCell>
                <TableCell><strong>Stars</strong></TableCell>
                <TableCell><strong>Place</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.comment}</TableCell>
                  <TableCell>{user.email2}</TableCell>
                  <TableCell>{user.review}</TableCell>
                  <TableCell>{user.stars}</TableCell>
                  <TableCell>{user.nom_coin}</TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/update-user/${user.id}`}
                      variant="outlined"
                      color="primary"
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      style={{ color: 'red', borderColor: 'red' }}
                      onClick={() => handleDelete(user)}
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

export default UsersList;
