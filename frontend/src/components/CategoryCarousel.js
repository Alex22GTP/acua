import React, { useEffect, useState } from "react";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [imageError, setImageError] = useState(false);

  // Obtener las categorías desde el servidor
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getCategories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  // Función para obtener la imagen de la categoría por su ID
  const fetchImage = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/imagen/${id}`);
      if (!response.ok) {
        throw new Error("Imagen no encontrada");
      }

      const imageBlob = await response.blob(); // Obtener la imagen como Blob
      const imageUrl = URL.createObjectURL(imageBlob); // Crear URL para la imagen

      return imageUrl;
    } catch (error) {
      setImageError(true);
      console.error("Error al obtener la imagen:", error);
      return null;
    }
  };

  return (
    <div>
      <h2>Categorías</h2>
      {categories.length > 0 ? (
        <div className="carousel">
          {categories.map((category) => (
            <div key={category.id_catalogo} className="carousel-item">
              <h3>{category.nombre}</h3>
              {imageError ? (
                <p>Imagen no encontrada</p>
              ) : (
                <img
                  src={fetchImage(category.id_catalogo)}
                  alt={category.nombre}
                  style={{ width: "200px", height: "200px" }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Cargando categorías...</p>
      )}
    </div>
  );
};

export default CategoryCarousel;
