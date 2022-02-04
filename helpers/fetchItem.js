const fetchItem = async (id) => {
  try {
    const API_URL = `https://api.mercadolibre.com/items/${id}`;
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
