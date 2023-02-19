import { useEffect, useState } from "react";
import { Card, Image, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_APP_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.activeProducts);
            });
    });
    // return <></>;

    return (
        <Row sm={1} md={2} lg={3}>
            {products.map((product) => (
                <Card key={product._id}>
                    <Card.Header as='h5'>{product.productName}</Card.Header>
                    <Card.Body>
                        <Row className='justify-content-center'>
                            <Image
                                src='https://drive.google.com/uc?id=1AffvkxJLC3MMuJPL6D_UoJ2oUKLtfED5'
                                style={{
                                    width: "250px",
                                    height: "250px",
                                    objectFit: "cover",
                                    marginBottom: "20px",
                                }}
                                fluid
                            />
                        </Row>
                        <Card.Text>{product.productDescription}</Card.Text>
                        <Card.Title>Price:</Card.Title>
                        <Card.Text>
                            {" "}
                            PhP {product.productPrice.toLocaleString()}
                        </Card.Text>
                        <Card.Title>Stocks:</Card.Title>
                        <Card.Text>{product.stockCount.toLocaleString()}</Card.Text>
                        <Button
                            as={Link}
                            to={`/products/${product._id}`}
                            variant='primary'
                        >
                            Details
                        </Button>
                    </Card.Body>
                </Card>
            ))}
        </Row>
    );
};

export default Products;
