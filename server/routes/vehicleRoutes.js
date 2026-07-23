const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getStats
} = require('../controllers/vehicleController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// All vehicle routes require valid JWT token authentication
router.use(verifyToken);

router.get('/stats', getStats);
router.get('/', getVehicles);
router.get('/search', getVehicles); // GET /api/vehicles/search?q=car
router.get('/:id', getVehicleById);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle); // Accessible by logged in users (Admin/Staff)

module.exports = router;
