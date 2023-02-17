import { Button, Col, Form, Row } from "react-bootstrap";
import province from "../data/AddressData";
import { useState, useEffect } from "react";
import userContext from "../UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function GridComplexExample() {
    const navigate = useNavigate();
    const { user } = useContext(userContext);

    useEffect(() => {
        if (user.userId) {
            navigate("/courses");
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
            const response = await fetch(
                `${process.env.REACT_APP_APP_URL}/users/register`,
                requestOptions
            );
            if (response.ok) {
                Swal.fire({
                    title: "Successfully enrolled",
                    icon: "success",
                    text: "You have successfully enrolled for this course.",
                });
            } else if (response.status === 401) {
                Swal.fire({
                    title: "Duplicate email found",
                    icon: "error",
                    text: "This email address is already registered. Please use a different email address.",
                });
            } else {
                const errorMessage = await response.text();
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
        <Form className='mt-5' onSubmit={(e) => submitRegister(e)}>
            <Row className='mb-3'>
                <Form.Group as={Col} controlId='formGridFirstName'>
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                        type='text'
                        placeholder='Enter first name'
                    />
                </Form.Group>

                <Form.Group as={Col} controlId='formGridLastName'>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                        type='text'
                        placeholder='Last name'
                    />
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group controlId='mobileNo'>
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

                <Form.Group as={Col} controlId='formGridBarangay'>
                    <Form.Label>Barangay</Form.Label>
                    <Form.Control
                        onChange={(e) => setBarangay(e.target.value)}
                        value={barangay}
                        type='text'
                        placeholder='Barangay'
                    />
                </Form.Group>
            </Row>
            <Row className='mb-3'>
                <Form.Group as={Col} controlId='formGridEmail'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type='email'
                        placeholder='Enter email'
                    />
                </Form.Group>

                <Form.Group as={Col} controlId='formGridPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type='password'
                        placeholder='Password'
                    />
                </Form.Group>
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
            <Form.Group className='mb-3' controlId='formGridStreet'>
                <Form.Label>Street</Form.Label>
                <Form.Control
                    onChange={(e) => setStreet(e.target.value)}
                    value={street}
                    placeholder='1234 Main St'
                />
            </Form.Group>

            <Row className='mb-3'>
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

                <Form.Group as={Col} controlId='formGridZip'>
                    <Form.Label>Zip</Form.Label>
                    <Form.Control
                        onChange={(e) => setZipcode(e.target.value)}
                        value={zipcode}
                    />
                </Form.Group>
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

            <Button variant='primary' type='submit'>
                Submit
            </Button>
        </Form>
    );
}

export default GridComplexExample;
