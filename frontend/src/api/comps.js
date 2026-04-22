const BASE_URL = '/comps';

function buildQuery(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== '' && val !== null && val !== undefined) {
      params.append(key, val);
    }
  });
  return params.toString();
}

export async function fetchComps(filters = {}, sortBy = 'id', sortDir = 'asc') {
  const query = buildQuery({ ...filters, sortBy, sortDir });
  const res = await fetch(`${BASE_URL}${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch comps');
  return res.json();
}

export async function createComp(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create comp');
  return res.json();
}

export async function updateComp(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update comp');
  return res.json();
}

export async function deleteComp(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comp');
  return res.json();
}
