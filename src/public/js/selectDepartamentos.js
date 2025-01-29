(function() {
    document.getElementById('departamentoSelect').addEventListener('change', function () {
        cargarMunicipios(1);  // Cargar la primera página cuando se selecciona un departamento
    });
    
    async function cargarMunicipios(page) {
        const departamentoId = document.getElementById('departamentoSelect').value;
    
        if (departamentoId) {
            try {
                const response = await fetch(`/municipios/por-departamento/${departamentoId}?page=${page}&limit=5`);
                const data = await response.json();
    
                const tbody = document.getElementById('municipiosTable');
                tbody.innerHTML = '';
    
                data.municipios.forEach(municipio => {
                    const row = document.createElement('tr');
                    row.classList.add('border-b', 'border-indigo-200', 'hover:bg-indigo-100');
                    row.innerHTML = `
                        <td class="py-3 px-6 text-left border-b border-gray-200">${municipio.municipioId}</td>
                        <td class="py-3 px-6 text-left border-b border-gray-200">${municipio.nombre}</td>
                        <td class="py-3 px-6 text-left border-b border-gray-200">${municipio.lat}</td>
                        <td class="py-3 px-6 text-left border-b border-gray-200">${municipio.lng}</td>
                        <td class="py-3 px-6 text-center border-b border-gray-200">
                            <a href="/municipios/editar/${municipio.municipioId}" class="text-blue-500 hover:text-blue-700 mr-2 flex items-center">
                                <i class="fas fa-pencil-alt mr-1"></i> Editar
                            </a>
                            <a href="/municipios/cargaEliminar/${municipio.municipioId}" class="text-red-500 hover:text-red-700 flex items-center">
                                <i class="fas fa-trash-alt mr-1"></i> Eliminar
                            </a>
                        </td>`;
                    tbody.appendChild(row);
                });
    
                actualizarControlesPaginacion(data.totalPages, data.currentPage);
            } catch (error) {
                console.error('Error al cargar los municipios:', error);
            }
        }
    }
    
    function actualizarControlesPaginacion(totalPages, currentPage) {
        const paginacion = document.getElementById('paginacion');
        paginacion.innerHTML = '';
    
        // Botón "Anterior"
        const prevPage = document.createElement('button');
        prevPage.textContent = 'Anterior';
        prevPage.classList.add('py-2', 'px-3', 'ml-0', 'leading-tight', 'text-gray-500', 'bg-white', 'rounded-l-lg', 'border', 'border-gray-300');
        if (currentPage === 1) {
            prevPage.classList.add('pointer-events-none', 'opacity-50'); // Deshabilitar
            prevPage.disabled = true;
        } else {
            prevPage.classList.add('hover:bg-gray-100', 'hover:text-gray-700');
            prevPage.addEventListener('click', () => cargarMunicipios(currentPage - 1));
        }
        paginacion.appendChild(prevPage);
    
        // Botones de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('py-2', 'px-3', 'leading-tight', 'text-gray-500', 'bg-white', 'border', 'border-gray-300');
            if (i === currentPage) {
                pageButton.classList.add('text-blue-600', 'bg-blue-50', 'hover:bg-blue-100', 'hover:text-blue-700');
            } else {
                pageButton.classList.add('hover:bg-gray-100', 'hover:text-gray-700');
                pageButton.addEventListener('click', () => cargarMunicipios(i));
            }
            paginacion.appendChild(pageButton);
        }
    
        // Botón "Siguiente"
        const nextPage = document.createElement('button');
        nextPage.textContent = 'Siguiente';
        nextPage.classList.add('py-2', 'px-3', 'leading-tight', 'text-gray-500', 'bg-white', 'rounded-r-lg', 'border', 'border-gray-300');
        if (currentPage === totalPages) {
            nextPage.classList.add('pointer-events-none', 'opacity-50'); // Deshabilitar
            nextPage.disabled = true;
        } else {
            nextPage.classList.add('hover:bg-gray-100', 'hover:text-gray-700');
            nextPage.addEventListener('click', () => cargarMunicipios(currentPage + 1));
        }
        paginacion.appendChild(nextPage);
    }
    
})();