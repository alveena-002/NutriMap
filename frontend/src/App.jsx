import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import Dashboard from './pages/Dashboard'
import HungerMap from './pages/HungerMap'
import MealFinder from './pages/MealFinder'
import AIAssistant from './pages/AIAssistant'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="hunger-map" element={<HungerMap />} />
          <Route path="meal-finder" element={<MealFinder />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
