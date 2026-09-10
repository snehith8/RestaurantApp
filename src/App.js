import {useEffect, useState} from 'react'
import './App.css'

const App = () => {
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
      return {...prev, [dishId]: prev[dishId] - 1}
    })
  }

  useEffect(() => {
    const apicall = async () => {
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
        setError(e => e.message)
      }
    }
    apicall()
  }, [])
  console.log('a', categories)

  const activeCategory = categories.find(
    each =>
      each.menu_category_id === activeTab || each.menu_category === activeTab,
  )
  const activeDishes = activeCategory ? activeCategory.category_dishes : []
  const getCartCount = () =>
    Object.values(count).reduce((acc, curr) => acc + curr, 0)

  return (
    <div className="restaurant">
      {error && <p>{error}</p>}
      <div className="title">
        <h1>{head}</h1>
        <div className="cart-container">
          <p>My Orders</p>
          <p className="cart-count">{getCartCount()}</p>
        </div>
      </div>
      <ul className="categories">
        {categories &&
          categories.map(each => (
            <li key={each.menu_category_id}>
              <button
                className="catselection"
                type="button"
                onClick={() => onTab(each.menu_category_id)}
              >
                {each.menu_category}
              </button>
            </li>
          ))}
      </ul>
      <ul className="items">
        {activeDishes.map(dish => (
          <li key={dish.dish_id} className="dishes">
            <div className="details">
              <h3>{dish.dish_name}</h3>
              <p>{`${dish.dish_currency} ${dish.dish_price}`}</p>
              <p className="description">{dish.dish_description}</p>
              {dish.dish_Availability ? (
                <div className="buttons">
                  <button
                    type="button"
                    onClick={() => onDecrement(dish.dish_id)}
                  >
                    -
                  </button>
                  <p>{count[dish.dish_id] || 0}</p>
                  <button
                    type="button"
                    onClick={() => onIncrement(dish.dish_id)}
                  >
                    +
                  </button>
                </div>
              ) : (
                <p className="NA">Not available</p>
              )}
              {dish.addonCat && dish.addonCat.length > 0 && (
                <p className="customs">Customizations available</p>
              )}
            </div>
            <div className="calories">
              <p>{dish.dish_calories} calories</p>
            </div>
            <div className="image">
              <img
                className="dishimage"
                src={dish.dish_image}
                alt={dish.dish_name}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default App
