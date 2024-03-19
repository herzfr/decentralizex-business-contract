
import React from "react";
import { Card, Tab, Tabs } from 'react-bootstrap';

function CreateContract() {
    return (
        <Card>
            <Card.Body>
                <Tabs
                    defaultActiveKey="profile"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
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
}

export default CreateContract;