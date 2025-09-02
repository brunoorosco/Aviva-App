'use client'

import { useState } from 'react'

type EditNodeModalProps = {
  open: boolean
  onClose: () => void
  onSave: (values: { label: string; role?: string }) => void
  initialData: { label: string; role?: string }
}

export function EditNodeModal({ open, onClose, onSave, initialData }: EditNodeModalProps) {
  const [form, setForm] = useState(initialData)

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded p-4 w-96">
        <h2 className="text-lg font-semibold mb-2">Editar Nó</h2>

        <label className="block mb-2">
          Nome:
          <input
            className="w-full border rounded px-2 py-1"
            value={form.label}
            onChange={e => setForm({ ...form, label: e.target.value })}
          />
        </label>

        {/* Exemplo de select (para papel) */}
        <label className="block mb-2">
          Função:
          <select
            className="w-full border rounded px-2 py-1"
            value={form.role ?? ''}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="líder">Líder</option>
            <option value="auxiliar">Auxiliar</option>
            <option value="usuário">Usuário</option>
          </select>
        </label>

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-3 py-1 bg-gray-300 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => onSave(form)}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
