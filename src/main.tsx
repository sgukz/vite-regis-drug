import React from 'react'
import ReactDOM from 'react-dom/client'
import { LiffProvider } from 'react-liff';
import App from './App.tsx'
import './index.css'

const liffId = '2000438386-ZDQ6d0QJ';
const stubEnabled = false;



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LiffProvider liffId={liffId} stubEnabled={stubEnabled}>
      <App />
    </LiffProvider>
  </React.StrictMode>,
)
