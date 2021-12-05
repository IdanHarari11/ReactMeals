import React, { useContext, useState } from "react";
import useHttp from "../../Hooks/useHttp";
import CartContext from "../../Store/CartContext";
import Modal from "../UI/Modal";
import CartItem from "./CarItem";
import classes from "./Cart.module.css";
import Checkout from "./Checkout";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, didIsSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const { isLoading, error: httpError, sendRequest } = useHttp();

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    console.log(item);
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = (userData) => {
    setIsSubmitting(true);
    sendRequest({
      url: "https://reactmeals-f9f80-default-rtdb.firebaseio.com/orders.json",
      method: "POST",
      body: {
        user: userData,
        orderItems: cartCtx.items,
      },
    });
    setIsSubmitting(false);
    didIsSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, { ...item, amount: 1 })}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {!isLoading && isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {isLoading && <p>Sending order data ...</p>}
      {httpError && <p>{httpError}</p>}
      {!isCheckout && modalActions}
    </>
  );

  return (
    <Modal onClose={props.onClose}>
      {!didSubmit && cartModalContent}
      {didSubmit && (
        <>
          <div className={classes.actions}>
            <button className={classes.button} onClick={props.onClose}>
              Close
            </button>
          </div>
          <p>Successfully sent the order!</p>
        </>
      )}
    </Modal>
  );
};

export default Cart;
