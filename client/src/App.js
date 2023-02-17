import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { UserProvider } from "./UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Products from "./pages/Products";
import Register from "./pages/Register";
import ErrorPage from "./pages/ErrorPage";
import NavBar from "./components/NavBar";

function App() {
    const [user, setUser] = useState({ fullName: null, userId: null, isAdmin: null });

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
                    });
                } else {
                    setUser({ fullName: null, userId: null, isAdmin: null });
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }

        fetchUserData();
    }, []);
    console.log(user);

    return (
        <>
            <UserProvider value={{ user, setUser, unsetUser }}>
                <Router>
                    <NavBar />
                    <Container>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/logout' element={<Logout />} />
                            <Route path='/products' element={<Products />} />
                            <Route path='/register' element={<Register />} />
                            <Route path='/*' element={<ErrorPage />} />
                        </Routes>
                    </Container>
                </Router>
            </UserProvider>
        </>
    );
}

export default App;
