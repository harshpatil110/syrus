const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with database in production)
let negotiations = [];
let negotiationId = 1;

// Routes
app.post('/api/negotiations', (req, res) => {
  const { productId, quantity, originalPrice, negotiatedPrice } = req.body;
  
  const negotiation = {
    id: negotiationId++,
    productId,
    quantity,
    originalPrice,
    negotiatedPrice,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  negotiations.push(negotiation);
  res.status(201).json(negotiation);
});

app.get('/api/negotiations/history', (req, res) => {
  res.json(negotiations);
});

app.get('/api/negotiations/:id/status', (req, res) => {
  const negotiation = negotiations.find(n => n.id === parseInt(req.params.id));
  
  if (!negotiation) {
    return res.status(404).json({ error: 'Negotiation not found' });
  }

  res.json({ status: negotiation.status });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 