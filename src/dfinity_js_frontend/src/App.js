import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap'
import Navi from "./components/business-contract/navbar/navbar";
import Website from "./components/business-contract/website/website";
import Dashboard from "./components/business-contract/contract/dashboard/dashboard";
import CreateContract from "./components/business-contract/contract/create-contract/create-contract";
import PaymentContract from "./components/business-contract/contract/payment-contract/payment-contract";
import "./App.css";
// import { getAuthClient } from "./utils/auth-client";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(window.auth.isAuthenticated);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
const PrivateRoute = ({ element: Element, ...rest }) => {
  const [narative, setNarative] = useState("")
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    narativeRoute(location.pathname)
  }, [narative])

  const narativeRoute = (path) => {
    switch (path) {
      case '/dashboard':
        setNarative("Monitor contract agreements with clients, list of contracts you have created and are currently running.")
        break;
      case '/create-contract':
        setNarative("Create your cooperation contract here, and save it to enter your work contract list on the dashboard page.")
        break;
      case '/payment-contract':
        setNarative("Make payment for your cooperation contract to the client or view the billing of your cooperation contract with the contracting party.")
        break;
      default:
        setNarative("")
        break;
    }
  }

  return (
    <Container fluid>
      <Row>
        <Col sm={3}>
          <div className="d-grid gap-2">
            <NavLink className='btn-navigation'
              to="/dashboard" activeclassname="active">
              Dashboard
            </NavLink>
            <NavLink className='btn-navigation'
              to="/create-contract" activeclassname="active">
              Create Contract
            </NavLink>
            <NavLink className='btn-navigation'
              to="/payment-contract" activeclassname="active">
              Payment Contract
            </NavLink>
          </div>
        </Col>
        <Col sm={9}>
          <Card className="mb-4">
            <Card.Body>{narative}</Card.Body>
          </Card>
          <div>
            {isAuthenticated ? <Element {...rest} /> : <Navigate to="/" />}
          </div>
        </Col>
      </Row>
    </Container>
  )
};

const App = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [principalText, setPrincipalText] = useState(null);
  const [whoamiActor, setWhoamiActor] = useState(null);

  useEffect(async () => {
    await fetchAuthIdentification()
  }, [])

  const fetchAuthIdentification = async () => {
    setPrincipalText(window.auth.principalText)
    setAuthClient(window.auth.client)
    setIdentity(window.auth.identity)
    setPrincipal(window.auth.principal)
    console.log(window.auth.isAuthenticated)
    console.log(window.auth.identity)
    console.log(window.auth.client)
    console.log(window.auth.principal)
    console.log(window.auth.principalText)
    console.log(window.canister.dcx)
    console.log(window.canister.ledger)
  };

  return (
    <main>
      <Router>
        <Navi isAuthenticated={isAuthenticated}
          principalText={principalText} />
        <Routes>
          <Route path='/' element={<Website />} />
          <Route path='/dashboard' element={<PrivateRoute element={Dashboard} />} />
          <Route path="/create-contract" element={<PrivateRoute element={CreateContract} />} />
          <Route path="/payment-contract" element={<PrivateRoute element={PaymentContract} />} />
        </Routes>
      </Router>
    </main>
  )
};

export default App;
