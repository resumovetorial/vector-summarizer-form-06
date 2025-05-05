
import React, { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, PenLine } from "lucide-react";
import { LocalityData } from '@/types/dashboard';
import LocalityDetailsDialog from './LocalityDetailsDialog';
import { useNavigate } from 'react-router-dom';
import { fetchVectorDataById } from '@/services/vector/vectorDataSaveService';
import { toast } from "sonner";

interface CycleLocalityTableRowProps {
  locality: LocalityData;
}

const CycleLocalityTableRow: React.FC<CycleLocalityTableRowProps> = ({ locality }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = async () => {
    // Check if we have an ID
    if (!locality.id) {
      toast.error("Não é possível editar: ID do registro não encontrado");
      return;
    }
    
    // Show toast and set loading state
    toast.info("Preparando edição de dados para " + locality.locality);
    setIsEditing(true);
    
    try {
      // Buscar os dados mais atualizados diretamente do banco
      const freshData = await fetchVectorDataById(locality.id);
      
      if (!freshData) {
        throw new Error("Não foi possível obter os dados mais recentes para edição");
      }
      
      console.log("Dados atualizados obtidos para edição:", freshData);
      
      // Convert data to form format
      const formData = {
        recordId: locality.id, // Ensure ID is correctly passed
        municipality: freshData.municipality || locality.municipality,
        locality: freshData.localities?.name || locality.locality,
        cycle: freshData.cycle || locality.cycle,
        epidemiologicalWeek: freshData.epidemiological_week || locality.epidemiologicalWeek,
        workModality: freshData.work_modality || locality.workModality,
        startDate: new Date(freshData.start_date || locality.startDate),
        endDate: new Date(freshData.end_date || locality.endDate),
        qt_residencias: (freshData.qt_residencias !== null ? freshData.qt_residencias : (locality.qt_residencias || 0)).toString(),
        qt_comercio: (freshData.qt_comercio !== null ? freshData.qt_comercio : (locality.qt_comercio || 0)).toString(),
        qt_terreno_baldio: (freshData.qt_terreno_baldio !== null ? freshData.qt_terreno_baldio : (locality.qt_terreno_baldio || 0)).toString(),
        qt_pe: (freshData.qt_pe !== null ? freshData.qt_pe : (locality.qt_pe || 0)).toString(),
        qt_outros: (freshData.qt_outros !== null ? freshData.qt_outros : (locality.qt_outros || 0)).toString(),
        qt_total: (freshData.qt_total !== null ? freshData.qt_total : (locality.qt_total || 0)).toString(),
        tratamento_focal: (freshData.tratamento_focal !== null ? freshData.tratamento_focal : (locality.tratamento_focal || 0)).toString(),
        tratamento_perifocal: (freshData.tratamento_perifocal !== null ? freshData.tratamento_perifocal : (locality.tratamento_perifocal || 0)).toString(),
        inspecionados: (freshData.inspections !== null ? freshData.inspections : (locality.inspections || 0)).toString(),
        amostras_coletadas: (freshData.amostras_coletadas !== null ? freshData.amostras_coletadas : (locality.amostras_coletadas || 0)).toString(),
        recusa: (freshData.recusa !== null ? freshData.recusa : (locality.recusa || 0)).toString(),
        fechadas: (freshData.fechadas !== null ? freshData.fechadas : (locality.fechadas || 0)).toString(),
        recuperadas: (freshData.recuperadas !== null ? freshData.recuperadas : (locality.recuperadas || 0)).toString(),
        a1: (freshData.a1 !== null ? freshData.a1 : (locality.a1 || 0)).toString(),
        a2: (freshData.a2 !== null ? freshData.a2 : (locality.a2 || 0)).toString(),
        b: (freshData.b !== null ? freshData.b : (locality.b || 0)).toString(),
        c: (freshData.c !== null ? freshData.c : (locality.c || 0)).toString(),
        d1: (freshData.d1 !== null ? freshData.d1 : (locality.d1 || 0)).toString(),
        d2: (freshData.d2 !== null ? freshData.d2 : (locality.d2 || 0)).toString(),
        e: (freshData.e !== null ? freshData.e : (locality.e || 0)).toString(),
        depositos_eliminados: (freshData.deposits_eliminated !== null ? freshData.deposits_eliminated : (locality.depositsEliminated || 0)).toString(),
        larvicida: freshData.larvicida || locality.larvicida || '',
        quantidade_larvicida: (freshData.quantidade_larvicida !== null ? freshData.quantidade_larvicida : (locality.quantidade_larvicida || 0)).toString(),
        quantidade_depositos_tratados: (freshData.quantidade_depositos_tratados !== null ? freshData.quantidade_depositos_tratados : (locality.quantidade_depositos_tratados || 0)).toString(),
        adulticida: freshData.adulticida || locality.adulticida || '',
        quantidade_cargas: (freshData.quantidade_cargas !== null ? freshData.quantidade_cargas : (locality.quantidade_cargas || 0)).toString(),
        total_tec_saude: (freshData.total_tec_saude !== null ? freshData.total_tec_saude : (locality.total_tec_saude || 0)).toString(),
        total_dias_trabalhados: (freshData.total_dias_trabalhados !== null ? freshData.total_dias_trabalhados : (locality.total_dias_trabalhados || 0)).toString(),
        nome_supervisor: freshData.supervisor || locality.supervisor || ''
      };
      
      console.log("Dados preparados para o formulário de edição:", formData);
      
      // Armazenar o ID original para garantir que seja mantido
      localStorage.setItem('editing_record_id', locality.id);
      
      // Navigate to form with edit data
      navigate('/', { state: { editMode: true, vectorDataToEdit: formData } });
    } catch (error) {
      console.error("Erro ao preparar dados para edição:", error);
      toast.error("Falha ao preparar edição. Tente novamente.");
      setIsEditing(false);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{locality.locality}</TableCell>
        <TableCell>SE {locality.epidemiologicalWeek}</TableCell>
        <TableCell>{locality.supervisor}</TableCell>
        <TableCell className="text-right">{locality.totalProperties}</TableCell>
        <TableCell className="text-right">{locality.inspections}</TableCell>
        <TableCell className="text-right">{locality.depositsEliminated}</TableCell>
        <TableCell className="text-right">{locality.depositsTreated}</TableCell>
        <TableCell className="text-right">{locality.tratamento_focal}</TableCell>
        <TableCell className="text-right">{locality.tratamento_perifocal}</TableCell>
        <TableCell className="text-right">{locality.amostras_coletadas}</TableCell>
        <TableCell className="text-right">{locality.fechadas}</TableCell>
        <TableCell className="text-right">{locality.recuperadas}</TableCell>
        <TableCell className="text-center flex gap-1 justify-center">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowDetails(true)}
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            Detalhes
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleEditClick}
            disabled={isEditing}
            className="flex items-center justify-center gap-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <PenLine className="h-3.5 w-3.5" />
            {isEditing ? "Carregando..." : "Editar"}
          </Button>
        </TableCell>
      </TableRow>
      
      <LocalityDetailsDialog
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        locality={locality}
      />
    </>
  );
};

export default CycleLocalityTableRow;
