import {useEffect, useState} from 'react'
import Header from './Header'
import CartContext from './CartContext'
import '../App.css'

const Home = () => {
  const [activeTab, setActiveTab] = useState('')
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [count, setCount] = useState({})
  const [head, setHeader] = useState('')

  const onTab = id => {
    setActiveTab(id)
  }

  const onIncrement = dishId => {
    setCount(prev => ({...prev, [dishId]: (prev[dishId] || 0) + 1}))
  }

  const onDecrement = dishId => {
    setCount(prev => {
      const qnty = prev[dishId] || 0
      if (qnty <= 0) return prev
      return {...prev, [dishId]: qnty - 1}
    })
  }

  useEffect(() => {
    const apicall = async () => {
      try {
        const response = await fetch(
          `https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details`,
        )
        if (response.ok) {
          const data = await response.json()
          setHeader(data[0].restaurant_name)
          setCategories(data[0].table_menu_list)
          if (data[0].table_menu_list.length > 0) {
            setActiveTab(data[0].table_menu_list[0].menu_category_id)
          }
        } else {
          setError('Failed to fetch')
        }
      } catch (e) {
        setError(e.message)
      }
    }
    apicall()
  }, [])

  const activeCategory = categories.find(
    each =>
      each.menu_category_id === activeTab || each.menu_category === activeTab,
  )
  const activeDishes = activeCategory ? activeCategory.category_dishes : []

  return (
    <CartContext.Consumer>
      {value => {
        const {addCartItem} = value

        return (
          <div className="restaurant">
            <Header restaurantName={head} />
            {error && <p>{error}</p>}
            <ul className="categories">
              {categories.map(each => (
                <li key={each.menu_category_id}>
                  <button
                    className={`catselection ${
                      activeTab === each.menu_category_id ? 'active-tab' : ''
                    }`}
                    type="button"
                    onClick={() => onTab(each.menu_category_id)}
                  >
                    {each.menu_category}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="items">
              {activeDishes.map(dish => {
                const dishQuantity = count[dish.dish_id] || 0

                const onAddToCart = () => {
                  addCartItem({
                    dishId: dish.dish_id,
                    dishName: dish.dish_name,
                    dishImage: dish.dish_image,
                    dishPrice: dish.dish_price,
                    dishCurrency: dish.dish_currency,
                    quantity: dishQuantity,
                  })
                }

                return (
                  <li key={dish.dish_id} className="dishes">
                    <div className="details">
                      <h1 className="dish-name">{dish.dish_name}</h1>
                      <p className="dish-price">{`${dish.dish_currency} ${dish.dish_price}`}</p>
                      <p className="dish-description">
                        {dish.dish_description}
                      </p>
                      {dish.dish_Availability ? (
                        <div className="buttons-container">
                          <div className="buttons">
                            <button
                              type="button"
                              onClick={() => onDecrement(dish.dish_id)}
                            >
                              -
                            </button>
                            <p className="dish-quantity">{dishQuantity}</p>
                            <button
                              type="button"
                              onClick={() => onIncrement(dish.dish_id)}
                            >
                              +
                            </button>
                          </div>
                          {dishQuantity > 0 && (
                            <button
                              type="button"
                              className="add-to-cart-btn"
                              onClick={onAddToCart}
                            >
                              ADD TO CART
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="NA">Not available</p>
                      )}
                      {dish.addonCat && dish.addonCat.length > 0 && (
                        <p className="customs">Customizations available</p>
                      )}
                    </div>
                    <p className="dish-calories">
                      {dish.dish_calories} calories
                    </p>
                    <div className="image">
                      <img
                        className="dishimage"
                        src={dish.dish_image}
                        alt={dish.dish_name}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      }}
    </CartContext.Consumer>
  )
}

export default Home
