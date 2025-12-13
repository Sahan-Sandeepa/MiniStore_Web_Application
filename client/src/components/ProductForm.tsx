import React, { useState, useEffect } from "react";
import { ProductCreateDto, ProductReadDto } from "../types/product";

interface Props {
  onSubmit: (data: ProductCreateDto) => void;
  initialData?: ProductReadDto;
  onCancel?: () => void;
}

const ProductForm: React.FC<Props> = ({ onSubmit, initialData, onCancel }) => {
  const [form, setForm] = useState<ProductCreateDto>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        stock: initialData.stock,
        category: initialData.category,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border p-4 rounded shadow">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
          {initialData ? "Update" : "Create"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
