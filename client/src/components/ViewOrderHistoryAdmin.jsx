import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import createSpinner from "./Spinner";

const PAGE_SIZE = 10;

const ViewOrderHistoryAdmin = () => {
    const dimmer = createSpinner();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        document.body.appendChild(dimmer);
        fetch(`${process.env.REACT_APP_APP_URL}/users/allorders`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                document.body.removeChild(dimmer);
                console.log(data);
                setOrders(data.orders);
            });
    }, []);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, orders.length);
    const currentOrders = orders.slice(startIndex, endIndex);
    const totalPages = Math.ceil(orders.length / PAGE_SIZE);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <h1 style={{ marginTop: "3vh", marginBottom: "3vh" }} className='text-center'>
                {`All User Order History`}
            </h1>
            <Table striped bordered hover>
                <thead className='bg-success text-light'>
                    <tr className='text-center'>
                        <th>User Name</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Date Purchased</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.length ? (
                        currentOrders.map((order) =>
                            order.checkOutDetails.map((checkout) => (
                                <tr key={checkout._id} className='text-center'>
                                    <td>
                                        <strong>{order.firstName}</strong> (ID -{" "}
                                        {order._id})
                                    </td>

                                    <td>{checkout.productName}</td>
                                    <td>{checkout.quantity}</td>
                                    <td>{checkout.checkOutTotal}</td>
                                    <td>{new Date(checkout.paidOn).toLocaleString()}</td>
                                </tr>
                            ))
                        )
                    ) : (
                        <tr className='text-center'>
                            <td colSpan='4'>NO ORDERS YET</td>
                        </tr>
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
                </ul>
            </nav>
        </>
    );
};

export default ViewOrderHistoryAdmin;
