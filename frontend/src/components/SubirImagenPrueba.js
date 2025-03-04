import { useState } from "react";

function SubirImagenPrueba() {
  const [imagen, setImagen] = useState(null);

  const handleFileChange = (event) => {
    setImagen(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imagen) {
      alert("Selecciona una imagen primero.");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", imagen);

    try {
      const response = await fetch("http://localhost:5000/subir-imagen-prueba", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Imagen</button>
    </div>
  );
}

export default SubirImagenPrueba;
