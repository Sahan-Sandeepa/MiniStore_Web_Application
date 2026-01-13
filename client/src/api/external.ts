import axiosInstance from "./axios";
import { ProductReadDto } from "../types/product";

// Fetch products from Fake Store (external API via our backend)
export const fetchExternalProducts = async () => {
  const res = await axiosInstance.get<ProductReadDto[]>("/external/products");
  return res.data;
};

// Import individual external product into our DB (admin only)
export const importExternalProduct = async (externalId: number) => {
  const res = await axiosInstance.post<ProductReadDto>(
    "/external/products/import",
    {
      externalId,
    }
  );
  return res.data;
};
