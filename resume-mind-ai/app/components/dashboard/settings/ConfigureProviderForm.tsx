'use client';

import { useState } from 'react';

export type ProviderType =
  | 'openai'
  | 'anthropic'
  | 'google-gemini'
  | 'azure-openai'
  | 'ollama'
  | 'huggingface'
  | 'custom';

export interface ProviderFormData {
  providerType: ProviderType;
  modelName: string;
  baseUrl: string;
  apiKey: string;
}

interface ConfigureProviderFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<ProviderFormData>;
  onSave: (data: ProviderFormData) => void;
  onCancel: () => void;
  onTestConnection?: (data: ProviderFormData) => Promise<boolean>;
}

const providerOptions: { value: ProviderType; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'google-gemini', label: 'Google Gemini' },
  { value: 'azure-openai', label: 'Azure OpenAI' },
  { value: 'ollama', label: 'Ollama' },
  { value: 'huggingface', label: 'Hugging Face' },
  { value: 'custom', label: 'Custom (Generic)' },
];

export default function ConfigureProviderForm({
  mode,
  initialData,
  onSave,
  onCancel,
  onTestConnection,
}: ConfigureProviderFormProps) {
  const [formData, setFormData] = useState<ProviderFormData>({
    providerType: initialData?.providerType || 'openai',
    modelName: initialData?.modelName || '',
    baseUrl: initialData?.baseUrl || '',
    apiKey: initialData?.apiKey || '',
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleChange = (field: keyof ProviderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleTestConnection = async () => {
    if (!onTestConnection) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      const success = await onTestConnection(formData);
      setTestResult(success ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
          <span className="material-symbols-outlined">settings_suggest</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {mode === 'create' ? 'Configure Provider' : 'Edit Provider'}
          </h3>
          <p className="text-xs text-slate-400">Connect a new model or inference endpoint.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Provider Type
            </label>
            <div className="relative">
              <select
                value={formData.providerType}
                onChange={(e) => handleChange('providerType', e.target.value as ProviderType)}
                className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block p-2.5 appearance-none"
              >
                {providerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Model Name
            </label>
            <input
              type="text"
              value={formData.modelName}
              onChange={(e) => handleChange('modelName', e.target.value)}
              placeholder="e.g. gpt-4, claude-3-opus"
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block p-2.5 placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Base URL{' '}
              <span className="text-slate-600 normal-case tracking-normal font-normal">
                (Optional)
              </span>
            </label>
            <input
              type="text"
              value={formData.baseUrl}
              onChange={(e) => handleChange('baseUrl', e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block p-2.5 placeholder-slate-600"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="sk-..."
                className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary block p-2.5 placeholder-slate-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  {showApiKey ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Your keys are encrypted at rest and never shared.
            </p>
          </div>

          {testResult && (
            <div className="col-span-1 md:col-span-2">
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  testResult === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {testResult === 'success' ? 'check_circle' : 'error'}
                </span>
                <span className="text-sm">
                  {testResult === 'success'
                    ? 'Connection successful!'
                    : 'Connection failed. Please check your credentials.'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-between items-center">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !formData.apiKey}
            className="text-xs text-primary hover:text-primary/80 font-medium disabled:text-slate-600 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isTesting && (
              <span className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></span>
            )}
            Test Connection
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-violet-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
