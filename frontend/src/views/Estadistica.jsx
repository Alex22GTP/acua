import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdBarChart, MdCheckCircle, MdAccessTime, MdTrendingUp } from "react-icons/md";
import Navbar from '../components/Navbar1';

// Responsive styles
const StatsContainer = styled.div`
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 80px;
  font-family: 'Poppins', sans-serif;
  
  @media (max-width: 768px) {
    margin-top: 70px;
    padding: 1rem;
    box-shadow: none;
    border-radius: 0;
  }
`;

const StatsHeader = styled.h2`
  color: #1d3557;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const StatsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.2rem 0.8rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

const StatIcon = styled.div`
  font-size: 1.8rem;
  color: #457b9d;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StatValue = styled.h3`
  color: #1d3557;
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StatLabel = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const StatsTableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHeader = styled.th`
  background-color: #457b9d;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
`;

function Statistics() {
  const [stats, setStats] = useState({
    correctos: 0,
    total: 0,
    successRate: 0,
    averageTime: "0 min",
  });

  const [catalogDetails, setCatalogDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        const statsResponse = await fetch(`http://localhost:5000/api/user/${userId}/statistics`);
        const statsData = await statsResponse.json();

        const successRate = statsData.total > 0 
          ? Math.round((statsData.correctos / statsData.total) * 100) 
          : 0;

        setStats({
          correctos: statsData.correctos,
          total: statsData.total,
          successRate: successRate,
          averageTime: "0 min",
        });

        const responsesResponse = await fetch(`http://localhost:5000/api/user/${userId}/responses`);
        const responsesData = await responsesResponse.json();

        const formattedDetails = responsesData.map((response, index) => ({
          id: index + 1,
          name: response.titulo,
          date: new Date(response.fecha).toLocaleDateString(),
          score: response.resultado ? "Correcto" : "Incorrecto",
          time: "0 min",
        }));

        setCatalogDetails(formattedDetails);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userId]);

  return (
    <>
      <Navbar />
      <StatsContainer>
        <StatsHeader>Estadísticas de Catálogos Resueltos</StatsHeader>

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

        {loading ? (
          <NoDataMessage>Cargando estadísticas...</NoDataMessage>
        ) : catalogDetails.length > 0 ? (
          <StatsTableContainer>
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
                    <TableCell>
                      <span style={{ 
                        color: catalog.score === "Correcto" ? "#2a9d8f" : "#e76f51",
                        fontWeight: 500
                      }}>
                        {catalog.score}
                      </span>
                    </TableCell>
                    <TableCell>{catalog.time}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StatsTable>
          </StatsTableContainer>
        ) : (
          <NoDataMessage>No hay datos de estadísticas disponibles</NoDataMessage>
        )}
      </StatsContainer>
    </>
  );
}

export default Statistics;