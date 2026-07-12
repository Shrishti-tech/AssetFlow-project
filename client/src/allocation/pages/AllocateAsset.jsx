import { useEffect, useState } from 'react'
import AllocationForm from '../components/AllocationForm'
import AllocationTable from '../components/AllocationTable'
import { createAllocation, getAllocationOptions, getAllocations } from '../services/allocationService'
import '../../pages/allocation/allocation.css'
export default function AllocateAsset() {
  const [options, setOptions] = useState({ assets: [], employees: [], departments: [] }); const [allocations, setAllocations] = useState([]); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false)
  const load = async () => { const [nextOptions, nextAllocations] = await Promise.all([getAllocationOptions(), getAllocations()]); setOptions(nextOptions); setAllocations(nextAllocations) }
  useEffect(() => { load().catch((error) => setMessage(error.response?.data?.message || 'Unable to load allocation data.')) }, [])
  const submit = async (values) => { try { setBusy(true); await createAllocation(values); setMessage('Asset allocated successfully.'); await load(); return true } catch (error) { setMessage(error.response?.data?.message || 'Unable to allocate asset.') } finally { setBusy(false) } }
  return <main className="allocation-page"><h1>Allocate asset</h1><p>Assign an available asset to an employee and set its expected return date.</p>{message && <div className="allocation-message">{message}</div>}<div className="allocation-grid"><section className="allocation-card"><h2>New allocation</h2><AllocationForm {...options} onSubmit={submit} busy={busy} /></section><AllocationTable allocations={allocations} /></div></main>
}
