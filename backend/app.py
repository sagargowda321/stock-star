from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

# ------------------------
# User Data (In-memory for now)
# ------------------------
user_data = {
    "balance": 100000,   # starting money
    "portfolio": {}      # { "TCS.NS": {"quantity": 10, "avg_price": 3200} }
}

# ------------------------
# Helper function to get live stock price
# ------------------------
def get_stock_price(symbol):
    stock = yf.Ticker(symbol)
    data = stock.history(period="1d")
    if not data.empty:
        return round(data["Close"].iloc[-1], 2)
    return None

# ------------------------
# API: Get stock price
# ------------------------
@app.route("/stocks/<symbol>", methods=["GET"])
def stock_price(symbol):
    price = get_stock_price(symbol)
    if price:
        return jsonify({"symbol": symbol, "price": price})
    return jsonify({"error": "Invalid symbol"}), 400

# ------------------------
# API: Buy stock
# ------------------------
@app.route("/buy", methods=["POST"])
def buy_stock():
    data = request.json
    symbol = data.get("symbol")
    quantity = int(data.get("quantity", 0))

    price = get_stock_price(symbol)
    if not price:
        return jsonify({"error": "Invalid stock symbol"}), 400

    cost = price * quantity
    if cost > user_data["balance"]:
        return jsonify({"error": "Not enough balance"}), 400

    # Deduct balance
    user_data["balance"] -= cost

    # Add to portfolio
    if symbol in user_data["portfolio"]:
        current = user_data["portfolio"][symbol]
        total_qty = current["quantity"] + quantity
        new_avg = ((current["avg_price"] * current["quantity"]) + cost) / total_qty
        user_data["portfolio"][symbol] = {
            "quantity": total_qty,
            "avg_price": round(new_avg, 2)
        }
    else:
        user_data["portfolio"][symbol] = {"quantity": quantity, "avg_price": price}

    return jsonify({"message": "Stock bought!", "portfolio": user_data["portfolio"], "balance": user_data["balance"]})

# ------------------------
# API: Sell stock
# ------------------------
@app.route("/sell", methods=["POST"])
def sell_stock():
    data = request.json
    symbol = data.get("symbol")
    quantity = int(data.get("quantity", 0))

    if symbol not in user_data["portfolio"] or user_data["portfolio"][symbol]["quantity"] < quantity:
        return jsonify({"error": "Not enough stock to sell"}), 400

    price = get_stock_price(symbol)
    if not price:
        return jsonify({"error": "Invalid stock symbol"}), 400

    revenue = price * quantity
    user_data["balance"] += revenue

    # Update portfolio
    user_data["portfolio"][symbol]["quantity"] -= quantity
    if user_data["portfolio"][symbol]["quantity"] == 0:
        del user_data["portfolio"][symbol]

    return jsonify({"message": "Stock sold!", "portfolio": user_data["portfolio"], "balance": user_data["balance"]})

# ------------------------
# API: Get portfolio
# ------------------------
@app.route("/portfolio", methods=["GET"])
def get_portfolio():
    portfolio_with_prices = {}
    for symbol, details in user_data["portfolio"].items():
        live_price = get_stock_price(symbol)
        portfolio_with_prices[symbol] = {
            "quantity": details["quantity"],
            "avg_price": details["avg_price"],
            "current_price": live_price,
            "current_value": round(details["quantity"] * live_price, 2),
            "profit_loss": round((live_price - details["avg_price"]) * details["quantity"], 2)
        }

    return jsonify({
        "balance": user_data["balance"],
        "portfolio": portfolio_with_prices
    })

# ------------------------
# Run the server
# ------------------------
if __name__ == "__main__":
    app.run(debug=True)
