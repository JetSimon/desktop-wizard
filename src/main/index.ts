import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { spawn } from 'node:child_process'

import * as os from 'os'

const isMac = os.platform() === 'darwin'
const isWindows = os.platform() === 'win32'
const isLinux = os.platform() === 'linux'

function spawnOrbWindow(): void {
  const display = screen.getPrimaryDisplay()
  const width = display.bounds.width
  const height = display.bounds.height

  const x = Math.floor(Math.random() * width)
  const y = Math.floor(Math.random() * height)

  // Create the browser window.
  const popupWindow = new BrowserWindow({
    width: 128,
    x: x,
    y: y,
    height: 128,
    show: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    alwaysOnTop: true,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  popupWindow.on('ready-to-show', () => {
    popupWindow.showInactive()
  })

  popupWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  setTimeout(() => {
    if (popupWindow && !popupWindow.isDestroyed()) {
      popupWindow.close()
    }
  }, 10000)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    popupWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/popup.html`)
  } else {
    popupWindow.loadFile(join(__dirname, '../renderer/popup.html'))
  }
}

function createWindow(): BrowserWindow {
  const display = screen.getPrimaryDisplay()
  const width = display.bounds.width
  const height = display.bounds.height

  const windowWidth = 256
  const windowHeight = 512

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: windowWidth,
    x: width - windowWidth,
    y: height - windowHeight,
    height: windowHeight,
    show: false,
    frame: false,
    hasShadow: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.addListener('speak', (_, saying) => {
    if (isLinux) {
      spawn('speak', ['-v', 'en-gb', '-p', '25', saying])
    } else if (isMac) {
      spawn('say', ['-v', 'Reed (English (UK))', saying])
    } else if (isWindows) {
      // TODO Support TTS with windows
    }
  })

  const mainWindow = createWindow()

  ipcMain.addListener('spawnOrb', () => {
    spawnOrbWindow()
  })

  ipcMain.addListener('claimOrb', (e) => {
    e.sender.close()
    mainWindow.webContents.send('orbClaimed')
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
