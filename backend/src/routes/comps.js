const express = require('express');
const router = express.Router();
const pool = require('../db');

// Build WHERE clause and params from query filters
function buildFilters(query) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (query.address) {
    conditions.push(`"Address" ILIKE $${idx++}`);
    params.push(`%${query.address}%`);
  }
  if (query.city) {
    conditions.push(`"CityMunicipality" ILIKE $${idx++}`);
    params.push(`%${query.city}%`);
  }
  if (query.county) {
    conditions.push(`"County" ILIKE $${idx++}`);
    params.push(`%${query.county}%`);
  }
  if (query.state) {
    conditions.push(`"State" ILIKE $${idx++}`);
    params.push(`%${query.state}%`);
  }
  if (query.zipCode) {
    conditions.push(`"ZipCode" ILIKE $${idx++}`);
    params.push(`%${query.zipCode}%`);
  }
  if (query.saleDateFrom) {
    conditions.push(`"SaleDate" >= $${idx++}`);
    params.push(query.saleDateFrom);
  }
  if (query.saleDateTo) {
    conditions.push(`"SaleDate" <= $${idx++}`);
    params.push(query.saleDateTo);
  }
  if (query.salePriceMin) {
    conditions.push(`"SalePrice" >= $${idx++}`);
    params.push(parseFloat(query.salePriceMin));
  }
  if (query.salePriceMax) {
    conditions.push(`"SalePrice" <= $${idx++}`);
    params.push(parseFloat(query.salePriceMax));
  }

  return { conditions, params };
}

function buildOrderBy(query) {
  const allowedColumns = [
    'id', 'PropertyName', 'Address', 'CityMunicipality', 'County', 'State',
    'ZipCode', 'SaleDate', 'SalePrice', 'NumberOfAcres', 'NumberOfUnits',
    'PricePerAcre', 'PricePerUnit',
  ];
  const sortBy = allowedColumns.includes(query.sortBy) ? query.sortBy : 'id';
  const sortDir = query.sortDir === 'desc' ? 'DESC' : 'ASC';
  return `ORDER BY "${sortBy}" ${sortDir}`;
}

// GET /comps
router.get('/', async (req, res) => {
  try {
    const { conditions, params } = buildFilters(req.query);
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = buildOrderBy(req.query);
    const sql = `SELECT * FROM "Comps" ${where} ${orderBy}`;
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /comps error:', err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// POST /comps
router.post('/', async (req, res) => {
  const fields = [
    'PropertyName', 'Address', 'CityMunicipality', 'County', 'State',
    'ZipCode', 'ZoningDescription', 'Seller', 'Buyer', 'SaleDate',
    'SalePrice', 'NumberOfAcres', 'NumberOfUnits', 'PricePerAcre',
    'PricePerUnit', 'SaleRemarks', 'PropertyRemarks', 'Latitude', 'Longitude',
  ];

  const columns = fields.map(f => `"${f}"`).join(', ');
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
  const values = fields.map(f => req.body[f] ?? null);

  try {
    const result = await pool.query(
      `INSERT INTO "Comps" (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /comps error:', err);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// PUT /comps/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const fields = [
    'PropertyName', 'Address', 'CityMunicipality', 'County', 'State',
    'ZipCode', 'ZoningDescription', 'Seller', 'Buyer', 'SaleDate',
    'SalePrice', 'NumberOfAcres', 'NumberOfUnits', 'PricePerAcre',
    'PricePerUnit', 'SaleRemarks', 'PropertyRemarks', 'Latitude', 'Longitude',
  ];

  const setClauses = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ');
  const values = [...fields.map(f => req.body[f] ?? null), id];

  try {
    const result = await pool.query(
      `UPDATE "Comps" SET ${setClauses} WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /comps/:id error:', err);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// DELETE /comps/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM "Comps" WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ deleted: result.rows[0].id });
  } catch (err) {
    console.error('DELETE /comps/:id error:', err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

module.exports = router;
