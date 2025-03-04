import { useState, useEffect } from "react";

const MostrarImagen = ({ id }) => {
  const [imagenUrl, setImagenUrl] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const url = `http://localhost:5000/imagen/${id}`;
    console.log(`🔎 Buscando imagen en: ${url}`); // 📌 Debug

    fetch(url)
      .then((response) => {
        console.log("📥 Respuesta del servidor:", response);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const imgURL = URL.createObjectURL(blob);
        console.log("🎨 Imagen convertida en URL:", imgURL);
        setImagenUrl(imgURL);
        setCargando(false);
      })
      .catch((error) => {
        console.error("🚨 Error al cargar la imagen:", error);
        setError(error.message);
        setCargando(false);
      });
  }, [id]);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Imagen cargada desde PostgreSQL</h3>
      <img src={imagenUrl} alt="Imagen desde BD" width="300" />
    </div>
  );
};

export default MostrarImagen;
