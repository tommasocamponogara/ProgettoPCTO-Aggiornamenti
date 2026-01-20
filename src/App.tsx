import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { Sidebar } from './componenti/sidebar'
import { Dashboard } from './componenti/Dashboard'

export default function App() {
  return (
    <>
      {/*<Sidebar /> */}

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/*}
        <Route path="/products" element={<Products />}>
          <Route path="car" element={<CarProducts />} />
          <Route path="bike" element={<BikeProducts />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
        */}
      </Routes>
    </>
  )
}
