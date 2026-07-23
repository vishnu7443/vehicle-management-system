const { query } = require('../config/database');

// GET /api/vehicles - List with search, filtering, sorting, pagination
const getVehicles = async (req, res) => {
  try {
    const { q, type, fuel, status, sortBy = 'created_at', sortOrder = 'DESC', page = 1, limit = 10 } = req.query;

    let conditions = [];
    let params = [];

    // Search filter (Vehicle Number, Brand, Vehicle Name)
    if (q && q.trim()) {
      params.push(`%${q.trim().toLowerCase()}%`);
      const pIndex = params.length;
      conditions.push(`(LOWER(vehicle_number) LIKE $${pIndex} OR LOWER(brand) LIKE $${pIndex} OR LOWER(vehicle_name) LIKE $${pIndex})`);
    }

    // Filter by Type
    if (type && type.trim()) {
      params.push(type.trim());
      conditions.push(`type = $${params.length}`);
    }

    // Filter by Fuel
    if (fuel && fuel.trim()) {
      params.push(fuel.trim());
      conditions.push(`fuel = $${params.length}`);
    }

    // Filter by Status
    if (status && status.trim()) {
      params.push(status.trim());
      conditions.push(`status = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query
    const countSql = `SELECT COUNT(*) as total FROM vehicles ${whereClause}`;
    const countResult = await query(countSql, params);
    const totalItems = parseInt(countResult.rows[0].total || countResult.rows[0].TOTAL || 0);

    // Sorting columns whitelist
    const allowedSortColumns = ['id', 'vehicle_number', 'vehicle_name', 'brand', 'model', 'manufacturing_year', 'registration_date', 'status', 'created_at'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const offset = (pageNum - 1) * limitNum;

    // Fetch records
    const dataSql = `
      SELECT * FROM vehicles 
      ${whereClause} 
      ORDER BY ${safeSortBy} ${safeSortOrder} 
      LIMIT ${limitNum} OFFSET ${offset}
    `;

    const dataResult = await query(dataSql, params);

    res.json({
      vehicles: dataResult.rows,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limitNum) || 1,
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error retrieving vehicles list.' });
  }
};

// GET /api/vehicles/:id
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle record not found.' });
    }

    res.json({ vehicle: result.rows[0] });
  } catch (error) {
    console.error('Error fetching vehicle by ID:', error);
    res.status(500).json({ message: 'Internal server error fetching vehicle details.' });
  }
};

// POST /api/vehicles - Create Vehicle
const createVehicle = async (req, res) => {
  try {
    const {
      vehicle_number,
      vehicle_name,
      brand,
      model,
      type,
      fuel,
      manufacturing_year,
      registration_date,
      status = 'Active'
    } = req.body;

    // Validation
    if (!vehicle_number || !vehicle_name || !brand || !model || !type || !fuel || !manufacturing_year || !registration_date) {
      return res.status(400).json({ message: 'Please provide all required vehicle fields.' });
    }

    const currentYear = new Date().getFullYear();
    const parsedYear = parseInt(manufacturing_year);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear + 1) {
      return res.status(400).json({ message: `Manufacturing year must be between 1900 and ${currentYear + 1}.` });
    }

    // Check duplicate vehicle number
    const existing = await query('SELECT * FROM vehicles WHERE LOWER(vehicle_number) = $1', [vehicle_number.trim().toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: `Vehicle number "${vehicle_number}" already exists in the system.` });
    }

    const createdBy = req.user ? req.user.id : null;

    const sql = `
      INSERT INTO vehicles 
      (vehicle_number, vehicle_name, brand, model, type, fuel, manufacturing_year, registration_date, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const params = [
      vehicle_number.trim().toUpperCase(),
      vehicle_name.trim(),
      brand.trim(),
      model.trim(),
      type.trim(),
      fuel.trim(),
      parsedYear,
      registration_date,
      status,
      createdBy
    ];

    const result = await query(sql, params);

    let newVehicle;
    if (result.rows && result.rows.length > 0) {
      newVehicle = result.rows[0];
    } else {
      const fetched = await query('SELECT * FROM vehicles WHERE vehicle_number = $1', [vehicle_number.trim().toUpperCase()]);
      newVehicle = fetched.rows[0];
    }

    res.status(201).json({
      message: 'Vehicle created successfully!',
      vehicle: newVehicle
    });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Failed to create vehicle record.' });
  }
};

// PUT /api/vehicles/:id - Update Vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehicle_number,
      vehicle_name,
      brand,
      model,
      type,
      fuel,
      manufacturing_year,
      registration_date,
      status
    } = req.body;

    const checkExisting = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (checkExisting.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle record not found for update.' });
    }

    // Check duplicate vehicle number if changed
    if (vehicle_number) {
      const dupCheck = await query('SELECT * FROM vehicles WHERE LOWER(vehicle_number) = $1 AND id != $2', [vehicle_number.trim().toLowerCase(), id]);
      if (dupCheck.rows.length > 0) {
        return res.status(400).json({ message: `Vehicle number "${vehicle_number}" is already assigned to another vehicle.` });
      }
    }

    const current = checkExisting.rows[0];
    const updatedVehicleNumber = vehicle_number ? vehicle_number.trim().toUpperCase() : current.vehicle_number;
    const updatedVehicleName = vehicle_name ? vehicle_name.trim() : current.vehicle_name;
    const updatedBrand = brand ? brand.trim() : current.brand;
    const updatedModel = model ? model.trim() : current.model;
    const updatedType = type ? type.trim() : current.type;
    const updatedFuel = fuel ? fuel.trim() : current.fuel;
    const updatedYear = manufacturing_year ? parseInt(manufacturing_year) : current.manufacturing_year;
    const updatedRegDate = registration_date ? registration_date : current.registration_date;
    const updatedStatus = status ? status.trim() : current.status;
    const now = new Date().toISOString();

    const sql = `
      UPDATE vehicles
      SET vehicle_number = $1, vehicle_name = $2, brand = $3, model = $4, type = $5, fuel = $6,
          manufacturing_year = $7, registration_date = $8, status = $9, updated_at = $10
      WHERE id = $11
      RETURNING *
    `;

    const params = [
      updatedVehicleNumber,
      updatedVehicleName,
      updatedBrand,
      updatedModel,
      updatedType,
      updatedFuel,
      updatedYear,
      updatedRegDate,
      updatedStatus,
      now,
      id
    ];

    const result = await query(sql, params);

    let updated;
    if (result.rows && result.rows.length > 0) {
      updated = result.rows[0];
    } else {
      const fetched = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
      updated = fetched.rows[0];
    }

    res.json({
      message: 'Vehicle details updated successfully!',
      vehicle: updated
    });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Failed to update vehicle record.' });
  }
};

