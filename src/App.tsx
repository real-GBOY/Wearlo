import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTemplate } from './components/templates/PageTemplate/PageTemplate';
import { Landing } from './components/pages/Landing/Landing';
import { ProductDetails } from './components/pages/ProductDetails/ProductDetails';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <PageTemplate>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </PageTemplate>
      </Router>
    </ThemeProvider>
  );
}

export default App;