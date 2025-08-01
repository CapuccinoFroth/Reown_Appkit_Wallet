import { useState } from 'react';
import { PayWithExchange } from './PayWithExchange';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Luxury Watch",
    price: 0.1, // Price in ETH
    image: "https://cdn-icons-png.flaticon.com/512/1900/1900657.png",
    description: "Elegant timepiece with premium craftsmanship"
  },
  {
    id: 2,
    name: "Designer Handbag",
    price: 0.15,
    image: "https://cdn-icons-png.flaticon.com/512/2345/2345130.png",
    description: "Premium leather handbag with gold accents"
  },
  {
    id: 3,
    name: "Smart Device",
    price: 0.08,
    image: "https://cdn-icons-png.flaticon.com/512/1169/1169615.png",
    description: "Next-generation smart device with AI capabilities"
  }
];

export function ProductCatalog() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="store-container">
      <div className="header">
        <h1>Luxury Store</h1>
        <button 
          className="cart-button"
          onClick={() => setShowCart(!showCart)}
        >
          🛒 Cart ({cart.length})
        </button>
      </div>

      {showCart ? (
        <div className="cart-container">
          <h2>Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>{item.price} ETH</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button 
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="cart-total">
                <h3>Total: {getTotalPrice().toFixed(3)} ETH</h3>
                <div className="payment-options">
                  <h4>Choose Payment Method</h4>
                  <div className="payment-buttons">
                    <div className="payment-option">
                      <h5>Pay with Wallet</h5>
                      <appkit-button />
                    </div>
                    <div className="payment-option">
                      <h5>Pay with Exchange</h5>
                      <PayWithExchange amount={getTotalPrice()} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">{product.price} ETH</p>
                <button 
                  className="add-to-cart-button"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .store-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .cart-button {
          padding: 0.5rem 1rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .product-card {
          border: 1px solid #eee;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-image {
          width: 100%;
          height: 250px;
          object-fit: contain;
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px 8px 0 0;
        }

        .product-info {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .product-info h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.2rem;
        }

        .product-info p {
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .price {
          font-size: 1.2rem;
          font-weight: bold;
          color: #2ecc71;
        }

        .add-to-cart-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .add-to-cart-button:hover {
          background-color: #2980b9;
        }

        .cart-container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cart-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .cart-item-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
        }

        .cart-item-details {
          flex: 1;
          padding: 0 1rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-controls button {
          padding: 0.25rem 0.5rem;
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .remove-button {
          padding: 0.5rem;
          background: none;
          border: none;
          color: #e74c3c;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .cart-total {
          margin-top: 2rem;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .cart-total h3 {
          text-align: center;
          color: #2ecc71;
          font-size: 1.4rem;
          margin-bottom: 2rem;
        }

        .payment-options {
          margin-top: 2rem;
        }

        .payment-options h4 {
          text-align: center;
          color: #2c3e50;
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }

        .payment-options h5 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1rem;
        }

        .payment-buttons {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .payment-option {
          flex: 1;
          max-width: 250px;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          text-align: center;
          transition: transform 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .payment-option:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
}