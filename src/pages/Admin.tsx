
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/admin/AdminHeader';
import UserManagement from '@/components/admin/UserManagement';
import AccessLevels from '@/components/admin/AccessLevels';
import LocalitiesManagement from '@/components/admin/LocalitiesManagement';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('users');

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar ao Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        </div>

        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="access">Níveis de Acesso</TabsTrigger>
            <TabsTrigger value="localities">Localidades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="access">
            <AccessLevels />
          </TabsContent>
          
          <TabsContent value="localities">
            <LocalitiesManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
