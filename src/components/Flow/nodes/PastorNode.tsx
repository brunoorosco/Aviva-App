'use client'

import { Handle, Position } from '@xyflow/react'

export function PastorNode({ id, data }: any) {
  return (
    <div
      onDoubleClick={() => data.onEdit(id)} // <-- dispara modal
      className="rounded bg-lime-400 px-4 py-2 shadow cursor-pointer"
    >
      <span className="font-bold text-foreground">{data.label}</span>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}
