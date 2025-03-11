
import { FormData } from "@/types/vectorForm";

export const calculateTotalQuantity = (formData: FormData): string => {
  const qtResidencias = parseInt(formData.qt_residencias) || 0;
  const qtComercio = parseInt(formData.qt_comercio) || 0;
  const qtTerrenoBaldio = parseInt(formData.qt_terreno_baldio) || 0;
  const qtPe = parseInt(formData.qt_pe) || 0;
  const qtOutros = parseInt(formData.qt_outros) || 0;
  
  const total = qtResidencias + qtComercio + qtTerrenoBaldio + qtPe + qtOutros;
  
  return total.toString();
};
