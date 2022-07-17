//@ts-check
const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

let isShown = true;

let win = null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 780,
    height: 462,
    minWidth: 380,
    minHeight: 360,
    backgroundColor: "#000",
    icon: path.join(
      __dirname,
      { darwin: "icon.icns", linux: "icon.png", win32: "icon.ico" }[
        process.platform
      ] || "icon.ico"
    ),
    resizable: true,
    frame: process.platform !== "darwin",
    skipTaskbar: process.platform === "darwin",
    autoHideMenuBar: process.platform === "darwin",
    webPreferences: {
      zoomFactor: 1.0,
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  });
  
  win.loadURL(`file://${__dirname}/sources/index.html`);

  win.on("closed", () => {
    app.quit();
  });
  
  win.on("hide", function () {
    isShown = false;
  });
  
  win.on("show", function () {
    isShown = true;
  });
};

app.whenReady().then(() => {
  // app.inspect()


  app.on("window-all-closed", () => {
    app.quit();
  });

  app.on("activate", () => {
    if (win === null) {
      createWindow();
    } else {
      win.show();
    }
  });
});
/*
app.inspect = function () {
  win.toggleDevTools();
};

app.toggleFullscreen = function () {
  win.setFullScreen(!win.isFullScreen());
};

app.toggleMenubar = function () {
  win.setMenuBarVisibility(!win.isMenuBarVisible());
};

app.toggleVisible = function () {
  if (process.platform !== "darwin") {
    if (!win.isMinimized()) {
      win.minimize();
    } else {
      win.restore();
    }
  } else {
    if (isShown && !win.isFullScreen()) {
      win.hide();
    } else {
      win.show();
    }
  }
};

app.injectMenu = function (menu) {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  } catch (err) {
    console.warn("Cannot inject menu.");
  }
};
*/
