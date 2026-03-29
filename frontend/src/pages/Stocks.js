import React, { useState, useEffect, useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";

function Stocks() {
  const { balance, buyStock, sellStock } = useContext(PortfolioContext);

  const defaultStocks = [
    "TCS.NS","INFY.NS","RELIANCE.NS","HDFCBANK.NS","ICICIBANK.NS",
    "LT.NS","SBIN.NS","HCLTECH.NS","KOTAKBANK.NS","MARUTI.NS",
    "HDFC.NS","AXISBANK.NS"
  ];

  const [watchlist, setWatchlist] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Fetch live stock prices every 5 seconds
  const fetchPrices = async () => {
    const prices = [];
    for (let s of defaultStocks) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/stocks/${s}`);
        const data = await res.json();
        prices.push({ symbol: s, price: data.price || 0 });
      } catch {
        prices.push({ symbol: s, price: 0 });
      }
    }
    setWatchlist(prices);
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000); // update every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Stock Simulator</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <strong>Balance:</strong> ₹{balance.toLocaleString()}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {watchlist.map(stock => (
          <div key={stock.symbol} style={{
            width: "200px",
            padding: "15px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            textAlign: "center"
          }}>
            <h4>{stock.symbol}</h4>
            <p>Price: ₹{stock.price}</p>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={e => setQuantity(Number(e.target.value))}
              style={{ width: "60px", marginBottom: "10px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => buyStock(stock.symbol, stock.price, quantity)}
                style={{ backgroundColor: "green", color: "#fff", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer" }}
              >
                Buy
              </button>
              <button
                onClick={() => sellStock(stock.symbol, stock.price, quantity)}
                style={{ backgroundColor: "red", color: "#fff", padding: "5px 10px", borderRadius: "6px", border: "none", cursor: "pointer" }}
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stocks;
