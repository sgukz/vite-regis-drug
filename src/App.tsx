import * as React from 'react'
import Header from './components/Header'
// import Footer from './components/Footer'
import MainPage from './views/MainPage'
const App = () => {
  return (
    <>
      <Header />
      <main style={{marginTop: "70px"}}>
        <MainPage />
      </main>
    </>
  )
}


export default App