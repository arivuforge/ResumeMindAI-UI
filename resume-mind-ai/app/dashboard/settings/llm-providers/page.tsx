'use client';

import { useState } from 'react';
import ProviderCard, { ProviderStatus } from '@/app/components/dashboard/settings/ProviderCard';
import ConfigureProviderForm, {
  ProviderFormData,
  ProviderType,
} from '@/app/components/dashboard/settings/ConfigureProviderForm';

interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  model: string;
  status: ProviderStatus;
  latency?: number;
  errorMessage?: string;
  logoInitials: string;
  logoColorClass: string;
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'OpenAI',
    type: 'openai',
    model: 'gpt-4-turbo',
    status: 'connected',
    latency: 145,
    logoInitials: 'OA',
    logoColorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  {
    id: '2',
    name: 'Anthropic',
    type: 'anthropic',
    model: 'claude-3-opus',
    status: 'inactive',
    logoInitials: 'AN',
    logoColorClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  },
  {
    id: '3',
    name: 'Azure OpenAI',
    type: 'azure-openai',
    model: 'gpt-3.5-turbo',
    status: 'error',
    errorMessage: 'Timeout',
    logoInitials: 'AZ',
    logoColorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
];

export default function LLMProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const handleAddNew = () => {
    setEditingProvider(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    const provider = providers.find((p) => p.id === id);
    if (provider) {
      setEditingProvider(provider);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRetry = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'connected' as ProviderStatus, latency: 200 } : p
      )
    );
  };

  const handleSave = (data: ProviderFormData) => {
    const providerNames: Record<ProviderType, string> = {
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      'google-gemini': 'Google Gemini',
      'azure-openai': 'Azure OpenAI',
      ollama: 'Ollama',
      huggingface: 'Hugging Face',
      custom: 'Custom Provider',
    };

    const providerColors: Record<ProviderType, string> = {
      openai: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      anthropic: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'google-gemini': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'azure-openai': 'bg-sky-500/10 text-sky-500 border-sky-500/20',
      ollama: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      huggingface: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      custom: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    const providerInitials: Record<ProviderType, string> = {
      openai: 'OA',
      anthropic: 'AN',
      'google-gemini': 'GG',
      'azure-openai': 'AZ',
      ollama: 'OL',
      huggingface: 'HF',
      custom: 'CU',
    };

    if (editingProvider) {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === editingProvider.id
            ? {
                ...p,
                type: data.providerType,
                name: providerNames[data.providerType],
                model: data.modelName,
                logoInitials: providerInitials[data.providerType],
                logoColorClass: providerColors[data.providerType],
              }
            : p
        )
      );
    } else {
      const newProvider: Provider = {
        id: Date.now().toString(),
        name: providerNames[data.providerType],
        type: data.providerType,
        model: data.modelName,
        status: 'inactive',
        logoInitials: providerInitials[data.providerType],
        logoColorClass: providerColors[data.providerType],
      };
      setProviders((prev) => [...prev, newProvider]);
    }

    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const handleTestConnection = async (): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return Math.random() > 0.3;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Provider Management</h2>
          <p className="text-sm text-slate-400">Configure LLM providers for LiteLLM orchestration.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-violet-600 text-white text-sm font-medium rounded-lg transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
        >
          <span className="material-symbols-outlined mr-2 text-lg">add_circle</span>
          Add New Provider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            id={provider.id}
            name={provider.name}
            model={provider.model}
            status={provider.status}
            latency={provider.latency}
            errorMessage={provider.errorMessage}
            logoInitials={provider.logoInitials}
            logoColorClass={provider.logoColorClass}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRetry={provider.status === 'error' ? handleRetry : undefined}
          />
        ))}
      </div>

      {isFormOpen && (
        <ConfigureProviderForm
          mode={editingProvider ? 'edit' : 'create'}
          initialData={
            editingProvider
              ? {
                  providerType: editingProvider.type,
                  modelName: editingProvider.model,
                }
              : undefined
          }
          onSave={handleSave}
          onCancel={handleCancel}
          onTestConnection={handleTestConnection}
        />
      )}
    </div>
  );
}
