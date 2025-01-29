(function() {
    document.addEventListener('DOMContentLoaded', function () {
        const filterInput = document.getElementById('filterInput');
        const clientesTable = document.getElementById('marcasTable');
    
        filterInput.addEventListener('keyup', function () {
            const filterValue = filterInput.value.toLowerCase();
            const rows = clientesTable.getElementsByTagName('tr');
    
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                let match = false;
    
                for (let j = 0; j < cells.length; j++) {
                    const cellValue = cells[j].innerText.toLowerCase();
                    if (cellValue.includes(filterValue)) {
                        match = true;
                        break;
                    }
                }
    
                if (match) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    })
})()