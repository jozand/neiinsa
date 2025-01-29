// public/js/dynamicSelects.js
(function() {

  document.getElementById('departamentoId').addEventListener('change', function () {
      cargaMunicipios(); 
  });
  
  async function cargaMunicipios() {
      const departamentoSelect = document.getElementById('departamentoId');
      const municipioSelect = document.getElementById('municipioId');
      
      municipioSelect.innerHTML = '<option value="">- Seleccione -</option>';
      
      if (departamentoId) {
          try {
              // Realizar la petición al servidor para obtener los municipios
              const response = await fetch(`/municipios/porDepartamento/${departamentoSelect.value}`);
              const municipios = await response.json();
              // Rellenar el select de municipios con los datos recibidos
              municipios.forEach(municipio => {
                  const option = document.createElement('option');
                  option.value = municipio.municipioId;
                  option.textContent = municipio.nombre;
                  municipioSelect.appendChild(option);
              });
          } catch (error) {
              console.error('Error al cargar los municipios:', error);
          }
      }
  }
})()