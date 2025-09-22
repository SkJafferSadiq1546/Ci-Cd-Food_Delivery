import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/signin"); // after 1 sec go to signin
    }, 1000);
  }, [navigate]);

  return (
    <div className="splash-container">
      <h1 className="logo-text">🍔 Food Delivery</h1>
    </div>
  );
}

export default Splash;
