// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Café Delivery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow">
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="w-full h-48 object-cover rounded"
              />
            )}
            <h2 className="text-2xl font-semibold mt-4">{p.name}</h2>
            {p.description && (
              <p className="text-gray-600 mt-2">{p.description}</p>
            )}
            <div className="mt-4 font-bold text-lg">${p.price.toFixed(2)}</div>
            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
