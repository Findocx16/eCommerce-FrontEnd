import { useEffect, useState } from "react";
import { Card, Image, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import createSpinner from "./Spinner";

const Products = () => {
    const dimmer = createSpinner();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.body.appendChild(dimmer);

        fetch(`${process.env.REACT_APP_APP_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                if (!data.activeProducts) {
                    setProducts([]);
                    document.body.removeChild(dimmer);
                } else {
                    setProducts(data.activeProducts);
                    document.body.removeChild(dimmer);
                }
            });
    }, []);
    // return <></>;

    return (
        <div>
            <h1 style={{ marginTop: "3vh", marginBottom: "3vh" }} className='text-center'>
                Product list
            </h1>
            {!products.length ? (
                <h1
                    style={{ marginTop: "3vh", marginBottom: "3vh" }}
                    className='text-center'
                >
                    NO PRODUCTS TO DISPLAY
                </h1>
            ) : (
                <Row sm={1} md={2} lg={3}>
                    {products.map((product) => (
                        <Card
                            key={product._id}
                            className='my-1 p-0 text-dark text-decoration-none text-center'
                            as={Link}
                            to={`${product._id}`}
                        >
                            <Card.Header
                                style={{ backgroundColor: "orange", color: "#fff" }}
                                as='h5'
                            >
                                {product.productName}
                            </Card.Header>
                            <Card.Body>
                                <Row className='justify-content-center'>
                                    <Image
                                        src={`${product.productImage}`}
                                        style={{
                                            width: "450px",
                                            height: "300px",
                                            objectFit: "cover",
                                            marginBottom: "20px",
                                        }}
                                        fluid
                                    />
                                </Row>
                                <Card.Text>{product.productDescription}</Card.Text>
                                <Row>
                                    <Col>
                                        <Card.Title>Price:</Card.Title>
                                        <Card.Text>
                                            PhP {product.productPrice.toLocaleString()}
                                        </Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Title>Stocks:</Card.Title>
                                        <Card.Text
                                            className={
                                                product.stockCount < 15
                                                    ? "text-danger"
                                                    : "text-success"
                                            }
                                        >
                                            {product.stockCount.toLocaleString()}
                                        </Card.Text>
                                    </Col>
                                    <Col>
                                        <Card.Title>Sold:</Card.Title>
                                        <Card.Text>
                                            {product.soldCount.toLocaleString()}
                                        </Card.Text>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Products;
