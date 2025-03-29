const express = require('express');
const router = express.Router();
const cors = require('cors');

// Enable CORS for all routes
router.use(cors());

// Mock database for cold storage facilities
let coldStorages = [
  {
    id: 1,
    name: 'Agro Cold Storage',
    location: { lat: 20.5937, lng: 78.9629 },
    capacity: '1000 tons',
    availableSpace: '500 tons',
    temperature: '4°C',
    price: '₹100/ton/day',
    rating: 4.5,
    facilities: ['Temperature Control', 'Humidity Control', '24/7 Monitoring'],
  },
  {
    id: 2,
    name: 'Farm Fresh Storage',
    location: { lat: 20.5938, lng: 78.9630 },
    capacity: '800 tons',
    availableSpace: '300 tons',
    temperature: '2°C',
    price: '₹120/ton/day',
    rating: 4.2,
    facilities: ['Temperature Control', 'Humidity Control', '24/7 Monitoring', 'Forklift Service'],
  },
  {
    id: 3,
    name: 'Rural Cold Chain',
    location: { lat: 20.5939, lng: 78.9631 },
    capacity: '500 tons',
    availableSpace: '200 tons',
    temperature: '0°C',
    price: '₹90/ton/day',
    rating: 4.0,
    facilities: ['Temperature Control', 'Humidity Control', '24/7 Monitoring', 'Loading Assistance'],
  }
];

// Mock database for transport options
let transportOptions = [
  {
    id: 1,
    type: 'Refrigerated Truck',
    price: '₹5000',
    duration: '2 hours',
    capacity: '10 tons',
  },
  {
    id: 2,
    type: 'Cold Chain Van',
    price: '₹3000',
    duration: '3 hours',
    capacity: '5 tons',
  },
  {
    id: 3,
    type: 'Mini Refrigerated Van',
    price: '₹2000',
    duration: '4 hours',
    capacity: '3 tons',
  }
];

// Get all cold storage facilities
router.get('/facilities', (req, res) => {
  res.json(coldStorages);
});

// Get transport options
router.get('/transport', (req, res) => {
  res.json(transportOptions);
});

// Book cold storage
router.post('/book', (req, res) => {
  const { storageId, cropType, quantity, duration, temperature, startDate, transportId } = req.body;

  // Validate request
  if (!storageId || !cropType || !quantity || !duration || !temperature || !startDate || !transportId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Find selected storage
  const storage = coldStorages.find(s => s.id === storageId);
  if (!storage) {
    return res.status(404).json({ error: 'Storage facility not found' });
  }

  // Check availability
  const availableSpace = parseInt(storage.availableSpace.split(' ')[0]);
  if (quantity > availableSpace) {
    return res.status(400).json({ error: 'Requested quantity exceeds available space' });
  }

  // Find selected transport
  const transport = transportOptions.find(t => t.id === transportId);
  if (!transport) {
    return res.status(404).json({ error: 'Transport option not found' });
  }

  // Calculate costs
  const storagePrice = parseInt(storage.price.split('/')[0]);
  const storageCost = storagePrice * quantity * duration;
  const transportCost = parseInt(transport.price.split('₹')[1]);
  const totalCost = storageCost + transportCost;

  // Create booking
  const booking = {
    id: Date.now(),
    storageId,
    cropType,
    quantity,
    duration,
    temperature,
    startDate,
    transportId,
    totalCost,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  // Update available space
  storage.availableSpace = `${availableSpace - quantity} tons`;

  // In a real application, you would save the booking to a database
  // For now, we'll just return the booking details
  res.status(201).json({
    message: 'Booking successful',
    booking
  });
});

// Get booking status
router.get('/booking/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  // In a real application, you would fetch this from a database
  res.json({
    id: bookingId,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  });
});

module.exports = router; 