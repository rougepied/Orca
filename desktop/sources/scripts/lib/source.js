//@ts-check

export function Source(client) {
  this.cache = {};

  this.install = () => {};

  this.start = () => {
    this.new();
  };

  this.new = () => {
    console.log("Source", "New file..");
    this.cache = {};
  };

  this.open = (ext, callback, store = false) => {
    console.log("Source", "Open file..");
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const inp = /** @type {HTMLInputElement} */ (e.target);
      const files = /** @type {FileList} */ (inp.files);
      const file = files[0];
      if (file.name.indexOf(`.${ext}`) < 0) {
        console.warn("Source", `Skipped ${file.name}`);
        return;
      }
      this.read(file, callback, store);
    };
    input.click();
  };

  this.load = (ext, callback) => {
    console.log("Source", "Load files..");
    const input = document.createElement("input");
    input.type = "file";
    input.setAttribute("multiple", "multiple");
    input.onchange = (e) => {
      const inp = /** @type {HTMLInputElement} */ (e.target);
      const files = /** @type {FileList} */ (inp.files);
      for (const file of files) {
        if (file.name.indexOf(`.${ext}`) < 0) {
          console.warn("Source", `Skipped ${file.name}`);
          continue;
        }
        this.read(file, this.store);
      }
    };
    input.click();
  };

  this.store = (file, content) => {
    console.info("Source", `Stored ${file.name}`);
    this.cache[file.name] = content;
  };

  this.save = (
    name,
    content,
    type = "text/plain",
    callback = "charset=utf-8",
  ) => {
    this.saveAs(name, content, type, callback);
  };

  this.saveAs = (
    name,
    ext,
    content,
    type = "text/plain",
    callback = "charset=utf-8",
  ) => {
    console.log("Source", "Save new file..");
    this.write(name, ext, content, type, callback);
  };

  // I/O

  this.read = (file, callback, store = false) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = /** @type {FileReader} */ (event.target).result;
      if (callback) {
        callback(file, res);
      }
      if (store) {
        this.store(file, res);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  this.write = (name, ext, content, type, settings = "charset=utf-8") => {
    const link = document.createElement("a");
    link.setAttribute("download", `${name}-${timestamp()}.${ext}`);
    if (type === "image/png" || type === "image/jpeg") {
      link.setAttribute("href", content);
    } else {
      link.setAttribute(
        "href",
        `data:${type};${settings},${encodeURIComponent(content)}`,
      );
    }
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
  };

  function timestamp(d = new Date(), e = new Date(d)) {
    return `${arvelie()}-${neralie()}`;
  }
}

/**
 * See https://wiki.xxiivv.com/site/arvelie.html
 * TODO: check if it works as expected (with unit tests ?)
 *
 * @param {Date} date
 * @returns {string}
 */
function arvelie(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const doty = Math.floor(diff / 86400000) - 1;
  const y = date.getFullYear().toString().substr(2, 2);
  const m =
    doty === 364 || doty === 365
      ? "+"
      : String.fromCharCode(97 + Math.floor(doty / 14)).toUpperCase();
  const d = `${(doty === 365 ? 1 : doty === 366 ? 2 : doty % 14) + 1}`.padStart(
    2,
    "0",
  );
  return `${y}${m}${d}`;
}

function neralie() {
  const d = new Date();
  const e = new Date(d);
  const ms = e.getTime() - d.setHours(0, 0, 0, 0);
  console.log((d.getMilliseconds() / 8640 / 10000).toFixed(6).substring(2, 8));
  return (ms / 8640 / 10000).toFixed(6).substring(2, 8);
}
