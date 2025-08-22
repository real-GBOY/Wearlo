import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTemplate } from './components/templates/PageTemplate/PageTemplate';
import { Landing } from './components/pages/Landing/Landing';
import { ProductDetails } from './components/pages/ProductDetails/ProductDetails';
import { Auth } from './components/pages/Auth/Auth';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <PageTemplate>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </PageTemplate>
      </Router>
    </ThemeProvider>
  );
}

export default App;