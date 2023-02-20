import userContext from "../UserContext";
import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

const ProductDetails = () => {
    const { user } = useContext(userContext);
    const { productId } = useParams();
    const [products, setProducts] = useState("");
    useEffect(() => {
        fetch(`${process.env.REACT_APP_APP_URL}/products/${productId}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.product);
            });
    }, [productId]);
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
                                <div className='col-md-6'>
                                    <Card.Img
                                        variant='top'
                                        src='https://drive.google.com/uc?id=1AffvkxJLC3MMuJPL6D_UoJ2oUKLtfED5'
                                    />
                                </div>
                                <div className='col-md-6 mt-5'>
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
                        disabled={user.isAdmin ? true : false}
                        variant='primary'
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
