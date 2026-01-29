import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import "@fortawesome/fontawesome-free/css/all.min.css";
import State from './Context/State.jsx';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <State>
      <App />
    </State>
  // {/* </StrictMode>, */}
)
