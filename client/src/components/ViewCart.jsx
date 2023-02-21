import Swal from "sweetalert2";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import userContext from "../UserContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const PAGE_SIZE_MANY = 10;

const ViewCart = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const [orders, setOrders] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(orders.length / PAGE_SIZE_MANY);
    const startIndex = (currentPage - 1) * PAGE_SIZE_MANY;
    const endIndex = startIndex + PAGE_SIZE_MANY;
    const ordersForCurrentPage = orders.slice(startIndex, endIndex);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetch(`${process.env.REACT_APP_APP_URL}/users/orders`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCartTotal(data.orders.cartTotal);
                setOrders(data.orders.orders);
            });
    }, []);

    function updateOrderQuantity(product, event) {
        const newOrderQuantity = parseInt(event.target.value, 10);
        setOrders((prevState) =>
            prevState.map((order) => {
                if (order.products.some((p) => p.productName === product.productName)) {
                    const updatedProducts = order.products.map((p) =>
                        p.productName === product.productName
                            ? { ...p, quantity: newOrderQuantity }
                            : p
                    );
                    return { ...order, products: updatedProducts };
                }
                return order;
            })
        );
    }
    async function handleCheckout() {
        const result = await Swal.fire({
            title: "Are you sure you want to check-out all this product?",
            text: "You won't be able to revert this!",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, checkout!",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_APP_URL}/users/checkout`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    await Swal.fire({
                        icon: "success",
                        title: "Checkout successful",
                        text: data.message,
                    });
                    navigate("/users/checkout/history");
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Checkout failed",
                        text: data.message,
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong",
                    text: "Please try again later",
                });
            }
        }
    }
    async function handleSave() {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_APP_URL}/products/orders/${selectedOrder._id}/product/${selectedProduct.productId}/updateQuantity`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        quantity: orders
                            .find((p) => p._id === selectedOrder._id)
                            .products.find((q) => q._id === selectedProduct._id).quantity,
                    }),
                }
            );
            const data = await res.json();
            console.log(data);
            if (res.status === 200) {
                await Swal.fire({
                    icon: "success",
                    title: "Quantity updated",
                    text: data.message,
                });
                window.location.reload(false);
            } else if (res.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                });
            } else if (res.status === 401) {
                Swal.fire({
                    icon: "warning",
                    title: "Unauthorized",
                    text: data.message,
                });
            } else if (res.status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "Not Found",
                    text: data.message,
                });
            } else {
                throw new Error("An unknown error occurred");
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "There was an error updating the quantity",
            });
        }
    }

    const handleDelete = async (id) => {
        console.log(orders);
        const result = await Swal.fire({
            title: "Are you sure you want to delete this order?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_APP_URL}/users/orders/${id}/remove`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (res.ok) {
                    // Find the index of the order to delete
                    const indexToDelete = orders.findIndex((order) => order._id === id);

                    // Remove the order from the array
                    orders.splice(indexToDelete, 1);

                    await Swal.fire({
                        title: "Order deleted",
                        icon: "success",
                        text: res.message,
                    });
                    window.location.reload(false);
                } else {
                    Swal.fire({
                        title: "Error",
                        icon: "error",
                        text: "There was an error deleting the order",
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    return (
        <>
            <h1 style={{ marginTop: "3vh", marginBottom: "3vh" }} className='text-center'>
                {`${user.fullName}'s Order Cart`}
            </h1>
            <Table striped bordered hover>
                <thead className='bg-success text-light'>
                    <tr className='text-center'>
                        <th>Quantity</th>
                        <th>Product Name</th>
                        <th>Total</th>
                        <th>Date added</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {!orders.length ? (
                        <>
                            <tr className='text-center'>
                                <td colSpan='5'>CART IS EMPTY</td>
                            </tr>
                        </>
                    ) : (
                        <>
                            {ordersForCurrentPage.map((order, i) => {
                                return order.products.map((product, j) => {
                                    return (
                                        <tr key={`${i}-${j}`} className='text-center'>
                                            {selectedProduct &&
                                            selectedProduct._id === product._id ? (
                                                <>
                                                    <Modal
                                                        show={show}
                                                        onHide={handleClose}
                                                    >
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>
                                                                {product.productName}
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Form>
                                                                <Form.Group
                                                                    className='mb-3'
                                                                    controlId='exampleForm.ControlInput1'
                                                                >
                                                                    <Form.Label>
                                                                        Product Price
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        onChange={(e) =>
                                                                            updateOrderQuantity(
                                                                                product,
                                                                                e
                                                                            )
                                                                        }
                                                                        value={
                                                                            product.quantity
                                                                        }
                                                                        type='number'
                                                                        placeholder='Price'
                                                                        autoFocus
                                                                    />
                                                                </Form.Group>
                                                            </Form>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button
                                                                variant='secondary'
                                                                onClick={() => {
                                                                    handleClose();
                                                                    setSelectedProduct(
                                                                        null
                                                                    );
                                                                }}
                                                            >
                                                                Close
                                                            </Button>
                                                            <Button
                                                                variant='primary'
                                                                onClick={() => {
                                                                    handleClose();
                                                                    handleSave();
                                                                }}
                                                            >
                                                                Save Changes
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{product.quantity}</td>
                                                    <td>{product.productName}</td>
                                                    <td>{order.totalAmount}</td>
                                                    <td>
                                                        {new Date(
                                                            order.placedOrderOn
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant='outline-primary'
                                                            style={{
                                                                marginRight: "10px",
                                                            }}
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setSelectedProduct(
                                                                    product
                                                                );
                                                                handleShow();
                                                            }}
                                                        >
                                                            Update
                                                        </Button>
                                                        <Button
                                                            onClick={() => {
                                                                handleDelete(order._id);
                                                            }}
                                                            variant='outline-danger'
                                                            style={{
                                                                marginRight: "10px",
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    );
                                });
                            })}
                        </>
                    )}
                </tbody>
                <tfoot>
                    <tr className='text-center'>
                        <td colSpan='5' className='bg-success text-light'>
                            <strong>CART TOTAL: {cartTotal}</strong>
                        </td>
                    </tr>
                </tfoot>
            </Table>

            <nav style={{ display: "flex", justifyContent: "space-between" }}>
                <div className='text-center'>
                    <Button
                        onClick={handleCheckout}
                        disabled={!orders.length ? true : false}
                        variant='success'
                        style={{ fontSize: "30px", marginRight: "10px" }}
                    >
                        Checkout orders
                    </Button>
                    <Button
                        as={Link}
                        to={"/users/checkout/history"}
                        variant='warning'
                        style={{ fontSize: "30px" }}
                    >
                        Check order history
                    </Button>
                </div>
                <ul className='pagination'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li
                            key={page}
                            className={`page-item ${
                                page === currentPage ? "active" : ""
                            }`}
                        >
                            <button
                                className='page-link bg-success'
                                onClick={() => handlePageClick(page)}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};

export default ViewCart;
