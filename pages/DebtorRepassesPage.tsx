
import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate, getYYYYMMDDString } from '@/utils/formatters';
import type { DebtorAgreement } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { PlusCircle, Edit2, Trash2, Search, UploadCloud, Landmark } from 'lucide-react';

const mockAgreements: DebtorAgreement[] = [
  { id: 'da001', debtorName: 'Devedor X Soluções', agreementDate: '2023-06-01', totalAmount: 10000, installments: 5, amountPerInstallment: 2000, officeSharePercentage: 30, clientSharePercentage: 70, officeReceivable: 3000, clientReceivable: 7000, status: 'Pendente Parcial', lastPaymentDate: '2023-08-01' },
  { id: 'da002', debtorName: 'Empresa Y Devedora', agreementDate: '2023-03-15', totalAmount: 5000, installments: 1, amountPerInstallment: 5000, officeSharePercentage: 25, clientSharePercentage: 75, officeReceivable: 1250, clientReceivable: 3750, status: 'Pago', lastPaymentDate: '2023-03-20' },
  { id: 'da003', debtorName: 'Indivíduo Z Pendente', agreementDate: '2023-08-10', totalAmount: 20000, installments: 10, amountPerInstallment: 2000, officeSharePercentage: 30, clientSharePercentage: 70, officeReceivable: 6000, clientReceivable: 14000, status: 'Pendente Total' },
];

