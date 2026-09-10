import Header from './Header'
import CartContext from './CartContext'

const Cart = () => (
  <CartContext.Consumer>
    {value => {
      const {
        cartList,
        removeAllCartItems,
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
      } = value
      const showEmptyView = cartList.length === 0

      return (
        <div className="cart-container">
          <Header />
          {showEmptyView ? (
            <div className="empty-cart-view">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
                alt="empty cart"
                className="empty-cart-image"
              />
              <p className="empty-text">Your Cart Is Empty</p>
            </div>
          ) : (
            <div className="cart-content-container">
              <div className="cart-header-actions">
                <h1 className="cart-heading">Cart Items</h1>
                <button
                  type="button"
                  className="remove-all-btn"
                  onClick={removeAllCartItems}
                >
                  Remove All
                </button>
              </div>
              <ul className="cart-items-list">
                {cartList.map(eachItem => {
                  const totalPrice = eachItem.dishPrice * eachItem.quantity

                  return (
                    <li key={eachItem.dishId} className="cart-item">
                      <img
                        src={eachItem.dishImage}
                        alt={eachItem.dishName}
                        className="cart-dish-image"
                      />
                      <div className="cart-details">
                        <p className="cart-dish-name">{eachItem.dishName}</p>
                        <p className="cart-dish-price">
                          {eachItem.dishCurrency} {totalPrice}
                        </p>
                        <div className="quantity-controls">
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() =>
                              decrementCartItemQuantity(eachItem.dishId)
                            }
                          >
                            -
                          </button>
                          <p className="quantity-text">{eachItem.quantity}</p>
                          <button
                            type="button"
                            className="quantity-btn"
                            onClick={() =>
                              incrementCartItemQuantity(eachItem.dishId)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeCartItem(eachItem.dishId)}
                      >
                        Remove
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default Cart
