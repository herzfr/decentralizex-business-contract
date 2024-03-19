import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navi from "./components/business-contract/navbar/navbar";
import Website from "./components/business-contract/website/website";
import Dashboard from "./components/business-contract/contract/dashboard/dashboard";
import "./App.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(window.auth.isAuthenticated);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />;
};

const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  return (
    <main>
      <Router>
        <Navi isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path='/' element={<Website />} />
          <Route path='/dashboard' element={<PrivateRoute element={Dashboard} />} />
        </Routes>
      </Router>
    </main>
  )
};

export default App;
