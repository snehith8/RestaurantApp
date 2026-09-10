import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import CartContext from './CartContext'

const Header = props => {
  const {restaurantName} = props
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value
        const cartItemsCount = cartList.length

        return (
          <nav className="nav-header">
            <Link to="/" className="nav-link">
              <h1 className="restaurant-title">Snehith's Kitchen</h1>
            </Link>
            <div className="nav-actions">
              <p className="my-orders-text">My Orders</p>
              <Link to="/cart" className="cart-link">
                <button
                  type="button"
                  className="cart-icon-button"
                  data-testid="cart"
                >
                  🛒
                  <span className="cart-badge">{cartItemsCount}</span>
                </button>
              </Link>
              <button
                type="button"
                className="logout-button"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </div>
          </nav>
        )
      }}
    </CartContext.Consumer>
  )
}

export default withRouter(Header)
