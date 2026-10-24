import { Navigate, Route, Routes } from 'react-router-dom'
import { Landing } from '@/pages/Landing'
import { Lookup } from '@/pages/Lookup'
import { Library } from '@/pages/Library'
import { Learning } from '@/pages/Learning'
import { Fields } from '@/pages/Fields'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/tra-cuu" element={<Lookup />} />
      <Route path="/thu-vien" element={<Library />} />
      <Route path="/lo-trinh" element={<Learning />} />
      <Route path="/tu-truong/:id" element={<Fields />} />
      <Route path="/app" element={<Navigate to="/lo-trinh" replace />} />
      <Route path="/login" element={<Navigate to="/lo-trinh" replace />} />
      <Route path="/signup" element={<Navigate to="/lo-trinh" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
