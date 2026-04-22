const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function buildQuery(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== '' && val !== null && val !== undefined) {
      params.append(key, val);
    }
  });
  return params.toString();
}

export async function fetchComps(filters = {}, sortBy = 'id', sortDir = 'asc', page = 1, limit = 5) {
  const query = buildQuery({ ...filters, sortBy, sortDir, page, limit });
  const res = await fetch(`${BASE_URL}/comps${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch comps');
  return res.json(); // { data, total }
}

export async function fetchAllComps(filters = {}, sortBy = 'id', sortDir = 'asc') {
  return fetchComps(filters, sortBy, sortDir, 1, 0);
}

export async function createComp(data) {
  const res = await fetch(`${BASE_URL}/comps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create comp');
  return res.json();
}

export async function updateComp(id, data) {
  const res = await fetch(`${BASE_URL}/comps/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update comp');
  return res.json();
}

export async function deleteComp(id) {
  const res = await fetch(`${BASE_URL}/comps/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comp');
  return res.json();
}
