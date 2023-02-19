import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ErrorPage404 = () => {
    return (
        <Container style={{ marginTop: "30vh" }}>
            <Row>
                <Col md={9} className='text-center'>
                    <h1>404</h1>
                    <h2>Page not found</h2>
                    <p>
                        The page you are looking for might have been removed, had its name
                        changed, or is temporarily unavailable.
                    </p>
                    <Button as={Link} to={"/"} variant='primary'>
                        Go to home page
                    </Button>
                </Col>
                <Col md={1} className='d-flex align-items-center justify-content-center'>
                    <img
                        src='https://www.google.com/images/errors/robot.png'
                        alt='Error 404'
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default ErrorPage404;
