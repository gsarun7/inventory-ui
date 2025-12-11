const API_URL = "https://ims-backend-9y9x.onrender.com/api";

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/items`);
  return res.json();
};

export const getCategories = async () => {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
};

export const getRecentActivity = async () => {
  const res = await fetch(`${API_URL}/recent-activity`);
  return res.json();
};

export const getInvoice = async () => {
  const res = await fetch(`${API_URL}/invoice`);
  return res.json();
};

export const getDashboard = async () => {
  const res = await fetch(`${API_URL}/dashboard`);
  return res.json();
};

export const addProduct = async (data) => {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE"
  });
};

export const createSale = async (sale) => {
  const res = await fetch(`${API_URL}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(sale)
  });
  return res.json();
};

