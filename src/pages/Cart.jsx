import { useState } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Atomic Habits",
      price: 15,
      quantity: 1,
    },
    {
      id: 2,
      title: "Clean Code",
      price: 25,
      quantity: 1,
    },
  ]);

  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems(
      cartItems.filter((item) => item.id !== id)
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container py-5">

      <h1 className="mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              className="card mb-3 shadow-sm"
              key={item.id}
            >
              <div className="card-body">

                <div className="row align-items-center">

                  <div className="col-md-4">
                    <h5>{item.title}</h5>
                    <p className="mb-0">
                      ${item.price}
                    </p>
                  </div>

                  <div className="col-md-4">

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>

                    <span className="mx-3">
                      {item.quantity}
                    </span>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>

                  </div>

                  <div className="col-md-2">
                    <strong>
                      ${item.price * item.quantity}
                    </strong>
                  </div>

                  <div className="col-md-2">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}

          <div className="text-end mt-4">

            <h3>
              Total: ${total}
            </h3>

            <button className="btn btn-success btn-lg">
              Place Order
            </button>

          </div>
        </>
      )}

    </div>
  );
}

export default Cart;