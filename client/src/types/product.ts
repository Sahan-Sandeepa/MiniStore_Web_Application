export interface ProductReadDto {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
}

export interface ProductCreateDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}
