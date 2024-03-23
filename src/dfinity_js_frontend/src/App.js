import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap'
import Navi from "./components/business-contract/navbar/navbar";
import Website from "./components/business-contract/website/website";
import Dashboard from "./components/business-contract/contract/dashboard/dashboard";
import CreateContract from "./components/business-contract/contract/create-contract/create-contract";
import PaymentContract from "./components/business-contract/contract/payment-contract/payment-contract";
import Parties from "./components/business-contract/contract/parties/parties"
import DESC_ROUTE from "./components/business-contract/const/general"
import "./App.css";
import { getListHolder, readBadge } from "./utils/business-contract";
import Loader from "./components/utils/Loader";
import AlertComponent from "./components/business-contract/helper/alert";


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
const PrivateRoute = ({ element: Element, principal, ...rest }) => {
  const [narative, setNarative] = useState("")
  const [badge, setBadge] = useState(null);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(async () => {
    narativeRoute(location.pathname)
    const bdg = await badgeRead()
    if (bdg) setBadge(bdg)
  }, [location.pathname])

  const narativeRoute = (path) => {
    setNarative(DESC_ROUTE.find(f => f.url === path).description)
  }

  const badgeRead = async () => {
    const badge = await getListHolder()
    setBadge(badge)
  }

  const readbadge = async () => {
    const badge = await readBadge()
    if (badge === null) setBadge(badge)
  }

  return (
    <Container fluid>
      <Row className="content-row">
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
            <NavLink className='btn-navigation'
              to="/parties" activeclassname="active">
              Parties
            </NavLink>
          </div>
        </Col>
        <Col sm={9}>
          <Card className="main-card mb-4">
            <Card.Body>
              {badge !== null && badge.badge ?
                (<AlertComponent type={"info"} message={badge.message} head={"Info!"} onClick={readbadge} />)
                : (<p>{narative}</p>)}
            </Card.Body>
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
  const [loading, setLoading] = useState(true); // Track loading state
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [principalText, setPrincipalText] = useState(null);
  const [whoamiActor, setWhoamiActor] = useState(null);

  useEffect(async () => {
    await fetchAuthIdentification()
    setLoading(false)
  }, [])

  const fetchAuthIdentification = async () => {
    console.log('APP fetchAuthIdentification run');
    await new Promise(resolve => {
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
      setTimeout(resolve, 1000)
    });
  };

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Router>
        <Navi className="nav-height" isAuthenticated={isAuthenticated}
          principalText={principalText} />
        {
          loading ? (<div className="dcx-loading-general"><Loader /></div>) : (
            <div className="content-height">
              <Routes>
                <Route path='/' element={<Website />} />
                <Route path='/dashboard' element={<PrivateRoute element={Dashboard} />} />
                <Route path="/create-contract" element={<PrivateRoute element={CreateContract} />} />
                <Route path="/payment-contract" element={<PrivateRoute element={PaymentContract} />} />
                <Route path="/parties" element={<PrivateRoute element={Parties} principal={principal} />} />
              </Routes>
            </div>
          )
        }
      </Router>
    </main>
  )
};

export default App;
