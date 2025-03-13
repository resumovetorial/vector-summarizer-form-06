
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import AccessLevelGuard from '@/components/AccessLevelGuard';
import AdminHeader from '@/components/admin/AdminHeader';
import UserManagement from '@/components/admin/UserManagement';
import LocalitiesManagement from '@/components/admin/LocalitiesManagement';
import AccessLevels from '@/components/admin/AccessLevels';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto py-6">
      <AccessLevelGuard 
        requiredLevel="administrador"
        fallbackMessage="Você precisa ter acesso de administrador para visualizar o painel administrativo."
      >
        <AdminHeader 
          title="Painel Administrativo" 
          description="Gerencie usuários, localidades e níveis de acesso"
        />
        
        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="localities">Localidades</TabsTrigger>
            <TabsTrigger value="access-levels">Níveis de Acesso</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>
          <TabsContent value="localities" className="mt-6">
            <LocalitiesManagement />
          </TabsContent>
          <TabsContent value="access-levels" className="mt-6">
            <AccessLevels />
          </TabsContent>
        </Tabs>
      </AccessLevelGuard>
    </div>
  );
};

export default Admin;
