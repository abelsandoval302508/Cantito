// Configuración de Cantito. Edita este archivo antes de publicar.
window.CANTITO_CONFIG = {
  // Pega aquí la configuración de tu app web de Firebase
  // (Consola de Firebase → Configuración del proyecto → Tus apps → SDK → Configuración).
  // Ejemplo: firebase: { apiKey: "...", authDomain: "...", projectId: "...", storageBucket: "...", messagingSenderId: "...", appId: "..." },
  // Mientras sea null, la app funciona en MODO DE PRUEBA: los datos quedan solo en ese navegador.
  firebase: null,

  // Dónde están los MP3:
  //  'carpeta'  → archivos dentro de la carpeta audio/ del sitio (gratis, sin tarjeta). En el panel escribes el nombre del archivo.
  //  'firebase' → se suben desde el panel a Firebase Storage (requiere plan Blaze).
  audioMode: 'carpeta',

  // Correos que pueden entrar al panel de administración.
  admins: ['tu-correo@ejemplo.com'],

  // Días después del cuestionario inicial en que se habilita el cuestionario final.
  finalAfterDays: 28,

  // Aparecen en la política de privacidad.
  responsable: 'Versania Nova',
  contacto: 'tu-correo@ejemplo.com',
};
