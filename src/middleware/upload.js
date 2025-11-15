const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  // Dónde se guardarán los archivos
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta 'uploads' en el directorio raíz donde se guardarán las imágenes
  },
  // Cómo se nombrará cada archivo
  filename: (req, file, cb) => {
    // Creamos un nombre único: campo-fecha-nombreoriginal
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos (opcional pero recomendado: solo aceptar imágenes)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('¡Solo se permiten archivos de imagen!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Límite de 5MB por archivo
});

module.exports = upload;