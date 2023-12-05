import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CityList from './components/City/CityList';
import Dashboard from './components/Dashboard';
import AddCityForm from './components/City/AddCityForm';
import CityForm from './components/City/CityForm';
import UsersList from './components/User/UsersList';
import AddUser from './components/User/AddUser';
import UserForm from './components/User/UserForm';
import CategoriesList from './components/Category/CategoriesList';
import AddCategories from './components/Category/AddCategories';
import CategoriesForm from './components/Category/CategoriesForm';
import CoinList from './components/Coin/CoinList';
import AddCoin from './components/Coin/AddCoin';
import CoinForm from './components/Coin/CoinForm';
import LoginForm from './components/LoginForm';
import CoinAlbumList from './components/CoinAlbum/CoinAlbumList';
import AddCoinAlbum from './components/CoinAlbum/AddCoinAlbum';
import CoinAlbumForm from './components/CoinAlbum/CoinAlbumForm';
import EventList from './components/Events/EventList';
import AddEvent from  './components/Events/AddEvent';
import EventForm from  './components/Events/EventForm';
import EventAlbumList from './components/EventsAlbum/EventAlbumList';
import AddAlbums from './components/EventsAlbum/AddAlbums';
import EventAlbumForm from './components/EventsAlbum/EventAlbumForm';

const App = () => {
  const isAuthenticated = localStorage.getItem('access_token') !== null;

  return (
    <Router>
      <Routes>
        {!isAuthenticated && <Route path="/" element={<Navigate to="/login" />} />}
        
        <Route path="/login" element={<LoginForm />} />

        {isAuthenticated && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cities" element={<CityList />} />
            <Route path="/add-city" element={<AddCityForm />} />
            <Route path='/update-city/:id' element={<CityForm />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path='/update-user/:id' element={<UserForm />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/add-category" element={<AddCategories />} />
            <Route path='/update-category/:id' element={<CategoriesForm />} />
            <Route path="/Places" element={<CoinList />} />
            <Route path="/add-coin" element={<AddCoin />} />
            <Route path='/update-coin/:id' element={<CoinForm />} />
            <Route path="/PlacesAlbum" element={<CoinAlbumList />} />
            <Route path="/add-album" element={<AddCoinAlbum />} />
            <Route path='/update-album/:id' element={<CoinAlbumForm />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path='/update-event/:id' element={<EventForm />} />
            <Route path="/events-album" element={<EventAlbumList/>} />
            <Route path="/add-event-album" element={<AddAlbums />} />
            <Route path='/update-event-album/:id' element={<EventAlbumForm />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
