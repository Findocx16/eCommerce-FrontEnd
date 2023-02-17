// S52 Activity
import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";

import { Navigate } from "react-router-dom";
import userContext from "../UserContext";
import Swal from "sweetalert2";

export default function Login() {
    const { user, setUser } = useContext(userContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

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

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: `Welcome back ${user.fullName}`,
                });

                setEmail("");
                setPassword("");
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
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    useEffect(() => {
        // Validation to enable submit button when all fields are populated.
        setIsActive(email !== "" && password !== "");
    }, [email, password]);

    return user.userId !== null ? (
        <Navigate to='/courses' />
    ) : (
        <Form onSubmit={(e) => authenticate(e)}>
            <Form.Group controlId='userEmail'>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Form.Text className='text-muted'>
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId='password1'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            {isActive ? (
                <Button variant='success' type='submit' id='submitBtn'>
                    Submit
                </Button>
            ) : (
                <Button variant='success' type='submit' id='submitBtn' disabled>
                    Submit
                </Button>
            )}
        </Form>
    );
}
