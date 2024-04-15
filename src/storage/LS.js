export default {
  has(key) {
    return this.get(key) !== null;
  },
  get(key) {
    return localStorage.getItem(key);
  },
  getJSON(key) {
    return JSON.parse(this.get(key));
  },
  setJSON(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  clear(key) {
    return localStorage.removeItem(key);
  },
};