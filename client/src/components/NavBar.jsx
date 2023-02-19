import { Button, Container, Form, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import userContext from "../UserContext";
import { useContext } from "react";
import Swal from "sweetalert2";

function Navigationbar() {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [search, setSearch] = useState("");

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_APP_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.activeProducts);
            });
    }, []);
    function searchProducts(e) {
        e.preventDefault();
        const product = products.find(
            (p) => p.productName.toLowerCase() === search.toLowerCase()
        );
        if (!product) {
            Swal.fire({
                title: "No such product found",
                icon: "error",
                text: "Please try again",
            });
            setSearch("");
        } else {
            navigate(`products/${product._id}`);
        }
    }
    function showLoginAlert() {
        Swal.fire({
            title: "Login first",
            icon: "error",
            text: "Please login first for better experience",
        });
    }

    return (
        <>
            <Navbar key={"md"} bg='light' expand={"md"} className='mb-3'>
                <Container fluid>
                    {user.userId ? (
                        <Navbar.Brand as={Link} to='/'>
                            EJAY
                        </Navbar.Brand>
                    ) : (
                        <Navbar.Brand as={Link} to='/products' onClick={showLoginAlert}>
                            EJAY
                        </Navbar.Brand>
                    )}
                    {user.isAdmin ? (
                        <Button variant='outline-danger' as={NavLink} to='/users/admin'>
                            ADMIN DASHBOARD
                        </Button>
                    ) : (
                        ""
                    )}

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
                                {user.userId ? (
                                    <Nav.Link as={NavLink} to='/'>
                                        Home
                                    </Nav.Link>
                                ) : (
                                    <Nav.Link
                                        as={NavLink}
                                        to='/products'
                                        onClick={showLoginAlert}
                                    >
                                        Home
                                    </Nav.Link>
                                )}
                                <Nav.Link as={NavLink} to='/products'>
                                    Products
                                </Nav.Link>
                                {user.userId ? (
                                    <Button
                                        variant='outline-danger'
                                        as={NavLink}
                                        to='/logout'
                                    >
                                        Logout
                                    </Button>
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
                            <Form className='d-flex' onSubmit={searchProducts}>
                                <Form.Control
                                    type='search'
                                    placeholder='Search'
                                    className='me-2'
                                    aria-label='Search'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Form>
                            <Button onClick={searchProducts} variant='outline-success'>
                                Search
                            </Button>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}

export default Navigationbar;
