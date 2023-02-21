import { Button, Container, Form, Nav, Navbar, Offcanvas, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import userContext from "../UserContext";
import { useContext } from "react";
import Swal from "sweetalert2";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsSearch } from "react-icons/bs";

function Navigationbar() {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [search, setSearch] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordNew, setPasswordNew] = useState("");

    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_APP_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.activeProducts) {
                    setProducts([]);
                } else {
                    setProducts(data.activeProducts);
                }
            });
    }, []);
    function searchProducts(e) {
        e.preventDefault();
        const product = products.find((p) =>
            p.productName.toLowerCase().includes(search.toLowerCase())
        );

        if (!product) {
            Swal.fire({
                title: "No such product found",
                icon: "error",
                text: "Please try again",
            });
            setSearch("");
        } else {
            navigate(`${product._id}`);
            setSearch("");
        }
    }

    const changePassword = async () => {
        console.log(email);
        console.log(user.email);
        if (user.email === email) {
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
                if (res.ok) {
                    const res2 = await fetch(
                        `${process.env.REACT_APP_APP_URL}/users/details/update`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: JSON.stringify({
                                password: passwordNew,
                            }),
                        }
                    );

                    if (res2.ok) {
                        const data = await res2.json();
                        Swal.fire({
                            icon: "success",
                            title: "Password updated successfully!",
                            text: data.message,
                        });
                    } else {
                        const data = await res2.json();
                        throw new Error(data.message);
                    }
                }
                if (res.status === 400) {
                    Swal.fire({
                        icon: "error",
                        title: "Password not match",
                        text: "Password incorrect",
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Email not match",
                text: "Email incorrect",
            });
        }
    };
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlInput1'
                        >
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                                placeholder='Enter your email here'
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlInput2'
                        >
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                placeholder='Enter current password'
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlInput3'
                        >
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                onChange={(e) => setPasswordNew(e.target.value)}
                                type='password'
                                placeholder='Enter new password'
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        onClick={(e) => {
                            changePassword();
                            handleClose();
                        }}
                        variant='primary'
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Navbar key={"md"} expand={"md"} className='mb-3 bg-light'>
                <Container fluid>
                    <Navbar.Brand as={Link} to='/'>
                        E-SHOP
                    </Navbar.Brand>
                    {user.isAdmin ? (
                        <Button variant='outline-danger' as={NavLink} to='/users/admin'>
                            ADMIN DASHBOARD
                        </Button>
                    ) : user.userId ? (
                        <>
                            <Button
                                variant='outline-success'
                                as={NavLink}
                                to='/users/cart'
                                style={{ width: "10%", marginRight: "5px" }}
                            >
                                VIEW CART <AiOutlineShoppingCart />
                            </Button>
                            <Button
                                onClick={handleShow}
                                variant='outline-primary'
                                as={NavLink}
                                style={{ width: "12%" }}
                            >
                                CHANGE PASSWORD <CgProfile />
                            </Button>
                        </>
                    ) : null}

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
                                <Button
                                    style={{ width: "10%" }}
                                    variant='outline-warning'
                                    as={NavLink}
                                    to='/'
                                >
                                    Products
                                </Button>
                                {user.userId ? (
                                    <Button
                                        variant='outline-danger'
                                        as={NavLink}
                                        to='/logout'
                                        style={{ width: "10%", marginLeft: "10px" }}
                                    >
                                        Logout
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant='outline-primary'
                                            id='register'
                                            as={NavLink}
                                            to='/register'
                                            style={{ width: "10%", marginLeft: "10px" }}
                                        >
                                            Register
                                        </Button>
                                        <Button
                                            variant='outline-success'
                                            style={{ width: "10%", marginLeft: "10px" }}
                                            as={NavLink}
                                            to='/login'
                                        >
                                            Login
                                        </Button>
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
                            <Button
                                style={{ width: "10%" }}
                                onClick={searchProducts}
                                variant='outline-success'
                            >
                                Search <BsSearch />
                            </Button>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    );
}

export default Navigationbar;
