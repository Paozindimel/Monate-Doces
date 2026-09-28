export const money = (value) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const number = (value) => Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 3 })
export const calculateItemCost = (item, quantity) => (Number(item.base_price) / Number(item.base_quantity)) * Number(quantity)
