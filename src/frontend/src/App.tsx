import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <h1>遊戲平台管理系統</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>歡迎頁面</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
