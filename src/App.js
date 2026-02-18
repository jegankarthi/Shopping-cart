import apple from "./apple.jpg";
import orange from "./orange.jpg";
import beans from "./beans.jpg";
import cabbage from "./cabbage.jpg";

import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const photos = [apple, orange, beans, cabbage];

  const initialProducts = [
    { name: "Apples", cost: 10, inStock: 10 },
    { name: "Oranges", cost: 12, inStock: 8 },
    { name: "Beans", cost: 8, inStock: 15 },
    { name: "Cabbage", cost: 20, inStock: 5 }
  ];

  const [items, setItems] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [apiData, setApiData] = useState([]);

  const STRAPI_URL = "http://localhost:1337/api/products";


  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(STRAPI_URL);
        setApiData(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);


  function addCart(item, index) {
    if (item.inStock <= 0) return alert("Out of stock!");

    setCart(prev => [...prev, item]);
    setTotalCost(prev => prev + item.cost);

    // reduce stock
    const updatedItems = [...items];
    updatedItems[index].inStock -= 1;
    setItems(updatedItems);
  }


  function removeFromCart(cartIndex) {
    const removedItem = cart[cartIndex];


    const newCart = cart.filter((_, i) => i !== cartIndex);
    setCart(newCart);


    setTotalCost(prev => prev - removedItem.cost);


    const updatedItems = items.map(item =>
      item.name === removedItem.name
        ? { ...item, inStock: item.inStock + 1 }
        : item
    );

    setItems(updatedItems);
  }


  function restockProducts() {
    if (!apiData.length) return alert("No Strapi products");

    const newItems = apiData.map(p => ({
      name: p.name,
      cost: Number(p.cost),
      inStock: 10
    }));

    setItems(prev => [...prev, ...newItems]);
  }


 return (
  <div
    style={{
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "900px",
      margin: "auto"
    }}
  >
    <h1 style={{ textAlign: "center" }}> Product List</h1>

 
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "50px",
        marginTop: "20px"
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            background: "#fff"
          }}
        >
          <img
            src={photos[index % 4]}
            alt="product"
            height="80"
            width="80"
            style={{ marginBottom: "10px" }}
          />

          <h3 style={{ margin: "5px 0" }}>{item.name}</h3>
          <p style={{ margin: "5px 0" }}>
            Stock: <b>{item.inStock}</b>
          </p>
          <p style={{ margin: "5px 0" }}>
            Price: <b>₹{item.cost}</b>
          </p>

          <button
            onClick={() => addCart(item, index)}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#28a745",
              color: "white",
              cursor: "pointer"
            }}
          >
             Add to Cart
          </button>
        </div>
      ))}
    </div>

    <hr style={{ margin: "30px 0" }} />

    {/* CART SECTION */}
    <h2> Cart Items</h2>

    {cart.length === 0 && (
      <p style={{ color: "#777" }}>No items in cart</p>
    )}

    {cart.map((item, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          borderBottom: "1px solid #ddd"
        }}
      >
        <span>
          {item.name} – <b>₹{item.cost}</b>
        </span>

        <button
          onClick={() => removeFromCart(index)}
          style={{
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#dc3545",
            color: "white",
            cursor: "pointer"
          }}
        >
         Remove
        </button>
      </div>
    ))}

    <h2 style={{ marginTop: "20px" }}>
      Total Cost: ₹{totalCost}
    </h2>

    <hr style={{ margin: "30px 0" }} />

    <button
      onClick={restockProducts}
      style={{
        padding: "10px 15px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer"
      }}
    >
     Restock from Strapi
    </button>
  </div>
);
}