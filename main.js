const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// 1. Cloudflare Bypass Switches
// These hide the fact that the browser is automated.
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('rotate-host-per-load');

let mainWindow;

function createWindow() {
  // 2. Chrome 124 User Agent (Windows)
  // Define this BEFORE creating the window so it applies immediately.
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "Codeforces",
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#ffffff',
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true,
      sandbox: true,
      webSecurity: true,
    }
  });

  // Apply the User Agent to the internal browser instance
  mainWindow.webContents.userAgent = userAgent;

  // Load the official Codeforces website
  mainWindow.loadURL('https://codeforces.com');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links (e.g., Gym contests, Telegram links, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://codeforces.com') || url.startsWith('https://www.codeforces.com')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
