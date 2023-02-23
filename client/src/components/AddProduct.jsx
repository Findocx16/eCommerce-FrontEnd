import Swal from "sweetalert2";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useState } from "react";
import createSpinner from "./Spinner";

export default function AddProduct() {
    const dimmer = createSpinner();
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productStock, setProductStock] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productLink, setProductLink] = useState("");

    async function submitAddProduct() {
        document.body.appendChild(dimmer);
        await fetch(`${process.env.REACT_APP_APP_URL}/products/addproduct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                productName: productName,
                productDescription: productDescription,
                productPrice: productPrice,
                stockCount: productStock,
                productImage: productLink,
            }),
        })
            .then(async (res) => {
                console.log(res);
                if (res.status === 200) {
                    document.body.removeChild(dimmer);
                    await Swal.fire({
                        title: "Product added successfully",
                        icon: "success",
                    });
                    window.location.reload(false);
                } else if (res.status === 400) {
                    document.body.removeChild(dimmer);
                    const errorMessage = await res.json();
                    await Swal.fire({
                        title: "Error",
                        icon: "error",
                        text: errorMessage.message,
                    });
                } else if (res.status === 401) {
                    document.body.removeChild(dimmer);
                    await Swal.fire({
                        title: "User is not authorized",
                        icon: "error",
                        text: "Please log in as an admin to add a product",
                    });
                } else {
                    document.body.removeChild(dimmer);
                    const errorMessage = await res.text();
                    await Swal.fire({
                        title: "Something went wrong",
                        icon: "error",
                        text: errorMessage,
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.message,
                });
            });
    }

    return (
        <>
            <h1 style={{ marginTop: "3vh", marginBottom: "3vh" }} className='text-center'>
                Add Product
            </h1>
            <Form>
                <Row className='mb-3'>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridProductName'>
                            <Form.Label>Product name</Form.Label>
                            <Form.Control
                                onChange={(e) => setProductName(e.target.value)}
                                value={productName}
                                required
                                type='text'
                                placeholder='Name'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridDescription'>
                            <Form.Label>Product description</Form.Label>
                            <Form.Control
                                onChange={(e) => setProductDescription(e.target.value)}
                                value={productDescription}
                                required
                                type='text'
                                placeholder='Description'
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridPrice'>
                            <Form.Label>Product price</Form.Label>
                            <Form.Control
                                onChange={(e) => setProductPrice(e.target.value)}
                                value={productPrice}
                                required
                                type='number'
                                placeholder='Price'
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                        <Form.Group as={Col} controlId='formGridStock'>
                            <Form.Label>Stock count</Form.Label>
                            <Form.Control
                                onChange={(e) => setProductStock(e.target.value)}
                                value={productStock}
                                required
                                type='number'
                                placeholder='Stocks'
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group as={Col} controlId='formGridLink'>
                    <Form.Label>Product image link</Form.Label>
                    <Form.Control
                        onChange={(e) => setProductLink(e.target.value)}
                        value={productLink}
                        required
                        type='text'
                        placeholder='Link'
                    />
                </Form.Group>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={submitAddProduct} className='mt-3' variant='primary'>
                        Add product
                    </Button>
                </div>
            </Form>
        </>
    );
}
