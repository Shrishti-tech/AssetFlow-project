import { useEffect, useState } from 'react'
import AllocationForm from '../components/AllocationForm'
import AllocationTable from '../components/AllocationTable'
import { createAllocation, createTransferRequest, getAllocationOptions, getAllocations } from '../services/allocationService'
import '../../pages/allocation/allocation.css'
export default function AllocateAsset() {
  const [options, setOptions] = useState({ assets: [], employees: [], departments: [] }); const [allocations, setAllocations] = useState([]); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [conflict, setConflict] = useState(null)
  const load = async () => { const [nextOptions, nextAllocations] = await Promise.all([getAllocationOptions(), getAllocations()]); setOptions(nextOptions); setAllocations(nextAllocations) }
  useEffect(() => { load().catch((error) => setMessage(error.response?.data?.message || 'Unable to load allocation data.')) }, [])
  const submit = async (values) => {
    setConflict(null)
    try {
      setBusy(true); await createAllocation(values); setMessage('Asset allocated successfully.'); await load(); return true
    } catch (error) {
      const data = error.response?.data
      if (data?.conflict) { setConflict({ ...data.conflict, toUser: values.assignedTo, toDepartment: values.department }); setMessage('') }
      else setMessage(data?.message || 'Unable to allocate asset.')
    } finally { setBusy(false) }
  }
  const requestTransfer = async () => {
    if (!conflict) return
    try {
      setBusy(true)
      await createTransferRequest({ allocation: conflict.allocationId, toUser: conflict.toUser, toDepartment: conflict.toDepartment, reason: `Requested via Allocate Asset for ${conflict.assetTag}` })
      setMessage('Transfer request submitted for approval.'); setConflict(null); await load()
    } catch (error) { setMessage(error.response?.data?.message || 'Unable to submit transfer request.') } finally { setBusy(false) }
  }
  return <main className="allocation-page"><h1>Allocate asset</h1><p>Assign an available asset to an employee and set its expected return date.</p>{message && <div className="allocation-message">{message}</div>}{conflict && <div className="allocation-conflict"><p><b>{conflict.assetName}</b> <code>{conflict.assetTag}</code></p><p>Currently held by <b>{conflict.currentHolder}</b></p><button type="button" className="allocation-primary-btn" disabled={busy} onClick={requestTransfer}>{busy ? 'Requesting…' : 'Request Transfer'}</button></div>}<div className="allocation-grid"><section className="allocation-card"><h2>New allocation</h2><AllocationForm {...options} onSubmit={submit} busy={busy} /></section><AllocationTable allocations={allocations} /></div></main>
}
