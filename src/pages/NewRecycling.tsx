import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { saveRecyclingItem, generateId, getUserRecyclingItems } from '../utils/localStorage'
import { RecyclingItem, CollectionPoint } from '../types'
import { Plus, MapPin, Clock, Recycle, Scale, Package } from 'lucide-react'

const NewRecycling: React.FC = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    type: '' as RecyclingItem['type'] | '',
    weight: '',
    quantity: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const materialTypes = [
    { value: 'plastic', label: 'Plástico', price: 1.0, icon: '♻️' },
    { value: 'paper', label: 'Papel', price: 0.8, icon: '📄' },
    { value: 'glass', label: 'Vidro', price: 0.5, icon: '🫙' },
    { value: 'metal', label: 'Metal', price: 2.0, icon: '🥫' },
    { value: 'electronics', label: 'Eletrônicos', price: 5.0, icon: '📱' },
  ]

  const collectionPoints: CollectionPoint[] = [
    {
      id: '1',
      name: 'SAMA (Bosque Municipal)',
      address: 'Rua Vital Soares, 670 - Bosque',
      hours: 'Seg a Sex: 08h às 11h e 13h às 16h',
      acceptedMaterials: ['Eletrônicos', 'Pilhas', 'Baterias'],
      distance: 1.5,
    },
    {
      id: '2',
      name: 'Cooperativa Recicla Garça',
      address: 'Rua Walter Alves de Souza, 71 - Distrito Industrial II',
      hours: 'Segunda a Sexta: 8h às 17h',
      acceptedMaterials: ['Plástico', 'Papel', 'Vidro', 'Metal'],
      distance: 3.2,
    },
    {
      id: '3',
      name: 'Ecoponto Concha Acústica',
      address: 'Praça Hilmar Machado de Oliveira - Centro',
      hours: 'Aberto 24 horas',
      acceptedMaterials: ['Plástico', 'Papel', 'Vidro', 'Metal'],
      distance: 0.8,
    },
  ]

  const userRecyclingItems = user ? getUserRecyclingItems(user.id) : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let newValue = value

    if (name === 'weight') {
      // Permite até 999.9
      const numericValue = parseFloat(value)

      if (!isNaN(numericValue) && numericValue > 999.9) {
        newValue = '999.9'
      }

      // Garante no máximo 5 caracteres (ex: "999.9")
      if (newValue.length > 5) {
        newValue = newValue.slice(0, 5)
      }
    }

    if (name === 'quantity') {
      // Permite até 9999 unidades
      const intValue = parseInt(value, 10)

      if (!isNaN(intValue) && intValue > 9999) {
        newValue = '9999'
      }

      // Garante no máximo 4 caracteres
      if (newValue.length > 4) {
        newValue = newValue.slice(0, 4)
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const calculateEstimatedValue = () => {
    const selectedMaterial = materialTypes.find(m => m.value === formData.type)
    if (!selectedMaterial || !formData.weight) return 0
    return selectedMaterial.price * parseFloat(formData.weight)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.type || !formData.weight || !formData.quantity) return

    setIsSubmitting(true)

    try {
      const newItem: RecyclingItem = {
        id: generateId(),
        userId: user.id,
        type: formData.type as RecyclingItem['type'],
        weight: parseFloat(formData.weight),
        quantity: parseInt(formData.quantity),
        estimatedValue: calculateEstimatedValue(),
        status: 'pending',
        date: new Date().toISOString(),
      }

      saveRecyclingItem(newItem)

      setFormData({ type: '', weight: '', quantity: '' })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving recycling item:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nova Reciclagem</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Registre seus materiais recicláveis e ganhe créditos
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Reciclagem registrada com sucesso! Aguardando aprovação do coletor.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Plus className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Registrar Material</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Material
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {materialTypes.map(material => (
                    <option key={material.value} value={material.value}>
                      {material.icon} {material.label} - R$ {material.price.toFixed(2)}/kg
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    <Scale className="h-4 w-4 inline mr-1" />
                    Peso (kg)
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: 2.5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    <Package className="h-4 w-4 inline mr-1" />
                    Quantidade (unidades)
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: 10"
                    required
                  />
                </div>
              </div>

              {formData.type && formData.weight && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h4 className="font-semibold text-primary-900 mb-2">Estimativa de Valor</h4>
                  <p className="text-2xl font-bold text-primary-600">R$ {calculateEstimatedValue().toFixed(2)}</p>
                  <p className="text-primary-700 text-sm">Valor sujeito à aprovação do coletor</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !formData.type || !formData.weight || !formData.quantity}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Registrando...
                  </div>
                ) : (
                  'Registrar Reciclagem'
                )}
              </button>
            </form>
          </div>

          {/* Collection Points */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Pontos de Coleta Próximos</h3>
              </div>

              <div className="space-y-4">
                {collectionPoints.map(point => (
                  <div
                    key={point.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{point.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{point.address}</p>
                        <div className="flex items-center text-gray-500 text-sm mt-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {point.hours}
                        </div>
                        <div className="mt-2">
                          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                            {point.acceptedMaterials.join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <span className="text-sm font-medium text-gray-900">{point.distance} km</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Recycle className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Últimas Reciclagens</h3>
              </div>

              {userRecyclingItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma reciclagem registrada ainda.</p>
              ) : (
                <div className="space-y-3">
                  {userRecyclingItems.slice(0, 5).map(item => {
                    const material = materialTypes.find(m => m.value === item.type)
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{material?.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">
                              {material?.label} - {item.weight}kg
                            </p>
                            <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : item.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {item.status === 'approved'
                              ? 'Aprovado'
                              : item.status === 'rejected'
                              ? 'Rejeitado'
                              : 'Pendente'}
                          </span>
                          <p className="text-sm font-medium text-gray-900 mt-1">R$ {item.estimatedValue.toFixed(2)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewRecycling
