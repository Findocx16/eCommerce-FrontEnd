import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { UserProvider } from "./UserContext";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Products from "./pages/Products";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import NavBar from "./components/NavBar";
import ProductDetails from "./components/ProductDetails";
import AdminDashboard from "./pages/AdminDashboard";
import ViewCart from "./components/ViewCart";
import ViewOrderHistory from "./components/ViewOrderHistory";
import ViewOrderHistoryAdmin from "./components/ViewOrderHistoryAdmin";

function App() {
    const [user, setUser] = useState({
        fullName: null,
        userId: null,
        isAdmin: null,
        email: null,
    });

    const unsetUser = () => {
        localStorage.clear();
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_APP_URL}/users/details`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (typeof data.user._id !== "undefined") {
                    setUser({
                        fullName: `${data.user.firstName} ${data.user.lastName}`,
                        userId: data.user._id,
                        isAdmin: data.user.isAdmin,
                        email: data.user.email,
                    });
                } else {
                    setUser({
                        fullName: null,
                        userId: null,
                        isAdmin: null,
                        email: null,
                    });
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }

        fetchUserData();
    }, []);

    return (
        <>
            <UserProvider value={{ user, setUser, unsetUser }}>
                <Router>
                    <NavBar />
                    <Container>
                        <Routes>
                            <Route path='/login' element={<Login />} />
                            <Route path='/logout' element={<Logout />} />
                            <Route path='/' element={<Products />} />
                            <Route path=':productId' element={<ProductDetails />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/users/admin' element={<AdminDashboard />} />
                            <Route path='/users/cart' element={<ViewCart />} />
                            <Route
                                path='/users/checkout/history'
                                element={<ViewOrderHistory />}
                            />{" "}
                            <Route
                                path='/users/admin/orders/all'
                                element={<ViewOrderHistoryAdmin />}
                            />
                            <Route path='/*' element={<ErrorPage />} />
                        </Routes>
                    </Container>
                </Router>
            </UserProvider>
        </>
    );
}

export default App;
