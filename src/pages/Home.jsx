import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./Home.css";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleDeleteAccount = async () => {
      const isConfirmed = window.confirm("Are you sure? This action is permanent.");
      if (isConfirmed && currentUser) {
          try {
              await axios.delete(`http://localhost:8080/api/user/profile/${currentUser.id}`);
              alert("Account deleted successfully.");
              handleLogout();
          } catch (error) {
              alert("Failed to delete account.");
          }
      }
  };

  return (
    <div className="profile-wrapper">
      <button onClick={(e) => { e.stopPropagation(); setOpen(s => !s); }} className="profile-icon">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User" className="profile-img" />
      </button>

      {open && (
        <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
          <Link to="/profile" onClick={() => setOpen(false)} className="dropdown-link">👤 Profile</Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="dropdown-link">🛒 Cart</Link>
          <button onClick={handleLogout} className="dropdown-link">🔓 Logout</button>
          <button onClick={handleDeleteAccount} className="dropdown-link delete-account">🗑️ Delete Account</button>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Home");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/menu-items`);
        setMenuItems(response.data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);
  
  const categories = [ "Home", "BurgerPizza", "Biryani", "Ice Cream", "Beverages", "Salads", "Desserts", "Starters", "My Orders" ];

  const filteredItems = menuItems.filter((item) => {
    const lowerCaseSearch = search.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(lowerCaseSearch) || item.restaurant.toLowerCase().includes(lowerCaseSearch);

    if (selectedCategory === "Home") {
        return matchesSearch;
    }
    // This part is now handled by the special rendering below
    if (selectedCategory === "Starters") {
        return item.category.startsWith("Starters") && matchesSearch;
    }
    return item.category === selectedCategory && matchesSearch;
  });

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="home-container" onClick={() => setMenuOpen(false)}>
      <aside className={`sidebar ${menuOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <h3>Menu</h3>
        <ul>
          {categories.map((cat) => (
            <li key={cat} className={selectedCategory === cat ? "active" : ""} onClick={() => {
                if (cat === "My Orders") {
                  navigate("/orders");
                } else {
                  setSelectedCategory(cat);
                }
                setMenuOpen(false);
              }}>
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <button className="menu-toggle" onClick={(e) => { e.stopPropagation(); setMenuOpen(s => !s); }}>
            ☰
          </button>
          <div style={{ marginLeft: "auto" }}>
            <ProfileDropdown />
          </div>
        </div>

        <div className="header-center">
          <h1 className="app-title">🍴 Food Delivery</h1>
          <input
            type="text"
            placeholder="Search for food or restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar"
          />
        </div>
        
        {/* ✅ NEW: Special rendering logic for the 'Starters' category */}
        {selectedCategory === 'Starters' ? (
            <>
                <h2>🥗 Veg Starters</h2>
                <div className="menu-grid">
                    {menuItems
                        .filter(it => it.category === 'Starters-Veg' && (it.name.toLowerCase().includes(search.toLowerCase()) || it.restaurant.toLowerCase().includes(search.toLowerCase())))
                        .map(item => (
                            <div className="menu-card-wrapper" key={item.id}>
                                <Link to={`/food/${item.id}`} className="menu-card-link">
                                    <div className="menu-card-inner">
                                        {/*<img src={item.image} alt={item.name} />*/}
                                        <img src={process.env.PUBLIC_URL + item.image} alt={item.name} />

                                        <h3>{item.name}</h3>
                                        <p className="price">₹{item.price}</p>
                                        <p className="restaurant"><strong>{item.restaurant}</strong></p>
                                        <p className="rating">⭐ {item.rating}</p>
                                    </div>
                                </Link>
                                <div className="card-actions">
                                    <button className="add-cart-btn" onClick={(e) => handleAddToCart(e, item)}>+ Add to Cart</button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <h2 style={{ marginTop: '30px' }}>🍗 Non-Veg Starters</h2>
                <div className="menu-grid">
                    {menuItems
                        .filter(it => it.category === 'Starters-NonVeg' && (it.name.toLowerCase().includes(search.toLowerCase()) || it.restaurant.toLowerCase().includes(search.toLowerCase())))
                        .map(item => (
                             <div className="menu-card-wrapper" key={item.id}>
                                <Link to={`/food/${item.id}`} className="menu-card-link">
                                    <div className="menu-card-inner">
                                        {/*<img src={item.image} alt={item.name} />*/}
                                        <img src={process.env.PUBLIC_URL + item.image} alt={item.name} />

                                        <h3>{item.name}</h3>
                                        <p className="price">₹{item.price}</p>
                                        <p className="restaurant"><strong>{item.restaurant}</strong></p>
                                        <p className="rating">⭐ {item.rating}</p>
                                    </div>
                                </Link>
                                <div className="card-actions">
                                    <button className="add-cart-btn" onClick={(e) => handleAddToCart(e, item)}>+ Add to Cart</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
        ) : (
            // This is the original rendering logic for all other categories
            <div className="menu-grid">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div className="menu-card-wrapper" key={item.id}>
                            <Link to={`/food/${item.id}`} className="menu-card-link">
                                <div className="menu-card-inner">
                                    {/*<img src={item.image} alt={item.name} />*/}
                                    <img src={process.env.PUBLIC_URL + item.image} alt={item.name} />

                                    <h3>{item.name}</h3>
                                    <p className="price">₹{item.price}</p>
                                    <p className="restaurant"><strong>{item.restaurant}</strong></p>
                                    <p className="rating">⭐ {item.rating}</p>
                                </div>
                            </Link>
                            <div className="card-actions">
                                <button className="add-cart-btn" onClick={(e) => handleAddToCart(e, item)}>
                                    + Add to Cart
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No items found.</p>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default Home;