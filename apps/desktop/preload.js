const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),
    
    secureStore: {
      getItem: (key) => ipcRenderer.invoke('secure-store-get', key),
      setItem: (key, value) => ipcRenderer.invoke('secure-store-set', key, value),
    },
    
    platform: process.platform,
    
    sendAnalytics: (eventName, data) => {
      ipcRenderer.send('analytics', eventName, data);
    },
    
    openExternal: (url) => {
      ipcRenderer.send('open-external', url);
    },
    
    showNotification: (title, body) => {
      ipcRenderer.send('show-notification', { title, body });
    },
    
    checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
    
    onDeepLink: (callback) => {
      ipcRenderer.on('deep-link', (event, url) => callback(url));
    },
    
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    
    setTheme: (theme) => ipcRenderer.send('set-theme', theme),
    getTheme: () => ipcRenderer.invoke('get-theme'),
    
    setLanguage: (lang) => ipcRenderer.send('set-language', lang),
    getLanguage: () => ipcRenderer.invoke('get-language'),
  }
);

window.eval = global.eval = function() {
  throw new Error('Eval is disabled for security reasons');
};

ipcRenderer.send('preload-ready');
