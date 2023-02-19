import userContext from "../UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);

    useEffect(() => {
        if (!user.userId) {
            navigate("/products");
        }
    });
    return (
        <>
            {user.userId !== null ? (
                <h1>Welcome {user.fullName},</h1>
            ) : (
                navigate("/products")
            )}
        </>
    );
};

export default Home;
