const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Codeforces",
    icon: path.join(__dirname, 'icon.ico'), // Set the window icon here
    backgroundColor: '#ffffff',
    show: false, // Wait until loaded to show to prevent flickering
    webPreferences: {
      nodeIntegration: false, // Security: Disable Node in the website
      contextIsolation: true, // Security: Isolate context
      spellcheck: true
    }
  });

  // CRITICAL: Set a standard Chrome User-Agent.
  // This helps bypass Cloudflare checks that often block default Electron user agents.
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
  mainWindow.webContents.userAgent = userAgent;

  // Load the official Codeforces website
  mainWindow.loadURL('https://codeforces.com');

  // Once the page is ready, show the window
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open links that lead outside Codeforces in the user's default browser (e.g. Chrome/Edge)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://codeforces.com') || url.startsWith('https://www.codeforces.com')) {
      return { action: 'allow' };
    }
    // External links (like telegram, gym contests hosted elsewhere) open in browser
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Electron automatically stores cookies and session data in the AppData folder.
// This ensures you stay logged in even after closing the app.

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});