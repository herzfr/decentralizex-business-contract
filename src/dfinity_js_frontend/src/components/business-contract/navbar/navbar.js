import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import './navbar.css'
import { loginIc } from "../../../utils/auth-client";

async function login() {
    await loginIc();
}

function Navi({ isAuthenticated }) {
    return (
        <Navbar sticky="top" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">DCX Business Contract</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end" style={{ maxWidth: '20%' }} >
                    {isAuthenticated ? (
                        <Navbar.Text>
                            Signed in as: <a href="#login">Mark Otto</a>
                        </Navbar.Text>
                    ) : (
                        <Button variant="outline-success" onClick={login}>Login <img className="img-logo" src="/assets/img/internet-computer-icp-logo.png" alt="DFINITY logo" /></Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navi;