import { useNavigate } from 'react-router-dom'
import Button from './Button'
export default function BackButton() { const navigate = useNavigate(); return <Button variant="secondary" onClick={() => navigate(-1)}>← Voltar</Button> }
