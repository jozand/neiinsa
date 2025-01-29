function formatoFechaIso (fechaISO)  {
  const fecha = new Date(fechaISO);
  const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000);
  return fechaLocal.toISOString().split('T')[0]; 
};

function formatoFechaVista(fechaISO) {
  const fecha = new Date(fechaISO);
  return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  }).format(fecha);
}

function formatoMoneda (numero)  {
  return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(numero);
};

export {
  formatoFechaIso,
  formatoMoneda,
  formatoFechaVista
}