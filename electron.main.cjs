// electron.main.cjs
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'KÜN Numeroloji',
    backgroundColor: '#0b0f14',
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  })

  if (process.env.ELECTRON_START_URL) {
    win.loadURL(process.env.ELECTRON_START_URL) // Dev
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html')) // Prod
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
