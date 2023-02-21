import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import userContext from "../UserContext";
import { useContext } from "react";

const PAGE_SIZE = 10;

const ViewOrderHistory = () => {
    const { user } = useContext(userContext);
    const [orderLists, setOrderLists] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const dimmer = document.createElement("div");
        dimmer.style =
            "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999;";
        const spinner = document.createElement("div");
        spinner.innerHTML = `
          <div class="d-flex justify-content-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        `;
        dimmer.appendChild(spinner);
        document.body.appendChild(dimmer);
        fetch(`${process.env.REACT_APP_APP_URL}/users/checkout/history`, {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                document.body.removeChild(dimmer);
                setOrderLists(data.orders);
            });
    }, []);

    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentOrders = orderLists.slice(startIndex, endIndex);
    const totalPages = Math.ceil(orderLists.length / PAGE_SIZE);

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <h1 style={{ marginTop: "3vh", marginBottom: "3vh" }} className='text-center'>
                {`${user.fullName}'s Order History`}
            </h1>
            <Table striped bordered hover>
                <thead className='bg-success text-light'>
                    <tr className='text-center'>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Date Purchased</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.length ? (
                        currentOrders.map((orderList) => (
                            <tr key={orderList._id} className='text-center'>
                                <td>{orderList.productName}</td>
                                <td>{orderList.quantity}</td>
                                <td>{orderList.checkOutTotal}</td>
                                <td>{new Date(orderList.paidOn).toLocaleString()}</td>
                            </tr>
                        ))
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

export default ViewOrderHistory;
