import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PopupWindow from './PopupWindow'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PopupWindow />
  </StrictMode>
)
