const express = require('express');
const port = 4001;
const { randomUUID } = require('crypto');

const app = express();

// middleware
app.use(express.json())

const products = [
  {
    "id": 1,
    "name": "aluminum water bottle",
    "price": 120
  },
  {
    "id": 2,
    "name": "bundle of a4 sheets",
    "price": 30.55
  },
  {
    "id": 3,
    "name": "3l1t3 g4m3r m0u53",
    "price": 133.37
  }
];

// POST products
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  const product = {
    id: randomUUID(),
    name,
    price
  }

  products.push(product);

  return res.json(product);
});

// GET products
app.get('/products', (req, res) => {
  return res.json(products);
});

// GET product by id
app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const product = products.find(product => product.id == id);
  return res.json(product);
});

// PUT product by id
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const index = products.findIndex(product => product.id == id);

  products[index] = {
    ...products[index],
    name,
    price
  }

  return res.json(products[index]);

});

// DELETE product by id
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(product => product.id == id);
  products.splice(index, 1);

  return res.json({
    message: 200
  })

});


app.listen(port, () => console.log(`live on port ${port}`));
