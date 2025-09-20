/// filename: js/data.js
// Data module: single source of truth for products (localStorage backed)
const Data = (function(){
  const KEY = 'miniShop_products';
  // defaults: image paths are relative-to-pages (images/...) because pages load js/data.js
  const defaults = [
    { id: 1, name: "Television", price: 799, image: "images/product/0.png" },
    { id: 2, name: "Smart Phone", price: 1299, image: "images/product/1.png" },
    { id: 3, name: "Laptop", price: 499, image: "images/product/2.png" },
    { id: 4, name: "Digital Camera", price: 299, image: "images/product/3.png" },
    { id: 5, name: "Smart Phone 2", price: 999, image: "images/product/4.png" },
    { id: 6, name: "Computer Monitor", price: 199, image: "images/product/5.png" }
  ];

  function load(){
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      save(defaults);
      return JSON.parse(JSON.stringify(defaults));
    }
    try {
      return JSON.parse(raw);
    } catch {
      save(defaults);
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  function save(arr){
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function add(product, { toStart = false } = {}){
    const arr = load();
    if (toStart) arr.unshift(product);
    else arr.push(product);
    save(arr);
  }

  function removeById(id){
    const arr = load().filter(p => p.id !== id);
    save(arr);
  }

  function updateAll(arr){
    save(arr);
  }

  function getById(id){
    return load().find(p => p.id === id) || null;
  }

  return { load, save, add, removeById, updateAll, getById };
})();