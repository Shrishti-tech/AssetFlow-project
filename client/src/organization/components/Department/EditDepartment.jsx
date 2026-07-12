import AddDepartment from './AddDepartment'
export default function EditDepartment({ department, onSave, onClose }) { return <AddDepartment onClose={onClose} onSave={onSave} department={department} /> }
