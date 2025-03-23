import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdBarChart, MdCheckCircle, MdAccessTime, MdTrendingUp } from "react-icons/md";
import Navbar from '../components/Navbar2';

// Estilos basados en las interfaces anteriores
const StatsContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 100px; /* Ajuste para evitar solapamiento con el Navbar */
  font-family: 'Poppins', sans-serif;
`;

const StatsHeader = styled.h2`
  color: #1d3557;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
`;

const StatsSummary = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
  width: 22%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: #457b9d;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.h3`
  color: #1d3557;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  color: #457b9d;
  font-size: 1rem;
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
`;

const TableHeader = styled.th`
  background-color: #457b9d;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f0f0f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #1d3557;
  border-bottom: 1px solid #ddd;
`;

function Statistics() {
  const [stats, setStats] = useState({
    correctos: 0,
    total: 0,
    successRate: 0,
    averageTime: "0 min", // Este dato no está en el backend, lo dejamos como ejemplo
  });

  const [catalogDetails, setCatalogDetails] = useState([]); // Detalles de los escenarios resueltos
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario desde el localStorage

  // Obtener estadísticas del usuario
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Obtener estadísticas generales
        const statsResponse = await fetch(`http://localhost:5000/api/user/${userId}/statistics`);
        const statsData = await statsResponse.json();

        // Calcular el porcentaje de éxito
        const successRate = statsData.total > 0 ? Math.round((statsData.correctos / statsData.total) * 100) : 0;

        // Actualizar el estado de las estadísticas
        setStats({
          correctos: statsData.correctos,
          total: statsData.total,
          successRate: successRate,
          averageTime: "0 min", // Este dato no está en el backend, lo dejamos como ejemplo
        });

        // Obtener detalles de los escenarios resueltos
        const responsesResponse = await fetch(`http://localhost:5000/api/user/${userId}/responses`);
        const responsesData = await responsesResponse.json();

        // Formatear los datos para la tabla
        const formattedDetails = responsesData.map((response, index) => ({
          id: index + 1,
          name: response.titulo,
          date: new Date(response.fecha).toLocaleDateString(),
          score: response.resultado ? "Correcto" : "Incorrecto",
          time: "0 min", // Este dato no está en el backend, lo dejamos como ejemplo
        }));

        setCatalogDetails(formattedDetails);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    };

    fetchStatistics();
  }, [userId]);

  return (
    <>
      <Navbar /> {/* Agregar el Navbar */}
      <StatsContainer>
        <StatsHeader>Estadísticas de Catálogos Resueltos</StatsHeader>

        {/* Resumen de estadísticas */}
        <StatsSummary>
          <StatCard>
            <StatIcon>
              <MdBarChart />
            </StatIcon>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total de Intentos</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon>
              <MdCheckCircle />
            </StatIcon>
            <StatValue>{stats.correctos}</StatValue>
            <StatLabel>Correctos</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon>
              <MdTrendingUp />
            </StatIcon>
            <StatValue>{stats.successRate}%</StatValue>
            <StatLabel>Porcentaje de Éxito</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon>
              <MdAccessTime />
            </StatIcon>
            <StatValue>{stats.averageTime}</StatValue>
            <StatLabel>Tiempo Promedio</StatLabel>
          </StatCard>
        </StatsSummary>

        {/* Tabla de catálogos resueltos */}
        <StatsTable>
          <thead>
            <TableRow>
              <TableHeader>Escenario</TableHeader>
              <TableHeader>Fecha</TableHeader>
              <TableHeader>Resultado</TableHeader>
              <TableHeader>Tiempo</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {catalogDetails.map((catalog) => (
              <TableRow key={catalog.id}>
                <TableCell>{catalog.name}</TableCell>
                <TableCell>{catalog.date}</TableCell>
                <TableCell>{catalog.score}</TableCell>
                <TableCell>{catalog.time}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </StatsTable>
      </StatsContainer>
    </>
  );
}

export default Statistics;