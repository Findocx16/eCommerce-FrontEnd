import { Button, Container, Form, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function OffcanvasExample() {
    const [user, setUser] = useState(localStorage.getItem("email"));

    // useEffect(() => {
    //     if (!user) {
    //         document.querySelector("#login").style.display = "block";
    //         document.querySelector("#logout").style.display = "none";
    //         document.querySelector("#register").style.display = "block";
    //     } else {
    //         document.querySelector("#login").style.display = "none";
    //         document.querySelector("#register").style.display = "none";
    //         document.querySelector("#logout").style.display = "block";
    //     }
    // }, [user]);

    return (
        <>
            <Navbar key={"md"} bg='light' expand={"md"} className='mb-3'>
                <Container fluid>
                    <Navbar.Brand as={Link} to='/'>
                        Zuitt
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${"md"}`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-${"md"}`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-${"md"}`}
                        placement='end'
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${"md"}`}>
                                Offcanvas
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className='justify-content-end flex-grow-1 pe-3'>
                                <Nav.Link as={NavLink} to='/'>
                                    Home
                                </Nav.Link>
                                <Nav.Link as={NavLink} to='/courses'>
                                    Courses
                                </Nav.Link>
                                {user ? (
                                    <Nav.Link as={NavLink} to='/logout'>
                                        Logout
                                    </Nav.Link>
                                ) : (
                                    <>
                                        <Nav.Link
                                            id='register'
                                            as={NavLink}
                                            to='/register'
                                        >
                                            Register
                                        </Nav.Link>
                                        <Nav.Link id='login' as={NavLink} to='/login'>
                                            Login
                                        </Nav.Link>
                                    </>
                                )}
                            </Nav>
                            <Form className='d-flex'>
                                <Form.Control
                                    type='search'
                                    placeholder='Search'
                                    className='me-2'
                                    aria-label='Search'
                                />
                                <Button variant='outline-success'>Search</Button>
                            </Form>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}

export default OffcanvasExample;
