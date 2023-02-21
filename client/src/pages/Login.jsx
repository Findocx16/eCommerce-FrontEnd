import { useState, useEffect, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";

import { Navigate, Link, useNavigate } from "react-router-dom";
import userContext from "../UserContext";
import Swal from "sweetalert2";

export default function Login() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function authenticate(e) {
        e.preventDefault();
        const dimmer = document.createElement("div");
        dimmer.style =
            "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;";
        const spinner = document.createElement("div");
        spinner.innerHTML = `
          <div class="d-flex justify-content-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        `;
        dimmer.appendChild(spinner);
        document.body.appendChild(dimmer);
        try {
            const res = await fetch(`${process.env.REACT_APP_APP_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const data = await res.json();

            if (typeof data.message !== "undefined") {
                document.body.removeChild(dimmer);
                localStorage.setItem("token", data.message);
                await retrieveUserDetails(data.message);
            }
            if (res.status === 404) {
                document.body.removeChild(dimmer);
                await Swal.fire({
                    title: "User not found",
                    icon: "error",
                    text: "Please try to register first",
                });
                navigate("/register");
                localStorage.clear();
            }
            if (res.status === 400) {
                document.body.removeChild(dimmer);
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: data.message,
                });
                localStorage.clear();
            }
        } catch (error) {
            Swal.fire({
                title: "Authentication Failed",
                icon: "error",
                text: "An error occurred while trying to authenticate. Please, try again later.",
            });
        }
    }

    async function retrieveUserDetails(token) {
        try {
            const res = await fetch(`${process.env.REACT_APP_APP_URL}/users/details`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            setUser({
                fullName: `${data.user.firstName} ${data.user.lastName}`,
                userId: data.user._id,
                isAdmin: data.user.isAdmin,
                email: data.user.email,
            });

            if (res.ok) {
                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: `Welcome back ${data.user.firstName}`,
                });

                setEmail("");
                setPassword("");
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }

    useEffect(() => {
        setIsActive(email !== "" && password !== "");
    }, [email, password]);

    return user.userId !== null ? (
        <Navigate to='/' />
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

                    <div className='text-center'>
                        <Form.Text className='text-muted'>
                            Don't have an account yet?{" "}
                            <Link to={"/register"} className='text-decoration-none'>
                                Click here
                            </Link>{" "}
                            to register.
                        </Form.Text>
                    </div>
                </Form.Group>
                <div className='text-center'>
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
                </div>
            </Form>
        </Container>
    );
}