const DebtorRepassesPage: React.FC = () => {
  const { isConfidentialMode } = useAuthStore();
  const [agreements, setAgreements] = useState<DebtorAgreement[]>(mockAgreements);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<DebtorAgreement | Partial<DebtorAgreement> | null>(null);
  
  const [isRepasseModalOpen, setIsRepasseModalOpen] = useState(false);
  const [selectedAgreementForRepasse, setSelectedAgreementForRepasse] = useState<DebtorAgreement | null>(null);
  const [repassDate, setRepassDate] = useState<string>(getYYYYMMDDString(new Date()));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null);


  const filteredAgreements = agreements.filter(agreement =>
    agreement.debtorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleOpenAgreementModal = (agreement?: DebtorAgreement) => {
    setEditingAgreement(agreement || { 
      debtorName: '', agreementDate: '', totalAmount: 0, installments: 1, 
      officeSharePercentage: 30, clientSharePercentage: 70, status: 'Pendente Total' 
    });
    setIsAgreementModalOpen(true);
  };

  const handleCloseAgreementModal = () => {
    setIsAgreementModalOpen(false);
    setEditingAgreement(null);
  };
  
  const handleSaveAgreement = () => {
    if (!editingAgreement) return;
    const total = editingAgreement.totalAmount || 0;
    const officeShare = editingAgreement.officeSharePercentage || 0;
    
    const updatedAgreement = {
        ...editingAgreement,
        amountPerInstallment: editingAgreement.installments ? total / editingAgreement.installments : total,
        officeReceivable: (total * officeShare) / 100,
        clientReceivable: total - ((total * officeShare) / 100),
    }

    if ('id' in editingAgreement && editingAgreement.id) {
      setAgreements(agreements.map(a => a.id === updatedAgreement.id ? updatedAgreement as DebtorAgreement : a));
    } else {
      const newAgreement = { ...updatedAgreement, id: `da${Date.now()}` } as DebtorAgreement;
      setAgreements([...agreements, newAgreement]);
    }
    handleCloseAgreementModal();
  };
  
  const handleDeleteAgreement = (agreementId: string) => {
    setAgreements(agreements.filter(a => a.id !== agreementId));
  };

  const handleOpenRepasseModal = (agreement: DebtorAgreement) => {
    setSelectedAgreementForRepasse(agreement);
    setRepassDate(getYYYYMMDDString(new Date()));
    setComprovanteFile(null);
    setIsRepasseModalOpen(true);
  };

  const handleRegisterRepasse = () => {
    if (!selectedAgreementForRepasse) return;
    console.log(`Registrando repasse para ${selectedAgreementForRepasse.debtorName} em ${repassDate} com comprovante: ${comprovanteFile?.name || 'Nenhum'}`);
    // Update agreement status to 'Repassado' (or partially)
    setAgreements(agreements.map(a => a.id === selectedAgreementForRepasse.id ? {...a, status: 'Repassado', lastPaymentDate: repassDate } : a)); // Simplified
    setIsRepasseModalOpen(false);
    setSelectedAgreementForRepasse(null);
  };

  const getStatusClass = (status: DebtorAgreement['status']) => {
    if (status.includes('Pago') || status.includes('Repassado')) return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
    if (status.includes('Pendente Parcial')) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100';
    if (status.includes('Pendente Total')) return 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Controle de Repasses a Clientes</h1>
        <Button onClick={() => handleOpenAgreementModal()}>
          <PlusCircle className="mr-2 h-5 w-5" /> Novo Acordo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Acordos de Devedores</CardTitle>
          <CardDescription>Registre acordos, pagamentos de devedores e repasses aos clientes.</CardDescription>
          <div className="mt-4 relative">
            <Input 
              placeholder="Buscar por nome do devedor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          {filteredAgreements.length === 0 ? (
             <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum acordo encontrado.</p>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['Devedor', 'Data Acordo', 'Valor Total', 'Parcelas', 'Valor Escritório', 'Valor Cliente', 'Status', 'Ações'].map(header => (
                    <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAgreements.map((agreement) => (
                  <tr key={agreement.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{agreement.debtorName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(agreement.agreementDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatCurrency(agreement.totalAmount, isConfidentialMode)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{agreement.installments}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{formatCurrency(agreement.officeReceivable, isConfidentialMode)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">{formatCurrency(agreement.clientReceivable, isConfidentialMode)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(agreement.status)}`}>
                        {agreement.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-1">
                      <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800" onClick={() => handleOpenAgreementModal(agreement)} title="Editar Acordo">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                       <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-800" onClick={() => handleOpenRepasseModal(agreement)} title="Registrar Repasse" disabled={agreement.status === 'Repassado'}>
                        <Landmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteAgreement(agreement.id)} title="Excluir Acordo">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Agreement Modal (Add/Edit) */}
      {editingAgreement && (
        <Dialog isOpen={isAgreementModalOpen} onClose={handleCloseAgreementModal} title={('id' in editingAgreement && editingAgreement.id) ? "Editar Acordo" : "Novo Acordo"}>
          <div className="space-y-3">
            <div><Label htmlFor="debtorName">Nome do Devedor</Label><Input id="debtorName" value={editingAgreement.debtorName || ''} onChange={(e) => setEditingAgreement({...editingAgreement, debtorName: e.target.value})} /></div>
            <div><Label htmlFor="agreementDate">Data do Acordo</Label><Input id="agreementDate" type="date" value={getYYYYMMDDString(editingAgreement.agreementDate)} onChange={(e) => setEditingAgreement({...editingAgreement, agreementDate: e.target.value})} /></div>
            <div><Label htmlFor="totalAmount">Valor Total (R$)</Label><Input id="totalAmount" type="number" value={editingAgreement.totalAmount || 0} onChange={(e) => setEditingAgreement({...editingAgreement, totalAmount: parseFloat(e.target.value)})} /></div>
            <div><Label htmlFor="installments">Nº de Parcelas</Label><Input id="installments" type="number" value={editingAgreement.installments || 1} onChange={(e) => setEditingAgreement({...editingAgreement, installments: parseInt(e.target.value)})} /></div>
            <div><Label htmlFor="officeSharePercentage">Percentual Escritório (%)</Label><Input id="officeSharePercentage" type="number" value={editingAgreement.officeSharePercentage || 30} onChange={(e) => setEditingAgreement({...editingAgreement, officeSharePercentage: parseFloat(e.target.value)})} /></div>
            {/* clientSharePercentage is calculated or can be set if logic changes */}
            <div>
              <Label htmlFor="agreementStatus">Status</Label>
              <select id="agreementStatus" value={editingAgreement.status || 'Pendente Total'} onChange={(e) => setEditingAgreement({...editingAgreement, status: e.target.value as DebtorAgreement['status']})} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="Pendente Total">Pendente Total</option>
                <option value="Pendente Parcial">Pendente Parcial</option>
                <option value="Pago">Pago (Devedor quitou)</option>
                <option value="Repassado">Repassado (Cliente recebeu)</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <Button variant="outline" onClick={handleCloseAgreementModal}>Cancelar</Button>
              <Button onClick={handleSaveAgreement}>Salvar Acordo</Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Repasse Modal */}
      {selectedAgreementForRepasse && (
        <Dialog isOpen={isRepasseModalOpen} onClose={() => setIsRepasseModalOpen(false)} title={`Registrar Repasse para ${selectedAgreementForRepasse.debtorName}`}>
           <div className="space-y-4">
            <p className="text-sm">Cliente a receber: <span className="font-semibold">{formatCurrency(selectedAgreementForRepasse.clientReceivable, isConfidentialMode)}</span></p>
            <div>
              <Label htmlFor="repassDate">Data do Repasse</Label>
              <Input id="repassDate" type="date" value={repassDate} onChange={(e) => setRepassDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="comprovanteFile">Comprovante (Opcional)</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Carregar um arquivo</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setComprovanteFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  {comprovanteFile && <p className="text-xs text-gray-500 dark:text-gray-400">{comprovanteFile.name}</p>}
                   <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, PDF até 10MB</p>
                </div>
              </div>
            </div>
             <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsRepasseModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleRegisterRepasse}>Registrar Repasse</Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default DebtorRepassesPage;
