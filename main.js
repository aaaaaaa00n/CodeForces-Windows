const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');

// 1. Disable the "AutomationControlled" feature. 
// This hides the `navigator.webdriver` property, which Cloudflare checks to detect bots.
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.commandLine.appendSwitch('disable-site-isolation-trials');

let mainWindow;

function createWindow() {
  // Create the browser window.
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
      sandbox: true, // improved security and often helps with captchas
      webSecurity: true
    }
  });

  // 2. Set a realistic User Agent.
  // This matches a standard Windows Chrome browser.
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
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
  // Ensure the session also uses the correct User Agent globally
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
