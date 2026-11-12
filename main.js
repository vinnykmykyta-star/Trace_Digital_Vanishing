'use strict';
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#05070c',
    title: 'Trace: Digital Vanishing',
    autoHideMenuBar: true
  });
  win.loadFile(path.join(__dirname, 'game', 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
