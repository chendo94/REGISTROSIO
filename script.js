// Inicializa las listas desde localStorage o con listas vacías si no hay datos guardados
const members = JSON.parse(localStorage.getItem('members')) || [];
const records = JSON.parse(localStorage.getItem('records')) || [];

// Función para actualizar localStorage
function updateLocalStorage() {
    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem('records', JSON.stringify(records));
}

// Muestra la sección seleccionada y oculta las demás
function showSection(sectionId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Función para agregar un miembro al grupo
function addMember() {
    const name = document.getElementById('memberName').value;
    const surname = document.getElementById('memberSurname').value;
    const rate = parseFloat(document.getElementById('memberRate').value);

    if (name && surname && rate) {
        const member = { id: members.length + 1, name, surname, rate };
        members.push(member);
        updateMemberSelects();
        updateLocalStorage(); // Actualiza el almacenamiento
        alert('Miembro agregado exitosamente');
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

// Función para actualizar los selects de los miembros
function updateMemberSelects() {
    const memberSelect = document.getElementById('memberSelect');
    const advanceMemberSelect = document.getElementById('advanceMemberSelect');
    memberSelect.innerHTML = '';
    advanceMemberSelect.innerHTML = '';

    members.forEach(member => {
        const option = new Option(`${member.name} ${member.surname}`, member.id);
        memberSelect.add(option);
        advanceMemberSelect.add(option.cloneNode(true));
    });
}

// Función para registrar horas trabajadas
function registerHours() {
    const memberId = parseInt(document.getElementById('memberSelect').value);
    const hoursWorked = parseFloat(document.getElementById('hoursWorked').value);
    const workDate = document.getElementById('workDate').value;
    const workLocation = document.getElementById('workLocation').value;

    if (memberId && hoursWorked && workDate && workLocation) {
        records.push({ memberId, hoursWorked, workDate, workLocation, type: 'work' });
        updateLocalStorage(); // Actualiza el almacenamiento
        alert('Horas registradas exitosamente');
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

// Función para registrar anticipos
function registerAdvance() {
    const memberId = parseInt(document.getElementById('advanceMemberSelect').value);
    const advanceAmount = parseFloat(document.getElementById('advanceAmount').value);

    if (memberId && advanceAmount) {
        records.push({ memberId, advanceAmount, type: 'advance' });
        updateLocalStorage(); // Actualiza el almacenamiento
        alert('Anticipo registrado exitosamente');
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

// Función para generar el resumen semanal
function generateWeeklySummary() {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = '';
    members.forEach(member => {
        const memberRecords = records.filter(record => record.memberId === member.id);
        const totalHours = memberRecords.filter(record => record.type === 'work').reduce((sum, record) => sum + record.hoursWorked, 0);
        const totalAdvance = memberRecords.filter(record => record.type === 'advance').reduce((sum, record) => sum + record.advanceAmount, 0);
        const totalPay = totalHours * member.rate - totalAdvance;

        const memberSummary = `
            <h3>${member.name} ${member.surname}</h3>
            <p>Horas trabajadas: ${totalHours}</p>
            <p>Pago por hora: $${member.rate} MXN</p>
            <p>Anticipos: $${totalAdvance} MXN</p>
            <p>Total a pagar: $${totalPay} MXN</p>
            <hr>
        `;
        summaryDiv.innerHTML += memberSummary;
    });
}

// Muestra la sección de agregar miembro por defecto
showSection('add-member-section');
updateMemberSelects();  // Cargar datos de los selects al inicio

// Función para restablecer todos los registros
function resetAllRecords() {
    // Confirma antes de eliminar todos los registros y miembros
    if (confirm("¿Estás seguro de que deseas restablecer todos los registros y empezar de nuevo?")) {
        members.length = 0;  // Vacía la lista de miembros
        records.length = 0;  // Vacía la lista de registros
        updateLocalStorage(); // Borra los datos del almacenamiento local
        updateMemberSelects();  // Actualiza la interfaz
        document.getElementById('summary').innerHTML = '';  // Limpia el resumen semanal
        alert("Todos los registros han sido restablecidos.");
        showSection('add-member-section');
    }
}  
