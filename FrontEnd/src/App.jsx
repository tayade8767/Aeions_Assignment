/* eslint-disable no-unused-vars */


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Componants/Login';
import Register from './Componants/Register';
import Home from './Componants/Home';
import ProtectedRoute from './Componants/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
