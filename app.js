// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQg0pBMfDmaC81NlGOOH4VlsmN0lrtv8E",
  authDomain: "musica-en-vivo-937eb.firebaseapp.com",
  databaseURL: "https://musica-en-vivo-937eb-default-rtdb.firebaseio.com",
  projectId: "musica-en-vivo-937eb",
  storageBucket: "musica-en-vivo-937eb.appspot.com",
  messagingSenderId: "136997541392",
  appId: "1:136997541392:web:397ef6f10e23f08b679c95",
  measurementId: "G-R795KQH060"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Obtén una referencia a la base de datos de Firestore
const db = firebase.firestore();

// Obtén los elementos de navegación
const homeLink = document.getElementById('home-link');
const hoursRegistrationLink = document.getElementById('hours-registration-link');
const advancePaymentsLink = document.getElementById('advance-payments-link');
const weeklySummaryLink = document.getElementById('weekly-summary-link');

// Obtén las secciones de la página
const homePage = document.getElementById('home');
const hoursRegistrationPage = document.getElementById('hours-registration');
const advancePaymentsPage = document.getElementById('advance-payments');
const weeklySummaryPage = document.getElementById('weekly-summary');

// Agrega eventos de clic a los enlaces de navegación
homeLink.addEventListener('click', () => showPage(homePage));
hoursRegistrationLink.addEventListener('click', () => showPage(hoursRegistrationPage));
advancePaymentsLink.addEventListener('click', () => showPage(advancePaymentsPage));
weeklySummaryLink.addEventListener('click', () => showPage(weeklySummaryPage));

// Función para mostrar una página y ocultar las demás
function showPage(page) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((p) => p.classList.add('hidden'));
  page.classList.remove('hidden');
}

// Obtén el formulario de registro de horas
const hoursForm = document.getElementById('hours-form');

// Agrega un evento de envío al formulario de registro de horas
hoursForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtén los valores del formulario
  const memberName = document.getElementById('member-name').value;
  const hoursWorked = document.getElementById('hours-worked').value;
  const workDate = document.getElementById('work-date').value;
  const eventLocation = document.getElementById('event-location').value;

  // Guarda los datos en Firestore
  db.collection('hours').add({
    memberName,
    hoursWorked,
    workDate,
    eventLocation,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('Horas registradas exitosamente');
    // Limpia el formulario
    hoursForm.reset();
  })
  .catch((error) => {
    console.error('Error al registrar las horas:', error);
  });
});

// Obtén el formulario de pagos anticipados
const advancePaymentsForm = document.getElementById('advance-payments-form');

// Agrega un evento de envío al formulario de pagos anticipados
advancePaymentsForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtén los valores del formulario
  const memberName = document.getElementById('member-name-advance').value;
  const advanceAmount = document.getElementById('advance-amount').value;
  const advanceDate = document.getElementById('advance-date').value;

  // Guarda los datos en Firestore
  db.collection('advance-payments').add({
    memberName,
    advanceAmount,
    advanceDate,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log('Pago anticipado registrado exitosamente');
    // Muestra el mensaje de éxito
    const advancePaymentSuccess = document.getElementById('advance-payment-success');
    advancePaymentSuccess.classList.remove('hidden');
    // Limpia el formulario
    advancePaymentsForm.reset();
  })
  .catch((error) => {
    console.error('Error al registrar el pago anticipado:', error);
  });
});

// Función para generar el resumen semanal
async function getWeeklySummary() {
  try {
    // Obtén los datos de horas trabajadas y pagos anticipados de la última semana
    const hoursSnapshot = await db.collection('hours')
      .where('workDate', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .get();
    const advancePaymentsSnapshot = await db.collection('advance-payments')
      .where('advanceDate', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .get();

    // Procesa los datos y genera el resumen semanal
    const weeklySummary = {
      hours: {},
      advancePayments: {}
    };

    hoursSnapshot.docs.forEach((doc) => {
      const { memberName, hoursWorked, workDate, eventLocation } = doc.data();
      if (!weeklySummary.hours[memberName]) {
        weeklySummary.hours[memberName] = { totalHours: 0, workDates: [], eventLocations: [] };
      }
      weeklySummary.hours[memberName].totalHours += parseInt(hoursWorked);
      weeklySummary.hours[memberName].workDates.push(workDate);
      weeklySummary.hours[memberName].eventLocations.push(eventLocation);
    });

    advancePaymentsSnapshot.docs.forEach((doc) => {
      const { memberName, advanceAmount, advanceDate } = doc.data();
      if (!weeklySummary.advancePayments[memberName]) {
        weeklySummary.advancePayments[memberName] = { totalAdvance: 0, paymentDates: [] };
      }
      weeklySummary.advancePayments[memberName].totalAdvance += parseInt(advanceAmount);
      weeklySummary.advancePayments[memberName].paymentDates.push(advanceDate);
    });

    // Muestra el resumen semanal en la página
    const weeklySummaryContent = document.getElementById('weekly-summary-content');
    weeklySummaryContent.innerHTML = '';
    Object.keys(weeklySummary.hours).forEach((member) => {
      weeklySummaryContent.innerHTML += `
        <div class="3d-box">
          <h3 class="3d-text">${member}</h3>
          <p>Horas Trabajadas: ${weeklySummary.hours[member].totalHours}</p>
          <p>Fechas de Trabajo: ${weeklySummary.hours[member].workDates.join(', ')}</p>
          <p>Lugares de Evento: ${weeklySummary.hours[member].eventLocations.join(', ')}</p>
          <p>Pagos Anticipados: ${weeklySummary.advancePayments[member]?.totalAdvance || 0}</p>
          <p>Fechas de Pago: ${weeklySummary.advancePayments[member]?.paymentDates.join(', ') || 'N/A'}</p>
        </div>
        <hr>
      `;
    });
  } catch (error) {
    console.error('Error al obtener el resumen semanal:', error);
  }
}

// Llama a la función para generar el resumen semanal
getWeeklySummary();
