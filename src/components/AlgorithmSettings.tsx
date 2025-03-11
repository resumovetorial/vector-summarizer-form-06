
import React from 'react';
import FormField from './FormField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface AlgorithmSettingsProps {
  algorithm: string;
  onAlgorithmChange: (value: string) => void;
  dimensions: number;
  onDimensionsChange: (value: number) => void;
  normalization: boolean;
  onNormalizationChange: (value: boolean) => void;
  weightFactor: number;
  onWeightFactorChange: (value: number) => void;
}

const AlgorithmSettings: React.FC<AlgorithmSettingsProps> = ({
  algorithm,
  onAlgorithmChange,
  dimensions,
  onDimensionsChange,
  normalization,
  onNormalizationChange,
  weightFactor,
  onWeightFactorChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          id="algorithm"
          label="Algoritmo de Vetorização"
          animationDelay={450}
        >
          <Select
            value={algorithm}
            onValueChange={onAlgorithmChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o algoritmo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tf-idf">TF-IDF</SelectItem>
              <SelectItem value="word2vec">Word2Vec</SelectItem>
              <SelectItem value="glove">GloVe</SelectItem>
              <SelectItem value="bert">BERT Embeddings</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        
        <FormField
          id="dimensions"
          label={`Dimensões do Vetor: ${dimensions}`}
          animationDelay={500}
        >
          <Slider
            id="dimensions"
            value={[dimensions]}
            min={50}
            max={300}
            step={10}
            onValueChange={([value]) => onDimensionsChange(value)}
            className="py-4"
          />
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <FormField
          id="normalization"
          label="Normalização do Vetor"
          description="Normalizar valores do vetor entre -1 e 1"
          animationDelay={550}
        >
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="normalization"
              checked={normalization}
              onCheckedChange={onNormalizationChange}
            />
            <label htmlFor="normalization" className="text-sm font-medium">
              {normalization ? 'Ativado' : 'Desativado'}
            </label>
          </div>
        </FormField>
        
        <FormField
          id="weightFactor"
          label={`Fator de Peso: ${weightFactor.toFixed(2)}`}
          description="Ajuste o peso dos componentes vetoriais"
          animationDelay={600}
        >
          <Slider
            id="weightFactor"
            value={[weightFactor]}
            min={0.1}
            max={1}
            step={0.01}
            onValueChange={([value]) => onWeightFactorChange(value)}
            className="py-4"
          />
        </FormField>
      </div>
    </>
  );
};

export default AlgorithmSettings;
