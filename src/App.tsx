import { useState } from 'react'
import { LOCATIONS } from './config'
import { useSheetData } from './hooks/useSheetData'
import { Header } from './components/Header'
import { Overview } from './components/Overview'
import { RestaurantTable } from './components/RestaurantTable'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<string>(LOCATIONS[0].key)
  const { data, loading, error } = useSheetData(activeTab)

  return (
    <div className="app">
      <Header activeTab={activeTab} onSelect={setActiveTab} />

      <main className="content">
        <Overview activeTab={activeTab} data={data} loading={loading} error={error} />
        <RestaurantTable data={data} loading={loading} />
      </main>
    </div>
  )
}

export default App
