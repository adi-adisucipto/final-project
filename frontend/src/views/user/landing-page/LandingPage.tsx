import Categories from './sections/Categories'
import Hero from './sections/Hero'
import Products from './sections/Products'
import StoreBar from './sections/StoreBar'

function LandingPage() {
  return (
    <div>
      <Hero/>
      <Categories/>
      <StoreBar/>
      <Products/>
    </div>
  )
}

export default LandingPage
