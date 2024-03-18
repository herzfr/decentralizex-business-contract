import React from "react";
import "./App.css";
import Navi from "./components/business-contract/navbar/navbar";
import { Container } from "react-bootstrap";
import Website from "./components/business-contract/website/website";
import Dashboard from "./components/business-contract/contract/dashboard/dashboard";

function CoreApp() {
  const isAuthenticated = window.auth.isAuthenticated
  console.log('isAuthenticated', isAuthenticated);

  return (
    <main >
      <Navi data={isAuthenticated} />
      <Container>
        {isAuthenticated ? <Dashboard /> : <Website />}
      </Container>
    </main>
  )
}

const App = function AppWrapper() {
  return <CoreApp />
};


export default App;
