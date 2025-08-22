import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTemplate } from './components/templates/PageTemplate/PageTemplate';
import { DashboardTemplate } from './components/templates/DashboardTemplate/DashboardTemplate';
import { Landing } from './components/pages/Landing/Landing';
import { ProductDetails } from './components/pages/ProductDetails/ProductDetails';
import { Auth } from './components/pages/Auth/Auth';
import { Dashboard } from './components/pages/Dashboard/Dashboard';
import { ProductManagement } from './components/pages/ProductManagement/ProductManagement';
import { AddProduct } from './components/pages/AddProduct/AddProduct';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PageTemplate>
              <Landing />
            </PageTemplate>
          } />
          <Route path="/product/:id" element={
            <PageTemplate>
              <ProductDetails />
            </PageTemplate>
          } />
          <Route path="/auth" element={
            <PageTemplate>
              <Auth />
            </PageTemplate>
          } />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <DashboardTemplate>
              <Dashboard />
            </DashboardTemplate>
          } />
          <Route path="/dashboard/products" element={
            <DashboardTemplate>
              <ProductManagement />
            </DashboardTemplate>
          } />
          <Route path="/dashboard/products/new" element={
            <DashboardTemplate>
              <AddProduct />
            </DashboardTemplate>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;