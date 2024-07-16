import React from 'react';
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import UserList from '../pages/Users/Users';

const AppRoutes = () => {
  return (
    <Router>
      <RouterRoutes>
        <Route path="/" element={<Login />} />
        <Route path="/userlist" element={<UserList />} />
      </RouterRoutes>
    </Router>
  );
}

export default AppRoutes;
