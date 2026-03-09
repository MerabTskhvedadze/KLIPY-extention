import api from "../lib/axios";

export async function getTrendingGifs({
  page = 1,
  perPage = 12,
  customerId = "klipy-extension",
  locale = "en",
} = {}) {
  const appKey = import.meta.env.VITE_APP_KEY;

  const response = await api.get(`/${appKey}/gifs/trending`, {
    params: {
      page,
      per_page: perPage,
      customer_id: customerId,
      locale,
    },
  });

  return response.data.data.data;
}