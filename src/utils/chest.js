export function takeFromChest(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

export function saveOnChest(key, object) {
  window.localStorage.setItem(key, JSON.stringify(object));
}
