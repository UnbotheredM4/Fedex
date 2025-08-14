'use client'
import { useEffect, useState } from 'react'

export default function TrackPage(){
  const [tn, setTn] = useState('')
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(()=>{
    const url = new URL(window.location.href)
    const qtn = url.searchParams.get('tn') || ''
    setTn(qtn)
    if (qtn) fetch(`/api/shipments?trackingNumber=${encodeURIComponent(qtn)}`).then(r=>r.json()).then(setData)
  },[])

  async function onSearch(e:any){
    e.preventDefault()
    setErr(null)
    const res = await fetch(`/api/shipments?trackingNumber=${encodeURIComponent(tn)}`)
    const json = await res.json()
    if (!res.ok || !json.ok) setErr(json.error || 'Not found')
    setData(json)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSearch} className="card p-4 flex gap-2 items-end">
        <div className="flex-1">
          <label className="label">Tracking number</label>
          <input className="input" value={tn} onChange={e=>setTn(e.target.value)} placeholder="FS-XXXX..." />
        </div>
        <button className="btn-ghost">Track</button>
      </form>
      {err && <p className="text-sm text-red-600">{err}</p>}
      {data?.ok && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-2">Shipment</h2>
            <div className="text-sm text-gray-700 space-y-1">
              <p>Status: <b>{data.shipment.status}</b></p>
              {data.shipment.reference && <p>Reference: {data.shipment.reference}</p>}
              <p>Service: {data.shipment.serviceLevel}</p>
              <p>Weight: {data.shipment.weightOz} oz</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <h3 className="font-medium">From</h3>
                <p>{data.shipment.fromAddress.name||''}</p>
                <p>{data.shipment.fromAddress.line1}</p>
                <p>{data.shipment.fromAddress.city}, {data.shipment.fromAddress.state} {data.shipment.fromAddress.postal}</p>
              </div>
              <div>
                <h3 className="font-medium">To</h3>
                <p>{data.shipment.toAddress.name||''}</p>
                <p>{data.shipment.toAddress.line1}</p>
                <p>{data.shipment.toAddress.city}, {data.shipment.toAddress.state} {data.shipment.toAddress.postal}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-2">Tracking timeline</h2>
            <ol className="relative border-s ml-3">
              {data.shipment.events.map((ev:any)=>(
                <li key={ev.id} className="mb-4 ms-6">
                  <span className="absolute -start-3.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-orange text-white text-xs">{ev.code[0]}</span>
                  <p className="text-sm font-medium">{ev.code.replaceAll('_',' ')}</p>
                  <p className="text-xs text-gray-600">{new Date(ev.createdAt).toLocaleString()} {ev.location?`— ${ev.location}`:''}</p>
                  <p className="text-sm">{ev.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
