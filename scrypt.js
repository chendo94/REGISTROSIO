// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey:"AIzaSyCqHztmRTP4Jx5-uj69EeV6FUZtaqtb4VI",
    authDomain:"my-app-registro.firebaseapp.com",
    databaseURL: "https://my-app-registro-default-rtdb.firebaseio.com",
    projectId:"my-app-registro",
    storageBucket:"my-app-registro.appspot.com",
    messagingSenderId:"101227800599",
    appId:"1:101227800599:web:35e25c36969e6809871452",
    measurementId:"G-ZYHZWQQTL6"
    
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const dbFirestore = firebase.firestore();
const dbRealtime = firebase.database();

document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar recargar la página

    const nombre = document.getElementById('nombre').value;
    const fecha = document.getElementById('fecha').value;
    const lugar = document.getElementById('lugar').value;
    const monto = document.getElementById('monto').value;

    // Datos de pago a registrar
    const paymentData = {
        nombre: nombre,
        fecha: fecha,
        lugar: lugar,
        monto: parseFloat(monto)
    };

    // Enviar datos a Firebase Firestore
    dbFirestore.collection("pagos").add(paymentData)
    .then(() => {
        console.log('Datos de pago registrados en Firestore:', paymentData);

        // También guardar en Realtime Database
        const newPaymentRef = dbRealtime.ref('pagos').push();
        newPaymentRef.set(paymentData)
        .then(() => {
            console.log('Datos de pago registrados en Realtime Database:', paymentData);
            alert('Pago registrado con éxito en ambas bases de datos!');

            // Simular notificación local
            sendNotification(paymentData);

            // Limpiar formulario
            document.getElementById('payment-form').reset();
        })
        .catch((error) => {
            console.error("Error al registrar el pago en Realtime Database: ", error);
            alert('Error al registrar el pago en Realtime Database.');
        });
    })
    .catch((error) => {
        console.error("Error al registrar el pago en Firestore: ", error);
        alert('Error al registrar el pago en Firestore.');
    });
});

// Simulación de notificación
function sendNotification(paymentData) {
    if (Notification.permission === 'granted') {
        new Notification("Nuevo Pago Registrado", {
            body: `Pago registrado por ${paymentData.nombre} de ${paymentData.monto} en ${paymentData.lugar}`,
            icon: 'icon.png'
        });
    }
}

// Solicitar permiso para enviar notificaciones
if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log("Permiso para notificaciones concedido");
        }
    });
}
