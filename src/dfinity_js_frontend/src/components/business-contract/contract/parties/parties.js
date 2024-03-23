
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form, CardText } from 'react-bootstrap';
import RichTextEditor from "../../helper/editor";
import { validateRequired } from '../../const/validation'; // Import validation functions
import { ROLE } from "../../const/general";
import AlertComponent from "../../helper/alert";
import { getParties, registerParties } from "../../../../utils/business-contract";
import './parties.css'

function Parties() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        legal_name: '',
        address: '',
        identification_information: '',
        type_parties: ROLE.length > 0 ? ROLE[0].value : ''
    });
    const [errors, setErrors] = useState({});
    const [selectedRole, setSelectedRole] = useState(null);
    const [alert, setAlert] = useState(false)
    const [alertmessage, setAlertMessage] = useState({
        head: '',
        message: '',
        type: ''
    })

    const validationRules = {
        legal_name: [validateRequired],
        address: [validateRequired],
        type_parties: [validateRequired],
    };

    const getValueSelected = (props) => {
        if ('ORGANIZATIONS' in props) return props.ORGANIZATIONS
        if ('COMPANIES' in props) return props.COMPANIES
        return props.INDIVIDUALS
    }

    const getDcx = async () => {
        const parties = await getParties();
        if ('Ok' in parties) {
            let pts = parties.Ok
            setFormData({
                legal_name: pts.legal_name,
                address: pts.address,
                identification_information: pts.identification_information,
                type_parties: getValueSelected(pts.type_parties),
            })
        }
    }

    useEffect(async () => {
        setLoading(true)
        await getDcx().finally(() => {
            setLoading(false)
            setSelectedRole(ROLE[0].value.toString());
        })
        hasErrors();
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newErrors = { ...errors };
        validationRules[name].forEach((validator) => {
            const error = validator(value, name);
            if (error) {
                newErrors[name] = error;
            } else {
                delete newErrors[name]; // Remove error if input is valid
            }
        });
        setErrors(newErrors);
        if (name === 'type_parties') setSelectedRole(value)
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleInputChangeTextEditor = (html, name) => {
        const value = html; // For RichTextEditor, html is the value
        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform validation
        const newErrors = {};
        Object.keys(validationRules).forEach((fieldName) => {
            validationRules[fieldName].forEach((validator) => {
                const error = validator(formData[fieldName], fieldName);
                if (error) {
                    newErrors[fieldName] = error;
                }
            });
        });
        // Set errors if any, else submit form
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            // Handle form submission logic here, e.g., send data to server
            let payload = formData
            payload.type_parties = { [formData.type_parties]: formData.type_parties }
            postDcx(payload)
        }
    };

    const hasErrors = () => {
        return Object.keys(errors).length > 0 || loading;
    };

    const postDcx = async (payload) => {
        setLoading(true)
        const parties = await registerParties(payload);
        if ('Ok' in parties) {
            showAlert('Success Updated', 'Your parties has been updated', 'success')
            await getDcx()
            setLoading(false)
            return;
        }

        if ('Err' in parties) showAlert('Error Updated!', parties.Err, 'danger')
        setLoading(false)
        return;
    }

    const showAlert = (head, msg, typ) => {
        setAlertMessage({ head: head, message: msg, type: typ })
        setAlert(true)
        setTimeout(() => {
            dropAlert()
        }, 3000)
    }

    const dropAlert = () => {
        setAlert(false)
        setAlertMessage({ head: '', message: '', type: '' })
    }


    return (
        <Container className="p-0" style={{ display: 'grid', gap: '10px' }} fluid>
            {alert && (
                <AlertComponent head={alertmessage.head} message={alertmessage.message} type={alertmessage.type} onClick={dropAlert} />)}
            <Row>
                <Col sm={6}>
                    <Card>
                        <Card.Header className="dcx-header">UPDATE YOUR PARTIES HERE</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formData.type_parties">
                                            <Form.Label className="dcx-text-001" size="sm">Role</Form.Label>
                                            <Form.Select className="dcx-text-001" size="sm" aria-label="Your Role"
                                                name="type_parties"
                                                value={formData.type_parties || ''}
                                                onChange={handleInputChange}>
                                                {ROLE.map((role) => (
                                                    <option key={role.value} value={role.value}>{role.label}</option>
                                                ))}
                                            </Form.Select>
                                            {errors.type_parties && <p className="text-danger dcx-text-error">Role is Required!</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formData.legal_name">
                                            <Form.Label className="dcx-text-001" size="sm">Legal Name</Form.Label>
                                            <Form.Control className="dcx-text-001" size="sm" type="text"
                                                placeholder={`Input your ${selectedRole ? selectedRole.toLowerCase() : ''} legal name`}
                                                name="legal_name"
                                                value={formData.legal_name}
                                                onChange={handleInputChange} />
                                            {errors.legal_name && <p className="text-danger dcx-text-error">Legal Name is Required!</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3" controlId="formData.address">
                                    <Form.Label className="dcx-text-001" size="sm">Address</Form.Label>
                                    <Form.Control className="dcx-text-001" size="sm" as="textarea" rows={3}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange} />
                                    {errors.address && <p className="text-danger dcx-text-error">Address is Required!</p>}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formData.identification_information">
                                    <Form.Label className="dcx-text-001" size="sm">Information</Form.Label>
                                    <RichTextEditor
                                        name="identification_information"
                                        value={formData.identification_information}
                                        onChange={handleInputChangeTextEditor} />
                                </Form.Group>
                                <Button type="submit" variant="dcx-primary" disabled={hasErrors()}>{loading ? 'Loading...' : 'Save'}</Button>
                            </Form>
                        </Card.Body>
                    </Card >
                </Col>
                <Col sm={6}>
                    <Card className="box-display-plain">
                        <Card.Header className="dcx-header">{selectedRole} LETTER</Card.Header>
                        <Card.Body>
                            <Card.Title style={{ fontSize: '14px' }}>{formData.legal_name !== '' ? formData.legal_name : 'Legan Name'}</Card.Title>
                            <Card.Text style={{ fontSize: '12px' }}>
                                {formData.address !== '' ? formData.address : 'Ex. Here will be displayed the address that will be filled in the left column of the form.'}
                            </Card.Text>
                            <div style={{ fontSize: 'smaller' }} dangerouslySetInnerHTML={{ __html: formData.identification_information }} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Parties;