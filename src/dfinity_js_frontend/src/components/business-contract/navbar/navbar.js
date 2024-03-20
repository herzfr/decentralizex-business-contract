import React, { useEffect, useState } from "react";
import { Button, Container, Navbar, Dropdown } from "react-bootstrap";
import './navbar.css'
import { loginIc, logoutIc } from "../../../utils/auth-client";
import Loader from "../../utils/Loader";
import { useNavigate } from 'react-router-dom';

function Navi({ isAuthenticated, principalText }) {
    const [loading, setLoading] = useState(false)
    const [principal, setPrincipal] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true)
        setPrincipal(truncatePrincipal(principalText))
        setLoading(false)
        return () => { };
    }, [principalText]);

    async function login() {
        await loginIc();
    }

    async function logout() {
        await logoutIc();
    }

    function truncatePrincipal(princl) {
        if (princl) {
            const prcpl = `${princl.toString().substring(0, 8)}....`;
            return prcpl;
        } else {
            return "";
        }
    }

    return (
        <Navbar sticky="top" className="bg-body-tertiary nav-height">
            <Container fluid>
                <Navbar.Brand href="/">DCX Business Contract</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end" style={{ maxWidth: '20%' }} >
                    {isAuthenticated ? loading ? (<Loader />) : (
                        <Dropdown>
                            <Dropdown.Toggle variant="dcx-primary" id="dropdown-basic">
                                Principal: {principal}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/dashboard')}>Dashboard</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button variant="outline-success" onClick={login}>Login <img className="img-logo" src="/assets/img/internet-computer-icp-logo.png" alt="DFINITY logo" /></Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navi;