
import React, { useEffect, useState } from "react";
import { Card, Tab, Tabs } from 'react-bootstrap';
import { CONTRACT_PAYLOAD } from "../../const/general";
import { getParties } from "../../../../utils/business-contract";
import { NavLink } from 'react-router-dom'

function CreateContract() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('CONTRACTOR');
    const [contract, setContract] = useState(CONTRACT_PAYLOAD)
    const [parties, setParties] = useState(null)

    useEffect(async () => {
        await getDcx()
    }, [])

    const getValueSelected = (props) => {
        if ('ORGANIZATIONS' in props) return props.ORGANIZATIONS
        if ('COMPANIES' in props) return props.COMPANIES
        return props.INDIVIDUALS
    }

    const getDcx = async () => {
        const parties = await getParties();
        if ('Ok' in parties) {
            let pts = parties.Ok
            setParties(pts)
        }
        if ('Err' in parties) setParties(null)
    }

    if (parties) {
        return (
            <Card>
                <Card.Body>
                    <Tabs
                        defaultActiveKey="profile"
                        id="justify-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="home" title="Home">
                            Tab content for Home
                        </Tab>
                        <Tab eventKey="profile" title="Profile">
                            Tab content for Profile
                        </Tab>
                        <Tab eventKey="longer-tab" title="Loooonger Tab">
                            Tab content for Loooonger Tab
                        </Tab>
                        <Tab eventKey="contact" title="Contact" disabled>
                            Tab content for Contact
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        )
    } else {
        return (
            <Card>
                <Card.Body>
                    <Card.Text>
                        Register first on the PARTIES page to determine your role.
                    </Card.Text>
                    <NavLink className='btn-navigation'
                        to="/parties">
                        Go to Parties
                    </NavLink>
                </Card.Body>
            </Card>
        )
    }


}

export default CreateContract;