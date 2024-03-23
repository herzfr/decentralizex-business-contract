
import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Tab, Tabs } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'
import './dashboard.css'
import { getContractAplicant, getContractListHolder, getListHolder } from "../../../../utils/business-contract";
import Loader from "../../../utils/Loader";

function Dashboard() {
    const [badge, setBadge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contract, setContract] = useState([]);
    const [activeTab, setActiveTab] = useState('CONTRACTOR');
    const [isRegistered, setIsRegistered] = useState(false);
    const [contractor, setContractor] = useState({ index: 0, length: 10 });
    const [contractee, setContractee] = useState({ index: 0, length: 10 });

    useEffect(async () => {
        await badgeRead()
        await fetchData(activeTab);
    }, [activeTab, isRegistered]);


    const badgeRead = async () => {
        const badge = await getListHolder()
        setBadge(badge)
        if (badge) setIsRegistered(true)
        else setIsRegistered(false)
    }

    async function fetchData(mode) {
        setLoading(true);
        if (mode === 'CONTRACTOR') {
            const list = await getContractAplicant(contractor);
            setContract(list);
            console.log('list', list);
        } else {
            const list = await getContractListHolder({ contract_assigns: badge.contract_id, ...contractee });
            setContract(list);
            console.log('list', list);

        }
        setLoading(false);
    }

    function handleTabChange(tab) {
        setActiveTab(tab);
    }


    return (
        <Card>
            {
                isRegistered ? (
                    <Card.Body>
                        <Tabs
                            activeKey={activeTab}
                            onSelect={handleTabChange}
                            id="list-dcx-tab"
                            className="mb-3"
                            justify
                        >
                            <Tab className="dcx-tab-panel" eventKey="CONTRACTOR" title="Contractor">
                                {loading ? (<Loader />)
                                    : contract.length < 1 ? (
                                        <div className="dcx-content-panel">
                                            <div>
                                                <p>You haven't made a contract yet</p>
                                                <NavLink className='btn-navigation'
                                                    to="/create-contract">
                                                    Go to Create Contract
                                                </NavLink>
                                            </div>
                                        </div>
                                    )
                                        : (<p>List</p>)}
                            </Tab>
                            <Tab className="dcx-tab-panel" eventKey="CONTRACTEE" title="Contractee">
                                {loading ? (<Loader />)
                                    : contract.length < 1 ? (
                                        <div className="dcx-content-panel">
                                            <p>There is no contract assigned to you yet</p>
                                        </div>)
                                        : (<p>List</p>)}
                            </Tab>
                        </Tabs>
                    </Card.Body>
                ) : (
                    <Card>
                        <Card.Body>
                            <Card.Title>Welcome to DCX Business Contract</Card.Title>
                            <Card.Text>
                                Register first on the PARTIES page to determine your role.
                            </Card.Text>
                            <NavLink className='btn-navigation'
                                to="/parties">
                                Fo to Parties
                            </NavLink>
                        </Card.Body>
                    </Card>
                )
            }

        </Card>
    )
}
export default Dashboard;