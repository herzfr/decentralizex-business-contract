import React, { createContext, useContext, useState, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Fragment>
        <Navi isAuthenticated={isAuthenticated} />
        <Routes>
          <Route exact path='/' element={<PrivateRoute />}>
            <Route exact path='/dashboard' element={<Dashboard />} />
          </Route>
          <Route exact path='/' element={<Website />} />
        </Routes>
      </Fragment>
    </Router>
  )
};

export default App;
