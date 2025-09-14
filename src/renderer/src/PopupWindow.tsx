import { useState } from 'react'
import './PopupWindow.css'

function PopupWindow(): React.ReactNode {
  const [clicked, setClicked] = useState(false)

  function addOrb(): void {
    if (clicked) {
      return
    }
    window.electron.ipcRenderer.send('claimOrb')
    setClicked(true)
  }

  return (
    <div className="PopupWindow">{!clicked && <div onClick={addOrb} className="Orb"></div>}</div>
  )
}

export default PopupWindow
