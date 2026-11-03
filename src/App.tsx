import { Routes, Route, Navigate } from 'react-router-dom'
import Page0 from './pages/settings'
import Page1 from './pages/index'
import Page2 from './pages/cart'
import Page3 from './pages/store'
import Page4 from './pages/info'
import Page5 from './pages/payment-methods'
import Page6 from './pages/pickup'
import Page7 from './pages/shop'
import Page8 from './pages/checkout'
import Page9 from './pages/review'
import Page10 from './pages/arrival'
import Page11 from './pages/places'
import Page12 from './pages/orders'
import Page13 from './pages/welcome'
import Page14 from './pages/reviews'
import Page15 from './pages/my'
import Page16 from './pages/order/[id]'
import Page17 from './pages/item/[id]'
export function App() { return <Routes>
    <Route path="/settings" element={<Page0/>}/>
    <Route path="/" element={<Page1/>}/>
    <Route path="/cart" element={<Page2/>}/>
    <Route path="/store" element={<Page3/>}/>
    <Route path="/info" element={<Page4/>}/>
    <Route path="/payment-methods" element={<Page5/>}/>
    <Route path="/pickup" element={<Page6/>}/>
    <Route path="/shop" element={<Page7/>}/>
    <Route path="/checkout" element={<Page8/>}/>
    <Route path="/review" element={<Page9/>}/>
    <Route path="/arrival" element={<Page10/>}/>
    <Route path="/places" element={<Page11/>}/>
    <Route path="/orders" element={<Page12/>}/>
    <Route path="/welcome" element={<Page13/>}/>
    <Route path="/reviews" element={<Page14/>}/>
    <Route path="/my" element={<Page15/>}/>
    <Route path="/order/:id" element={<Page16/>}/>
    <Route path="/item/:id" element={<Page17/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes> }
