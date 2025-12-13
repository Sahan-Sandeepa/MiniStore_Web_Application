import axios from "axios";
import { ProductReadDto, ProductCreateDto } from "../types/product";

const API_BASE = "http://localhost:5298/api/Product";

export const getProducts = async () => {
  const res = await axios.get<ProductReadDto[]>(API_BASE);
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await axios.get<ProductReadDto>(`${API_BASE}/${id}`);
  return res.data;
};

export const createProduct = async (data: ProductCreateDto) => {
  const res = await axios.post<ProductReadDto>(API_BASE, data);
  return res.data;
};

export const updateProduct = async (id: string, data: ProductCreateDto) => {
  await axios.put(`${API_BASE}/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  await axios.delete(`${API_BASE}/${id}`);
};

export const searchProducts = async (query: string) => {
  const res = await axios.get<ProductReadDto[]>(`${API_BASE}/search?query=${query}`);
  return res.data;
};
