export const searchInArray = (items, search) => {
  let keys = items.length > 0 ? Object.keys(items[0]) : [];
  return search === "" ? items : items.filter((e) => {
    let a = false;
    for (let k of keys) {
      a = a || String(e[`${k}`]).toLowerCase().includes(search.toLowerCase());
    }
    return a;
  });
};
