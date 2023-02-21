import userContext from "../UserContext";
import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const ProductDetails = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const { productId } = useParams();
    const [products, setProducts] = useState("");
    const [quantityNum, setQuantity] = useState(1);

    const increment = () => setQuantity(quantityNum + 1);

    const decrement = () => {
        if (quantityNum > 0) {
            setQuantity(quantityNum - 1);
        }
    };
    useEffect(() => {
        fetch(`${process.env.REACT_APP_APP_URL}/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.product);
            });
    }, [productId]);

    async function addToCart() {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_APP_URL}/products/${productId}/addtocart`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        quantity: quantityNum,
                    }),
                }
            );
            const data = await res.json();
            if (res.status === 200) {
                await Swal.fire({
                    title: "Success!",
                    text: "Product added to cart.",
                    icon: "success",
                });
                navigate("/");
            }
            if (res.status === 400) {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                });
            }
            if (res.status === 404) {
                Swal.fire({
                    title: "Not found 404",
                    text: data.message,
                    icon: "error",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "An error occurred. Please try again.",
                icon: "error",
            });
        }
    }

    return (
        <Container>
            <Row style={{ marginTop: "10vh" }}>
                <Col lg={{ span: 6, offset: 3 }}>
                    <Card>
                        <Card.Body>
                            <Card.Header className='text-center' as='h5'>
                                {products.productName}
                            </Card.Header>
                            <div className='row'>
                                <div className='col-md-6 mt-5'>
                                    <Card.Img variant='top' src={products.productImage} />
                                </div>
                                <div className='col-md-6 mt-3'>
                                    <Card.Text>
                                        <strong>Details: </strong>
                                        {products.productDescription}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Price (in PHP): </strong>
                                        {products.productPrice}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Available Stock Count: </strong>
                                        {products.stockCount}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Total Sold Count: </strong>
                                        {products.soldCount}
                                    </Card.Text>
                                    <Form.Group className='px-4 py-2'>
                                        <div className='text-center'>
                                            <Form.Label>
                                                {" "}
                                                <strong>Quantity</strong>
                                            </Form.Label>
                                        </div>
                                        <div className='d-flex'>
                                            <Button variant='danger' onClick={decrement}>
                                                -
                                            </Button>
                                            <Form.Control
                                                type='number'
                                                value={quantityNum}
                                                readOnly
                                                className='text-center'
                                            />
                                            <Button variant='success' onClick={increment}>
                                                +
                                            </Button>
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className='d-flex justify-content-center mt-3'>
                {!user.userId ? (
                    <Button
                        variant='outline-primary'
                        size='lg'
                        block
                        as={Link}
                        to='/login'
                    >
                        Log in to buy
                    </Button>
                ) : (
                    <Button
                        onClick={addToCart}
                        disabled={user.isAdmin ? true : false}
                        size='lg'
                        block
                    >
                        Add to cart
                    </Button>
                )}
            </div>
        </Container>
    );
};

export default ProductDetails;
