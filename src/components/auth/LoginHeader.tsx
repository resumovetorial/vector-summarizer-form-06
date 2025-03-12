
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";

const LoginHeader: React.FC = () => {
  return (
    <>
      <div className="flex justify-center mb-4">
        <img 
          src="/lovable-uploads/b6d22591-56f9-448f-8acf-120f160d571f.png" 
          alt="Brasão de Itabuna" 
          className="h-24 w-auto"
        />
      </div>
      <CardTitle className="text-2xl font-bold">DIVISÃO DE ENDEMIAS ITABUNA</CardTitle>
      <CardDescription>Sistema de resumo vetorial</CardDescription>
    </>
  );
};

export default LoginHeader;
