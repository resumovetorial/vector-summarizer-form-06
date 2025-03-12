
import { LocalityData } from "@/types/dashboard";

// Mock data for the dashboard
export const mockDashboardData: LocalityData[] = [
  {
    municipality: "Itabuna",
    locality: "Centro",
    cycle: "01",
    epidemiologicalWeek: "01",
    workModality: "LI",
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    totalProperties: 120,
    inspections: 100,
    depositsEliminated: 15,
    depositsTreated: 8,
    supervisor: "Maria Silva"
  },
  {
    municipality: "Itabuna",
    locality: "Mangabinha",
    cycle: "01",
    epidemiologicalWeek: "01",
    workModality: "LI",
    startDate: "2024-01-01",
    endDate: "2024-01-07",
    totalProperties: 85,
    inspections: 70,
    depositsEliminated: 12,
    depositsTreated: 6,
    supervisor: "João Santos"
  },
  {
    municipality: "Itabuna",
    locality: "São Caetano",
    cycle: "01",
    epidemiologicalWeek: "02",
    workModality: "LI",
    startDate: "2024-01-08",
    endDate: "2024-01-14",
    totalProperties: 95,
    inspections: 80,
    depositsEliminated: 10,
    depositsTreated: 5,
    supervisor: "Pedro Almeida"
  },
  {
    municipality: "Itabuna",
    locality: "Zizo",
    cycle: "01",
    epidemiologicalWeek: "02",
    workModality: "LI",
    startDate: "2024-01-08",
    endDate: "2024-01-14",
    totalProperties: 70,
    inspections: 60,
    depositsEliminated: 8,
    depositsTreated: 4,
    supervisor: "Ana Oliveira"
  },
  {
    municipality: "Itabuna",
    locality: "Centro",
    cycle: "02",
    epidemiologicalWeek: "05",
    workModality: "LI",
    startDate: "2024-01-29",
    endDate: "2024-02-04",
    totalProperties: 125,
    inspections: 110,
    depositsEliminated: 18,
    depositsTreated: 9,
    supervisor: "Maria Silva"
  },
  {
    municipality: "Itabuna",
    locality: "Mangabinha",
    cycle: "02",
    epidemiologicalWeek: "05",
    workModality: "LI",
    startDate: "2024-01-29",
    endDate: "2024-02-04",
    totalProperties: 90,
    inspections: 75,
    depositsEliminated: 14,
    depositsTreated: 7,
    supervisor: "João Santos"
  },
  {
    municipality: "Itabuna",
    locality: "Pontalzinho",
    cycle: "01",
    epidemiologicalWeek: "03",
    workModality: "PE",
    startDate: "2024-01-15",
    endDate: "2024-01-21",
    totalProperties: 110,
    inspections: 90,
    depositsEliminated: 20,
    depositsTreated: 12,
    supervisor: "Carlos Pereira"
  },
  {
    municipality: "Itabuna",
    locality: "Nova Itabuna",
    cycle: "01",
    epidemiologicalWeek: "04",
    workModality: "PE",
    startDate: "2024-01-22",
    endDate: "2024-01-28",
    totalProperties: 100,
    inspections: 85,
    depositsEliminated: 17,
    depositsTreated: 10,
    supervisor: "Fernanda Costa"
  },
  {
    municipality: "Itabuna",
    locality: "Pontalzinho",
    cycle: "02",
    epidemiologicalWeek: "10",
    workModality: "PE",
    startDate: "2024-03-04",
    endDate: "2024-03-10",
    totalProperties: 115,
    inspections: 95,
    depositsEliminated: 22,
    depositsTreated: 14,
    supervisor: "Carlos Pereira"
  },
  {
    municipality: "Itabuna",
    locality: "Nova Itabuna",
    cycle: "02",
    epidemiologicalWeek: "11",
    workModality: "PE",
    startDate: "2024-03-11",
    endDate: "2024-03-17",
    totalProperties: 105,
    inspections: 90,
    depositsEliminated: 19,
    depositsTreated: 11,
    supervisor: "Fernanda Costa"
  }
];

// Function to simulate fetching dashboard data
export const fetchDashboardData = async (year: string = "2024"): Promise<LocalityData[]> => {
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Filter by year (in a real implementation, this would be a database query)
  return mockDashboardData.filter(data => data.startDate.startsWith(year));
};
