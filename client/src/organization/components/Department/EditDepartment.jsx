import AddDepartment from './AddDepartment'
export default function EditDepartment({ department, departments, onSave, onClose }) { return <AddDepartment onClose={onClose} onSave={onSave} department={department} departments={departments} /> }
