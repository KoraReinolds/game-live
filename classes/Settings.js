class Settings {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  notify(data) {
    this.listeners.forEach(listener => listener.resize(data));
  }
}

export default Settings