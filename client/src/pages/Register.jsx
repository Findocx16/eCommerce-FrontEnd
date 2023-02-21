import { Button, Col, Container, Form, Row } from "react-bootstrap";
import province from "../data/AddressData";
import { useState, useEffect, useContext } from "react";
import userContext from "../UserContext";

import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function GridComplexExample() {
    const navigate = useNavigate();
    const { user } = useContext(userContext);

    useEffect(() => {
        if (user.userId) {
            Swal.fire({
                title: "User is currently login",
                icon: "error",
                text: "Please logout to use another account",
            });
            navigate("/");
        }
    });

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [street, setStreet] = useState("");
    const [barangay, setBarangay] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("");
    const [province1, setProvince1] = useState("");
    const [zipcode, setZipcode] = useState("");

    const handleProvinceChange = (e) => {
        setProvince1(e.target.value);
    };

    const municipalities = province1
        ? province.find((item) => item.province === province1).municipalities
        : [];

    const submitRegister = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                mobileNo: mobileNo,
                address: {
                    street: street,
                    barangay: barangay,
                    landmark: landmark,
                    city: city,
                    province: province1,
                    zipcode: zipcode,
                },
            }),
        };

        try {
            const res = await fetch(
                `${process.env.REACT_APP_APP_URL}/users/register`,
                requestOptions
            );
            if (res.ok) {
                await Swal.fire({
                    title: "Successfully enrolled",
                    icon: "success",
                    text: "You have successfully registered",
                });
                navigate("/login");
            } else if (res.status === 401) {
                Swal.fire({
                    title: "Duplicate email found",
                    icon: "error",
                    text: "This email address is already registered. Please use a different email address.",
                });
            } else {
                const errorMessage = await res.text();
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: errorMessage,
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Something went wrong",
                icon: "error",
                text: "Please try again.",
            });
        }
    };

    useEffect(() => {
        const isValid = /^\d{11}$/.test(mobileNo);
        document
            .getElementById("mobileNo")
            .setCustomValidity(
                isValid ? "" : "Please enter a valid 11-digit mobile number"
            );
    }, [mobileNo]);

    return (
        <Container className='mt-md-5 mt-lg-5'>
            <h1 className='text-center'>User Registration Form</h1>
            <Form className='mt-5' onSubmit={(e) => submitRegister(e)}>
                <Row className='mb-3'>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridFirstName'>
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                                type='text'
                                placeholder='Enter first name'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridLastName'>
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                type='text'
                                placeholder='Last name'
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className='mb-3'>
                    <Col sm={12} md={4}>
                        <Form.Group as={Col} controlId='formGridEmail'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                type='email'
                                placeholder='Enter email'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Group as={Col} controlId='formGridPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                type='password'
                                placeholder='Password'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Group as={Col} controlId='mobileNo'>
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='mobileNo'
                                value={mobileNo}
                                onChange={(e) => setMobileNo(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type='invalid'>
                                Please enter a valid 11-digit mobile number
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className='mb-3' controlId='formGridCountry'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Philippines'
                        aria-label='Country'
                        disabled
                        readOnly
                    />
                </Form.Group>

                <Row className='mb-3'>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridState'>
                            <Form.Label>Province</Form.Label>
                            <Form.Select
                                value={province1}
                                placeholder='Choose...'
                                onChange={handleProvinceChange}
                            >
                                <option>Choose...</option>
                                {province.map((item) => (
                                    <option key={item.province}>{item.province}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridCity'>
                            <Form.Label>City</Form.Label>
                            <Form.Select
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                                placeholder='Choose...'
                            >
                                {municipalities.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={4}>
                        <Form.Group as={Col} className='mb-3' controlId='formGridStreet'>
                            <Form.Label>Street</Form.Label>
                            <Form.Control
                                onChange={(e) => setStreet(e.target.value)}
                                value={street}
                                placeholder='1234 Main St'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Group as={Col} controlId='formGridBarangay'>
                            <Form.Label>Barangay</Form.Label>
                            <Form.Control
                                onChange={(e) => setBarangay(e.target.value)}
                                value={barangay}
                                type='text'
                                placeholder='Barangay'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={4}>
                        <Form.Group as={Col} controlId='formGridZip'>
                            <Form.Label>Zip</Form.Label>
                            <Form.Control
                                onChange={(e) => setZipcode(e.target.value)}
                                value={zipcode}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group as={Col} controlId='formGridLandmark'>
                    <Form.Label>Landmark</Form.Label>
                    <Form.Control
                        onChange={(e) => setLandmark(e.target.value)}
                        value={landmark}
                        type='text'
                        placeholder='Landmark'
                    />
                </Form.Group>
                <div className='text-center mt-3'>
                    <Form.Text className='text-muted'>
                        Already have an account?{" "}
                        <Link to={"/login"} className='text-decoration-none'>
                            Click here
                        </Link>{" "}
                        to log in.
                    </Form.Text>
                </div>
                <div className='text-center mt-1'>
                    <Button className='mt-3 px-5 py-2' variant='primary' type='submit'>
                        Register
                    </Button>
                </div>
            </Form>
        </Container>
        // </div>
    );
}

export default GridComplexExample;
