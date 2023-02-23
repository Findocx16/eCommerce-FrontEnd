import { useEffect, useState } from "react";
import { Button, Form, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddProduct from "../components/AddProduct";
import createSpinner from "../components/Spinner";

const PAGE_SIZE_MANY = 4;
const PAGE_SIZE_FEW = 1;

const AdminDashboard = () => {
    const dimmer = createSpinner();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [idAdmin, setIdAdmin] = useState("");

    const [addProduct, setAddProduct] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(
        products.length / (!addProduct ? PAGE_SIZE_MANY : PAGE_SIZE_FEW)
    );
    const start = (currentPage - 1) * (!addProduct ? PAGE_SIZE_MANY : PAGE_SIZE_FEW);
    const end = start + (!addProduct ? PAGE_SIZE_MANY : PAGE_SIZE_FEW);
    const currentProducts = products.slice(start, end);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const [showTextField, setShowTextField] = useState(false);

    const handleToggleTextField = () => {
        setShowTextField(!showTextField);
    };

    function updateProductName(product, event) {
        const newProductName = event.target.value;
        setProducts((prevState) =>
            prevState.map((p) =>
                p._id === product._id ? { ...p, productName: newProductName } : p
            )
        );
    }

    function updateProductDescription(product, event) {
        const newProductDescription = event.target.value;
        setProducts((prevState) =>
            prevState.map((p) =>
                p._id === product._id
                    ? { ...p, productDescription: newProductDescription }
                    : p
            )
        );
    }

    function updateStockCount(product, event) {
        const newStockCount = parseInt(event.target.value, 10);
        setProducts((prevState) =>
            prevState.map((p) =>
                p._id === product._id ? { ...p, stockCount: newStockCount } : p
            )
        );
    }

    function updateProductPrice(product, event) {
        const newProductPrice = parseInt(event.target.value, 10);
        setProducts((prevState) =>
            prevState.map((p) =>
                p._id === product._id ? { ...p, productPrice: newProductPrice } : p
            )
        );
    }

    async function updateProduct(productID, updates) {
        const res = await fetch(
            `${process.env.REACT_APP_APP_URL}/products/${productID}/update`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(updates),
            }
        );

        const data = await res.json();

        if (res.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    }
    async function archive(id) {
        document.body.appendChild(dimmer);
        try {
            const updates = {
                isActive: false,
            };

            const res = await updateProduct(id, updates);
            console.log(res);
            if (res.message) {
                document.body.removeChild(dimmer);
                await Swal.fire({
                    title: "Product archived",
                    icon: "success",
                    text: `Archived successfully`,
                });

                window.location.reload(false);
            } else {
                document.body.removeChild(dimmer);
                await Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "There was an error updating the product",
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "Error",
                icon: "error",
                text: error.message,
            });

            console.log(error);
        }
    }
    async function unArchive(id) {
        document.body.appendChild(dimmer);

        try {
            const updates = {
                isActive: true,
            };

            const res = await updateProduct(id, updates);
            console.log(res);
            if (res.message) {
                document.body.removeChild(dimmer);
                await Swal.fire({
                    title: "Product unarchived",
                    icon: "success",
                    text: `Unarchived successfully`,
                });

                window.location.reload(false);
            } else {
                document.body.removeChild(dimmer);
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "There was an error updating the product",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: error.message,
            });

            console.log(error);
        }
    }

    async function handleAddAdmin() {
        document.body.appendChild(dimmer);
        try {
            const res = await fetch(
                `${process.env.REACT_APP_APP_URL}/users/${idAdmin}/create/admin`,
                {
                    method: "PATCH",
                    headers: {
                        "Context-type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.status === 200) {
                document.body.removeChild(dimmer);
                await Swal.fire("Success!", "Admin added successfully.", "success");

                window.location.reload(false);
            } else if (res.status === 400) {
                document.body.removeChild(dimmer);
                await Swal.fire(
                    "Error!",
                    "Bad request. Please check your input and try again.",
                    "error"
                );
            } else if (res.status === 401) {
                document.body.removeChild(dimmer);
                await Swal.fire(
                    "Error!",
                    "Unauthorized. Please log in and try again.",
                    "error"
                );
            } else if (res.status === 404) {
                document.body.removeChild(dimmer);
                await Swal.fire(
                    "Error!",
                    "User not found. Please check your input and try again.",
                    "error"
                );
            } else {
                document.body.removeChild(dimmer);
                await Swal.fire(
                    "Error!",
                    "Something went wrong. Please try again.",
                    "error"
                );
            }
            console.log(res);
            return res.json();
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSave() {
        document.body.appendChild(dimmer);

        try {
            const updates = {
                productName: products.find((p) => p._id === selectedProduct._id)
                    .productName,
                productDescription: products.find((p) => p._id === selectedProduct._id)
                    .productDescription,
                stockCount: products.find((p) => p._id === selectedProduct._id)
                    .stockCount,
                productPrice: products.find((p) => p._id === selectedProduct._id)
                    .productPrice,
            };

            const res = await updateProduct(selectedProduct._id, updates);
            console.log(res);
            if (res.message) {
                document.body.removeChild(dimmer);
                await Swal.fire({
                    title: "Product updated",
                    icon: "success",
                    text: res.message,
                });

                setSelectedProduct(null);
            } else {
                document.body.removeChild(dimmer);
                await Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "There was an error updating the product",
                });
            }
        } catch (error) {
            await Swal.fire({
                title: "Error",
                icon: "error",
                text: error.message,
            });
            console.log(error);
        }
    }
    const deleteProduct = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this product?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            dimmer.appendChild(spinner);
            document.body.appendChild(dimmer);
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_APP_URL}/products/${id}/delete`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (res.ok) {
                    document.body.removeChild(dimmer);
                    await Swal.fire({
                        title: "Product deleted",
                        icon: "success",
                        text: res.message,
                    });

                    window.location.reload(false);
                } else {
                    document.body.removeChild(dimmer);
                    await Swal.fire({
                        title: "Error",
                        icon: "error",
                        text: "There was an error updating the product",
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        document.body.appendChild(dimmer);

        fetch(`${process.env.REACT_APP_APP_URL}/products/all`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.product) {
                    setProducts([]);
                    document.body.removeChild(dimmer);
                } else {
                    setProducts(data.product);
                    document.body.removeChild(dimmer);
                }
            });
    }, []);

    function addProductButton(e) {
        e.preventDefault();
        if (addProduct) {
            setAddProduct(false);
        } else {
            setAddProduct(true);
        }
    }
    return (
        <>
            <h1 style={{ marginTop: "3vh" }} className='text-center'>
                User Admin Dashboard
            </h1>

            <Table striped bordered hover style={{ marginTop: "5vh" }}>
                <thead className='bg-primary text-light'>
                    <tr className='text-center'>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Stocks</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Listed on</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {!currentProducts.length ? (
                        <>
                            <tr>
                                <td className='text-center' colSpan={8}>
                                    NO PRODUCT FOUND
                                </td>
                            </tr>
                        </>
                    ) : (
                        <>
                            {currentProducts.map((product, index) => (
                                <tr key={product._id}>
                                    {selectedProduct &&
                                    selectedProduct._id === product._id ? (
                                        <>
                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header
                                                    closeButton
                                                    onClick={() => {
                                                        setSelectedProduct(null);
                                                    }}
                                                >
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
                                                                Product Name
                                                            </Form.Label>
                                                            <Form.Control
                                                                onChange={(e) =>
                                                                    updateProductName(
                                                                        product,
                                                                        e
                                                                    )
                                                                }
                                                                value={
                                                                    product.productName
                                                                }
                                                                type='text'
                                                                placeholder='Name'
                                                                autoFocus
                                                            />
                                                        </Form.Group>

                                                        <Form.Group
                                                            className='mb-3'
                                                            controlId='exampleForm.ControlInput1'
                                                        >
                                                            <Form.Label>
                                                                Product Stock
                                                            </Form.Label>
                                                            <Form.Control
                                                                onChange={(e) =>
                                                                    updateStockCount(
                                                                        product,
                                                                        e
                                                                    )
                                                                }
                                                                value={product.stockCount}
                                                                type='number'
                                                                placeholder='Stock'
                                                                autoFocus
                                                            />
                                                        </Form.Group>
                                                        <Form.Group
                                                            className='mb-3'
                                                            controlId='exampleForm.ControlInput1'
                                                        >
                                                            <Form.Label>
                                                                Product Price
                                                            </Form.Label>
                                                            <Form.Control
                                                                onChange={(e) =>
                                                                    updateProductPrice(
                                                                        product,
                                                                        e
                                                                    )
                                                                }
                                                                value={
                                                                    product.productPrice
                                                                }
                                                                type='number'
                                                                placeholder='Price'
                                                                autoFocus
                                                            />
                                                        </Form.Group>
                                                        <Form.Group
                                                            className='mb-3'
                                                            controlId='exampleForm.ControlTextarea1'
                                                        >
                                                            <Form.Label>
                                                                Product Description
                                                            </Form.Label>
                                                            <Form.Control
                                                                onChange={(e) =>
                                                                    updateProductDescription(
                                                                        product,
                                                                        e
                                                                    )
                                                                }
                                                                value={
                                                                    product.productDescription
                                                                }
                                                                placeholder='Description'
                                                                as='textarea'
                                                                rows={3}
                                                            />
                                                        </Form.Group>
                                                    </Form>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button
                                                        variant='secondary'
                                                        onClick={() => {
                                                            setSelectedProduct(null);
                                                            handleClose();
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
                                            <td>{start + index + 1}</td>
                                            <td>{product.productName}</td>
                                            <td>{product.productDescription}</td>
                                            <td>{product.stockCount}</td>
                                            <td>Php {product.productPrice}</td>
                                            <td style={{ textAlign: "center" }}>
                                                {product.isActive
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </td>
                                            <td>
                                                {new Date(
                                                    product.createdOn
                                                ).toLocaleString()}
                                            </td>
                                            <td
                                                style={{
                                                    display: "flex",
                                                    textAlign: "center",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    paddingBottom: "20px",
                                                }}
                                            >
                                                <Button
                                                    variant='outline-primary'
                                                    style={{
                                                        marginBottom: "10px",
                                                        width: "120px",
                                                    }}
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        handleShow();
                                                    }}
                                                >
                                                    Update
                                                </Button>
                                                <Button
                                                    style={{
                                                        marginBottom: "10px",
                                                        width: "120px",
                                                    }}
                                                    onClick={() =>
                                                        deleteProduct(product._id)
                                                    }
                                                    variant='outline-danger'
                                                >
                                                    Delete
                                                </Button>
                                                {product.isActive ? (
                                                    <Button
                                                        style={{
                                                            marginBottom: "10px",
                                                            width: "120px",
                                                        }}
                                                        onClick={() =>
                                                            archive(product._id)
                                                        }
                                                        variant='outline-primary'
                                                    >
                                                        Archive
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        style={{
                                                            marginBottom: "10px",
                                                            width: "120px",
                                                        }}
                                                        onClick={() =>
                                                            unArchive(product._id)
                                                        }
                                                        variant='outline-warning'
                                                    >
                                                        Unarchive
                                                    </Button>
                                                )}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </Table>
            <nav style={{ display: "flex", justifyContent: "center" }}>
                <ul className='pagination'>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li
                            key={page}
                            className={`page-item ${
                                page === currentPage ? "active" : ""
                            }`}
                        >
                            <button
                                className='page-link'
                                onClick={() => handlePageClick(page)}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                    <div>
                        <Button
                            variant={showTextField ? "danger" : "warning"}
                            style={{ marginLeft: "10px" }}
                            onClick={handleToggleTextField}
                        >
                            {showTextField ? "Cancel" : "ADD ADMIN"}
                        </Button>
                    </div>

                    {showTextField && (
                        <>
                            <Form.Control
                                type='text'
                                placeholder='User ID'
                                onChange={(e) => setIdAdmin(e.target.value)}
                                style={{ marginLeft: "10px" }}
                            />

                            <Button
                                onClick={(e) => handleAddAdmin(e)}
                                variant='success'
                                style={{ marginLeft: "10px" }}
                            >
                                Save
                            </Button>
                        </>
                    )}
                </ul>

                <div style={{ marginLeft: "auto" }}>
                    <Button
                        onClick={() => navigate("/users/admin/orders/all")}
                        style={{ marginRight: "5px" }}
                    >
                        ORDER HISTORY
                    </Button>
                    <Button
                        onClick={(e) => addProductButton(e)}
                        variant={!addProduct ? "primary" : "warning"}
                    >
                        {!addProduct ? "Add product" : "Close form"}
                    </Button>
                </div>
            </nav>

            {!addProduct ? "" : <AddProduct />}
        </>
    );
};

export default AdminDashboard;
