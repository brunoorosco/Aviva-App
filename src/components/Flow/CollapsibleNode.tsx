'use client'

import { Handle, Position } from '@xyflow/react'

export function CollapsibleNode({ id, data }: any) {
  return (
    <div className="rounded bg-gray-200 px-3 py-2 shadow">
      <div className="flex items-center gap-2">
        <button
          onClick={() => data.onToggle(id)}
          className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white"
          title={data.collapsed ? 'Expandir' : 'Recolher'}
        >
          {data.collapsed ? '+' : '-'}
        </button>
        <span className="font-medium">{data.label}</span>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
