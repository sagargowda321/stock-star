import React, { useContext, useEffect, useState } from "react";
import { PortfolioContext } from "../context/PortfolioContext";

function Portfolio() {
  const { portfolio } = useContext(PortfolioContext);
  const [prices, setPrices] = useState({}); // live stock prices

  // Fetch live prices every 5 seconds
  const fetchPrices = async () => {
    const newPrices = {};
    for (let stock of portfolio) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/stocks/${stock.symbol}`);
        const data = await res.json();
        newPrices[stock.symbol] = data.price || 0;
      } catch {
        newPrices[stock.symbol] = 0;
      }
    }
    setPrices(newPrices);
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [portfolio]);

  const calculatePL = (symbol, avgPrice, quantity) => {
    const currentPrice = prices[symbol] || 0;
    return (currentPrice - avgPrice) * quantity;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>My Portfolio</h2>
      {portfolio.length === 0 ? (
        <p style={{ textAlign: "center" }}>Your portfolio is empty</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Stock</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Avg Price</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Profit / Loss</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map(stock => {
              const pl = calculatePL(stock.symbol, stock.avgPrice, stock.quantity);
              return (
                <tr key={stock.symbol}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{stock.symbol}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{stock.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>₹{stock.avgPrice.toFixed(2)}</td>
                  <td style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: pl >= 0 ? "green" : "red"
                  }}>
                    {pl >= 0 ? `+₹${pl.toFixed(2)}` : `-₹${Math.abs(pl).toFixed(2)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Portfolio;
