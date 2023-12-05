import React from 'react';
import { styled } from '@mui/system';
import { Routes, Route, Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CategoryIcon from '@mui/icons-material/Category';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import EventIcon from '@mui/icons-material/Event';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CityList from './City/CityList';
import UsersList from './User/UsersList';
import CategoriesList from './Category/CategoriesList';
import Navbar from './Navbar';
import CoinList from './Coin/CoinList';
import CoinAlbumList from './CoinAlbum/CoinAlbumList';
import EventList from './Events/EventList';
import EventsAlbums from './EventsAlbum/EventAlbumList';

const drawerWidth = 240;

const Root = styled('div')({
  display: 'flex',
});

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: drawerWidth,
}));

const DrawerStyled = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
});

const Content = styled('main')({
  flexGrow: 1,
  padding: (theme) => theme.spacing(3),
});

const Dashboard = () => {
  
  return (
    <Root>
      <CssBaseline />
      <AppBarStyled position="fixed">
      <Navbar />
      </AppBarStyled>
      <DrawerStyled variant="permanent">
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/users">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} to="/cities">
            <ListItemIcon>
              <LocationCityIcon />
            </ListItemIcon>
            <ListItemText primary="Cities" />
          </ListItem>
          <ListItem button component={Link} to="/categories">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categories" />
          </ListItem>
          <ListItem button component={Link} to="/places">
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Places" />
          </ListItem>
          <ListItem button component={Link} to="/PlacesAlbum">
            <ListItemIcon>
              <PhotoAlbumIcon />
            </ListItemIcon>
            <ListItemText primary="Coins Albums" />
          </ListItem>
          <ListItem button component={Link} to="/events">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
          <ListItem button component={Link} to="/events-album">
            <ListItemIcon>
              <PhotoAlbumIcon />
            </ListItemIcon>
            <ListItemText primary="Events Albums" />
          </ListItem>
        </List>
      </DrawerStyled>
      <Content>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/cities" element={<CityList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/places" element={<CoinList />} />
          <Route path="/placesAlbum" element={<CoinAlbumList />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/events-album" element={<EventsAlbums />} />
        </Routes>
      </Content>
    </Root>
  );
};

const Home = () => (
  <Container>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Welcome to the Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize your dashboard content here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Container>
);


export default Dashboard;
