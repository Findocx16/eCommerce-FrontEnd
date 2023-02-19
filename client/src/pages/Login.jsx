// S52 Activity
import { useState, useEffect, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";

import { Navigate } from "react-router-dom";
import userContext from "../UserContext";
import Swal from "sweetalert2";

export default function Login() {
    const { user, setUser } = useContext(userContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function authenticate(e) {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_APP_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const data = await response.json();
            if (typeof data.message !== "undefined") {
                localStorage.setItem("token", data.message);
                await retrieveUserDetails(data.message);
            } else {
                Swal.fire({
                    title: "Authentication Failed",
                    icon: "error",
                    text: "Please, check your login details and try again.",
                });
            }
        } catch (error) {
            console.error("Authentication failed:", error);
            Swal.fire({
                title: "Authentication Failed",
                icon: "error",
                text: "An error occurred while trying to authenticate. Please, try again later.",
            });
        }
    }

    async function retrieveUserDetails(token) {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_APP_URL}/users/details`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setUser({
                fullName: `${data.user.firstName} ${data.user.lastName}`,
                userId: data.user._id,
                isAdmin: data.user.isAdmin,
            });
            Swal.fire({
                title: "Login Successful",
                icon: "success",
                text: `Welcome back ${data.user.firstName}`,
            });

            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    useEffect(() => {
        // Validation to enable submit button when all fields are populated.
        setIsActive(email !== "" && password !== "");
    }, [email, password]);

    return user.userId !== null ? (
        <Navigate to='/products' />
    ) : (
        <Container>
            <h1
                style={{ marginTop: "15vh", marginBottom: "5rem" }}
                className='text-center'
            >
                User Login
            </h1>

            <Form onSubmit={(e) => authenticate(e)}>
                <Form.Group controlId='userEmail' className='mb-2'>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Form.Text className='text-muted '>
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId='password1' className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className='mt-2'>
                        <Form.Check
                            type='switch'
                            id='view-password-switch'
                            label='Show password'
                            onChange={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </Form.Group>

                {isActive ? (
                    <Button
                        className='py-2 px-4'
                        variant='success'
                        type='submit'
                        id='submitBtn'
                    >
                        Submit
                    </Button>
                ) : (
                    <Button
                        className='py-2 px-4'
                        variant='success'
                        type='submit'
                        id='submitBtn'
                        disabled
                    >
                        Submit
                    </Button>
                )}
            </Form>
        </Container>
    );
}
