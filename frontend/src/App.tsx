import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Buildings from './pages/Buildings';
import ApartmentOwners from './pages/ApartmentOwners';
import Payments from './pages/Payments';

function App() {
  return (
    <Router>
      <Layout>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/apartment-owners" element={<ApartmentOwners />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </Container>
      </Layout>
    </Router>
  );
}

export default App; 