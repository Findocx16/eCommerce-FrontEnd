import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import userContext from "../UserContext";
import { useContext } from "react";

const PAGE_SIZE = 10;
const AdminDashboard = () => {
    const { user } = useContext(userContext);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_APP_URL}/products/all`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.product);
            });
    }, []);
    const totalPages = Math.ceil(products.length / PAGE_SIZE);
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const currentProducts = products.slice(start, end);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    function handleProductNameChange(product, event) {
        const newProductName = event.target.value;
        setProducts((prevState) =>
            prevState.map((p) =>
                p._id === product._id ? { ...p, productName: newProductName } : p
            )
        );
    }

    function handleProductDescriptionChange(product, event) {
        const newProductDescription = event.target.value;
        setProducts((prevState) =>
            prevState.map((p) =>
                p._id === product._id
                    ? { ...p, productDescription: newProductDescription }
                    : p
            )
        );
    }

    function handleStockCountChange(product, event) {
        const newStockCount = parseInt(event.target.value, 10);
        setProducts((prevState) =>
            prevState.map((p) =>
                p._id === product._id ? { ...p, stockCount: newStockCount } : p
            )
        );
    }

    function handleProductPriceChange(product, event) {
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
                    "X-Is-Admin": user.isAdmin ? "true" : "false",
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

    async function handleSave() {
        try {
            const updates = {
                productName: products.find((p) => p._id === selectedProduct._id)
                    .productName,
                productDescription: products.find((p) => p._id === selectedProduct._id)
                    .productDescription, // replace with new value
                stockCount: products.find((p) => p._id === selectedProduct._id)
                    .stockCount,
                productPrice: products.find((p) => p._id === selectedProduct._id)
                    .productPrice,
            };

            const res = await updateProduct(selectedProduct._id, updates);
            console.log(res);
            if (res.message) {
                Swal.fire({
                    title: "Product updated",
                    icon: "success",
                    text: res.message,
                });
                setSelectedProduct(null);
            } else {
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

    return (
        <>
            <Table striped bordered hover style={{ marginTop: "10vh" }}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Stocks</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Listed on</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={product._id}>
                            {selectedProduct && selectedProduct._id === product._id ? (
                                <>
                                    <td>
                                        <input
                                            value={product.productName}
                                            onChange={(e) =>
                                                handleProductNameChange(product, e)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type='text'
                                            value={product.productDescription}
                                            onChange={(e) =>
                                                handleProductDescriptionChange(product, e)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type='number'
                                            value={product.stockCount}
                                            onChange={(e) =>
                                                handleStockCountChange(product, e)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={product.productPrice}
                                            onChange={(e) =>
                                                handleProductPriceChange(product, e)
                                            }
                                        />
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <Button
                                            onClick={handleSave}
                                            variant='outline-success'
                                        >
                                            Save
                                        </Button>
                                    </td>

                                    <td style={{ textAlign: "center" }}>
                                        <Button
                                            variant='outline-secondary'
                                            style={{ marginLeft: "10px" }}
                                            onClick={() => setSelectedProduct(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{start + index + 1}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.productDescription}</td>
                                    <td>{product.stockCount}</td>
                                    <td>Php {product.productPrice}</td>
                                    <td style={{ textAlign: "center" }}>
                                        {product.isActive ? (
                                            <Button variant='outline-primary'>
                                                Archive
                                            </Button>
                                        ) : (
                                            <Button variant='outline-warning'>
                                                Unarchive
                                            </Button>
                                        )}
                                    </td>
                                    <td>
                                        {new Date(product.createdOn).toLocaleString()}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <Button
                                            variant='outline-primary'
                                            style={{ marginRight: "10px" }}
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            Update
                                        </Button>
                                        <Button variant='outline-danger'>Delete</Button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
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
                </ul>
            </nav>
        </>
    );
};

export default AdminDashboard;
