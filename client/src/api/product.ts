import axiosInstance from "./axios";
import { ProductReadDto, ProductCreateDto } from "../types/product";

const BASE = "/Product";

export const getProducts = async () => {
  const res = await axiosInstance.get<ProductReadDto[]>(BASE);
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await axiosInstance.get<ProductReadDto>(`${BASE}/${id}`);
  return res.data;
};

export const createProduct = async (data: ProductCreateDto) => {
  const res = await axiosInstance.post<ProductReadDto>(BASE, data);
  return res.data;
};

export const updateProduct = async (id: string, data: ProductCreateDto) => {
  await axiosInstance.put(`${BASE}/${id}`, data);
};

export const deleteProduct = async (id: string) => {
  await axiosInstance.delete(`${BASE}/${id}`);
};

export const searchProducts = async (query: string) => {
  const res = await axiosInstance.get<ProductReadDto[]>(
    `${BASE}/search?query=${query}`
  );
  return res.data;
};
