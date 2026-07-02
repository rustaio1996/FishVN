const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(app.getPath("userData"), "ngu_ong_database.json");

function readDb() {
  if (!fs.existsSync(dbPath)) return {};
  try {
    const content = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(content);
  } catch (e) {
    console.error("Error reading database file:", e);
    return {};
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Error writing database file:", e);
    return false;
  }
}

ipcMain.handle("db-save", (event, key, value) => {
  const db = readDb();
  db[key] = value;
  return writeDb(db);
});

ipcMain.handle("db-load", (event, key) => {
  const db = readDb();
  return db[key];
});

ipcMain.handle("db-clear", (event) => {
  return writeDb({});
});

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 420,
    minHeight: 680,
    backgroundColor: "#0d0d11",
    title: "Ngư Ông Bất Ổn",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "..", "NguOngBatOn.html"));

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
