import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import userContext from "../UserContext";

export default function Logout() {
    const { unsetUser, setUser } = useContext(userContext);
    unsetUser();

    useEffect(() => {
        setUser({ userId: null });
    });

    return <Navigate to='/login' />;
}
