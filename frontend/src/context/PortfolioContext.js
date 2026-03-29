import React, { createContext, useState } from "react";

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [balance, setBalance] = useState(100000); // initial capital
  const [portfolio, setPortfolio] = useState([]); // empty initially

  // Buy stock
  const buyStock = (symbol, price, quantity) => {
    const totalCost = price * quantity;
    if (totalCost > balance) {
      alert("❌ Insufficient balance");
      return;
    }

    setBalance(prev => prev - totalCost);

    setPortfolio(prevPortfolio => {
      const existingStock = prevPortfolio.find(stock => stock.symbol === symbol);
      if (existingStock) {
        const newQty = existingStock.quantity + quantity;
        const newAvgPrice = ((existingStock.avgPrice * existingStock.quantity) + (price * quantity)) / newQty;
        return prevPortfolio.map(stock =>
          stock.symbol === symbol
            ? { ...stock, quantity: newQty, avgPrice: newAvgPrice }
            : stock
        );
      } else {
        return [...prevPortfolio, { symbol, quantity, avgPrice: price }];
      }
    });
  };

  // Sell stock
  const sellStock = (symbol, price, quantity) => {
    const existingStock = portfolio.find(stock => stock.symbol === symbol);
    if (!existingStock || existingStock.quantity < quantity) {
      alert("❌ Not enough shares to sell");
      return;
    }

    setBalance(prev => prev + price * quantity);

    setPortfolio(prevPortfolio => {
      const newQty = existingStock.quantity - quantity;
      if (newQty === 0) {
        return prevPortfolio.filter(stock => stock.symbol !== symbol);
      } else {
        return prevPortfolio.map(stock =>
          stock.symbol === symbol
            ? { ...stock, quantity: newQty }
            : stock
        );
      }
    });
  };

  return (
    <PortfolioContext.Provider value={{ balance, portfolio, buyStock, sellStock }}>
      {children}
    </PortfolioContext.Provider>
  );
};
