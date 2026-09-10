import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import Cart from './Components/Cart'
import ProtectedRoute from './Components/ProtectedRoute'
import CartContext from './Components/CartContext'
import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  addCartItem = dish => {
    const {cartList} = this.state
    const existingDish = cartList.find(item => item.dishId === dish.dishId)

    if (existingDish) {
      this.setState({
        cartList: cartList.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + dish.quantity}
            : item,
        ),
      })
    } else {
      this.setState({cartList: [...cartList, dish]})
    }
  }

  removeCartItem = dishId => {
    const {cartList} = this.state
    this.setState({
      cartList: cartList.filter(item => item.dishId !== dishId),
    })
  }

  incrementCartItemQuantity = dishId => {
    const {cartList} = this.state
    this.setState({
      cartList: cartList.map(item =>
        item.dishId === dishId ? {...item, quantity: item.quantity + 1} : item,
      ),
    })
  }

  decrementCartItemQuantity = dishId => {
    const {cartList} = this.state
    const targetItem = cartList.find(item => item.dishId === dishId)

    if (targetItem.quantity > 1) {
      this.setState({
        cartList: cartList.map(item =>
          item.dishId === dishId
            ? {...item, quantity: item.quantity - 1}
            : item,
        ),
      })
    } else {
      this.removeCartItem(dishId)
    }
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          removeAllCartItems: this.removeAllCartItems,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Redirect to="/login" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