// DELETE /api/vehicles/:id - Delete Vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const checkExisting = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (checkExisting.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle record not found.' });
    }

    await query('DELETE FROM vehicles WHERE id = $1', [id]);

    res.json({
      message: `Vehicle record (ID: ${id}) deleted successfully.`
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Failed to delete vehicle record.' });
  }
};

// GET /api/vehicles/stats - Aggregate dashboard statistics
const getStats = async (req, res) => {
  try {
    const totalRes = await query('SELECT COUNT(*) as count FROM vehicles');
    const availableRes = await query("SELECT COUNT(*) as count FROM vehicles WHERE status = 'Active' OR status = 'Available'");
    const inServiceRes = await query("SELECT COUNT(*) as count FROM vehicles WHERE status = 'In Service'");
    const maintenanceRes = await query("SELECT COUNT(*) as count FROM vehicles WHERE status = 'Maintenance'");

    const totalVehicles = parseInt(totalRes.rows[0].count || totalRes.rows[0].COUNT || 0);
    const availableVehicles = parseInt(availableRes.rows[0].count || availableRes.rows[0].COUNT || 0);
    const inServiceVehicles = parseInt(inServiceRes.rows[0].count || inServiceRes.rows[0].COUNT || 0);
    const maintenanceVehicles = parseInt(maintenanceRes.rows[0].count || maintenanceRes.rows[0].COUNT || 0);

    res.json({
      stats: {
        totalVehicles,
        availableVehicles,
        inServiceVehicles,
        maintenanceVehicles,
        totalDrivers: Math.max(1, Math.floor(totalVehicles * 1.2)) // Optional Drivers stat metric
      }
    });
  } catch (error) {
    console.error('Error calculating vehicle stats:', error);
    res.status(500).json({ message: 'Failed to retrieve vehicle stats.' });
  }
};

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getStats
};
