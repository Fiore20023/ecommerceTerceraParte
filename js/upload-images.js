// Gestión de carga de imágenes
console.log('📸 upload-images.js cargado');

// Convertir imágenes a Base64 para guardar en MongoDB
async function convertirImagenesABase64(files) {
    const imagenes = [];
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i];
        
        // Validar que sea imagen
        if (!file.type.startsWith('image/')) {
            console.warn(`⚠️ ${file.name} no es una imagen válida`);
            continue;
        }
        
        // Validar tamaño (máximo 2MB por imagen)
        if (file.size > 2 * 1024 * 1024) {
            alert(`⚠️ La imagen ${file.name} supera los 2MB`);
            continue;
        }
        
        try {
            const base64 = await leerArchivoComoBase64(file);
            imagenes.push({
                nombre: file.name,
                tipo: file.type,
                datos: base64
            });
        } catch (error) {
            console.error(`❌ Error al leer ${file.name}:`, error);
        }
    }
    
    return imagenes;
}

function leerArchivoComoBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Preview de imágenes seleccionadas
function mostrarPreviewImagenes(files, contenedor) {
    contenedor.innerHTML = '';
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) continue;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.style.cssText = 'position:relative; border:2px solid #ddd; border-radius:5px; overflow:hidden;';
            
            div.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}" 
                     style="width:100%; height:100px; object-fit:cover;">
                <div style="position:absolute; top:0; right:0; background:rgba(0,0,0,0.7); color:white; padding:0.2rem 0.5rem; font-size:0.7rem;">
                    ${(file.size / 1024).toFixed(0)} KB
                </div>
            `;
            
            contenedor.appendChild(div);
        };
        reader.readAsDataURL(file);
    }
    
    if (files.length > 5) {
        const aviso = document.createElement('div');
        aviso.style.cssText = 'grid-column: 1 / -1; background:#fff3cd; padding:0.5rem; border-radius:5px; text-align:center; color:#856404;';
        aviso.textContent = `⚠️ Solo se guardarán las primeras 5 imágenes`;
        contenedor.appendChild(aviso);
    }
}

// Exportar funciones
window.uploadImages = {
    convertirImagenesABase64,
    mostrarPreviewImagenes
};
