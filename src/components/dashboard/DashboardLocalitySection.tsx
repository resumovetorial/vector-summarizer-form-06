
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalityData } from '@/types/dashboard';
import LocalitySelector from '@/components/formSteps/LocalitySelector';
import LocalityDetails from '@/components/dashboard/LocalityDetails';
import LocalityDataTable from '@/components/dashboard/LocalityDataTable';

interface DashboardLocalitySectionProps {
  selectedLocality: string;
  onLocalityChange: (value: string) => void;
  localityData: LocalityData | null;
  localityHistoricalData: LocalityData[];
}

const DashboardLocalitySection: React.FC<DashboardLocalitySectionProps> = ({
  selectedLocality,
  onLocalityChange,
  localityData,
  localityHistoricalData
}) => {
  return (
    <>
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Detalhes por Localidade</CardTitle>
            <CardDescription>
              Selecione uma localidade para visualizar todos os dados inseridos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto md:mx-0">
              <LocalitySelector
                value={selectedLocality}
                onChange={onLocalityChange}
              />
            </div>
            
            {localityData && (
              <div className="mt-6">
                <LocalityDetails data={localityData} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {selectedLocality && localityHistoricalData.length > 0 && (
        <div className="mb-8">
          <LocalityDataTable data={localityHistoricalData} />
        </div>
      )}
    </>
  );
};

export default DashboardLocalitySection;
