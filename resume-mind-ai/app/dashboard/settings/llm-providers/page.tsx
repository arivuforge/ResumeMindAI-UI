"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ProviderCard, {
  ProviderStatus,
} from "@/app/components/dashboard/settings/ProviderCard";
import ConfigureProviderForm, {
  ProviderFormData,
  ProviderType,
} from "@/app/components/dashboard/settings/ConfigureProviderForm";
import { apiFetch, ApiError } from "@/app/lib/api";
import { ProviderCardSkeleton } from "@/app/components/dashboard/skeletons";

interface ProviderApi {
  id: string;
  provider_type: ProviderType;
  model_name: string;
  base_url?: string;
  status: ProviderStatus;
  latency_ms?: number;
  error_message?: string;
  logo_initials?: string;
  logo_color_class?: string;
  name?: string;
  display_name?: string;
  is_active?: boolean;
}

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
  baseUrl?: string;
  isActive: boolean;
}

interface SupportedProvider {
  provider_type: ProviderType;
  provider_name: string;
  logo_initials?: string;
  logo_color_class?: string;
}

export default function LLMProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [settingActiveId, setSettingActiveId] = useState<string | null>(null);
  const [supportedProviders, setSupportedProviders] = useState<
    SupportedProvider[]
  >([]);

  const mapProviderWithLookup = useCallback(
    (
      p: ProviderApi,
      lookup: Record<ProviderType, SupportedProvider>,
    ): Provider => {
      const type = p.provider_type;
      const supported = lookup[type];
      return {
        id: p.id,
        name:
          p.display_name ||
          p.name ||
          supported?.provider_name ||
          p.provider_type,
        type,
        model: p.model_name,
        status: p.status,
        latency: p.latency_ms,
        errorMessage: p.error_message,
        logoInitials: p.logo_initials || supported?.logo_initials || "NA",
        logoColorClass:
          p.logo_color_class ||
          supported?.logo_color_class ||
          "bg-slate-500/10 text-slate-400 border-slate-500/20",
        baseUrl: p.base_url,
        isActive: Boolean(p.is_active),
      };
    },
    [],
  );

  const mapProvider = useCallback(
    (p: ProviderApi): Provider => {
      const lookup = supportedProviders.reduce<
        Record<ProviderType, SupportedProvider>
      >(
        (acc, sp) => {
          acc[sp.provider_type] = sp;
          return acc;
        },
        {} as Record<ProviderType, SupportedProvider>,
      );
      return mapProviderWithLookup(p, lookup);
    },
    [mapProviderWithLookup, supportedProviders],
  );

  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [supported, data] = await Promise.all([
        apiFetch<SupportedProvider[]>("/settings/llm-providers/supported"),
        apiFetch<ProviderApi[]>("/settings/llm-providers/"),
      ]);
      const lookup = supported.reduce<Record<ProviderType, SupportedProvider>>(
        (acc, sp) => {
          acc[sp.provider_type] = sp;
          return acc;
        },
        {} as Record<ProviderType, SupportedProvider>,
      );
      setSupportedProviders(supported);
      setProviders(data.map((p) => mapProviderWithLookup(p, lookup)));
    } catch (err) {
      const e = err as ApiError;
      setError(e?.message || "Failed to load providers");
    } finally {
      setLoading(false);
    }
  }, [mapProviderWithLookup]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

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

  const handleSetActive = async (id: string) => {
    setError(null);
    setSettingActiveId(id);
    try {
      await apiFetch<ProviderApi>(`/settings/llm-providers/${id}/set-active`, {
        method: "POST",
      });
      await loadProviders();
    } catch (err) {
      const e = err as ApiError & { status?: number };
      if (e?.status === 409) {
        setError("Another provider is active. Please refresh and try again.");
        await loadProviders();
      } else {
        setError(e?.message || "Failed to set active provider");
      }
    } finally {
      setSettingActiveId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/settings/llm-providers/${id}`, { method: "DELETE" });
      setProviders((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const e = err as ApiError;
      setError(e?.message || "Failed to delete provider");
    }
  };

  const handleTest = async (
    id: string,
    overrides?: Partial<ProviderFormData>,
  ) => {
    setError(null);
    setTestingId(id);
    try {
      const data = await apiFetch<{
        status: ProviderStatus;
        latency_ms?: number;
        error_message?: string;
        provider: ProviderApi;
      }>(`/settings/llm-providers/${id}/test-connection`, {
        method: "POST",
        body: JSON.stringify({
          api_key: overrides?.apiKey,
          base_url: overrides?.baseUrl,
          model_name: overrides?.modelName,
        }),
      });
      setProviders((prev) =>
        prev.map((p) => (p.id === id ? mapProvider(data.provider) : p)),
      );
      return data.status === "connected";
    } catch (err) {
      const e = err as ApiError;
      setError(e?.message || "Failed to test connection");
      return false;
    } finally {
      setTestingId(null);
    }
  };

  const handleSave = async (data: ProviderFormData) => {
    setSaving(true);
    setError(null);
    try {
      if (editingProvider) {
        const updated = await apiFetch<ProviderApi>(
          `/settings/llm-providers/${editingProvider.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              provider_type: data.providerType,
              model_name: data.modelName,
              base_url: data.baseUrl,
              api_key: data.apiKey,
            }),
          },
        );
        setProviders((prev) =>
          prev.map((p) =>
            p.id === editingProvider.id ? mapProvider(updated) : p,
          ),
        );
      } else {
        const created = await apiFetch<ProviderApi>(
          "/settings/llm-providers/",
          {
            method: "POST",
            body: JSON.stringify({
              provider_type: data.providerType,
              model_name: data.modelName,
              base_url: data.baseUrl,
              api_key: data.apiKey,
            }),
          },
        );
        setProviders((prev) => [...prev, mapProvider(created)]);
      }

      setIsFormOpen(false);
      setEditingProvider(null);
    } catch (err) {
      const e = err as ApiError & { status?: number };
      if (e?.status === 409) {
        setError("Provider/model already exists");
      } else if (e?.status === 422) {
        setError("Validation error: check fields");
      } else {
        setError(e?.message || "Failed to save provider");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const providerOptions = useMemo(() => {
    return supportedProviders.map((sp) => ({
      value: sp.provider_type,
      label: sp.provider_name || sp.provider_type,
      logoInitials: sp.logo_initials,
      logoColorClass: sp.logo_color_class,
    }));
  }, [supportedProviders]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary-light mb-1">
            <span className="material-symbols-outlined text-sm">
              settings_input_component
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Configuration
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Provider Management
          </h2>
          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            Manage and configure LLM providers for unified orchestration.
            Connect your API keys to get started with seamless model switching.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="group relative inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-violet-600 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined mr-2 text-lg transition-transform group-hover:rotate-90">
            add
          </span>
          Add New Provider
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl animate-in slide-in-from-top-2 duration-300">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ProviderCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
              isActive={provider.isActive}
              onSetActive={handleSetActive}
              isSettingActive={settingActiveId === provider.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRetry={
                provider.status === "error" ? (id) => handleTest(id) : undefined
              }
              onTest={handleTest}
              isTesting={testingId === provider.id}
            />
          ))}
          {providers.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-slate-600">
                  developer_board
                </span>
              </div>
              <p className="text-slate-400 font-medium">
                No LLM providers configured yet.
              </p>
              <button
                onClick={handleAddNew}
                className="mt-4 text-primary font-bold hover:text-primary-light transition-colors"
              >
                Connect your first provider
              </button>
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <ConfigureProviderForm
          mode={editingProvider ? "edit" : "create"}
          initialData={
            editingProvider
              ? {
                  providerType: editingProvider.type,
                  modelName: editingProvider.model,
                  baseUrl: editingProvider.baseUrl,
                }
              : undefined
          }
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={saving}
          providerOptions={providerOptions}
        />
      )}
    </div>
  );
}
