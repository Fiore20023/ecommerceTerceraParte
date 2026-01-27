import { ObjectId } from 'mongodb';
import { database } from '../config/database.js';
import { config } from '../config/config.js';

class ProductoModel {
    constructor() {
        this.collectionName = config.mongodb.collections.productos;
    }

    getCollection() {
        return database.getCollection(this.collectionName);
    }

    // Validar datos de producto
    validate(producto) {
        const errors = [];

        if (!producto.nombre || producto.nombre.trim() === '') {
            errors.push('El nombre del producto es obligatorio');
        }

        if (!producto.precio || isNaN(producto.precio) || producto.precio <= 0) {
            errors.push('El precio debe ser un número mayor a 0');
        }

        return errors;
    }

    // Sanitizar datos antes de insertar/actualizar
    sanitize(producto) {
        const base = {
            nombre: producto.nombre?.trim(),
            descripcion: producto.descripcion?.trim() || producto['descripcion-corta']?.trim() || producto.descripcionAuto?.trim() || '',
            precio: parseFloat(producto.precio),
            moneda: producto.moneda || 'ARS', // ARS o USD
            tipoProducto: producto.tipoProducto || 'producto', // 'auto' o 'producto'
            activo: producto.activo !== undefined ? Boolean(producto.activo) : true,
            oculto: producto.oculto !== undefined ? Boolean(producto.oculto) : false,
            fechaCreacion: producto.fechaCreacion || new Date(),
            fechaActualizacion: new Date()
        };

        // CAMPOS PARA AUTOS
        if (producto.tipoProducto === 'auto') {
            base.marca = producto.marca?.trim() || '';
            base.modeloAuto = producto.marca?.trim() || producto.modeloAuto?.trim() || '';
            base.categoria = producto.marca?.trim() || producto.categoria?.trim() || '';
            base.colorAuto = producto.colorAuto?.trim() || '';
            base.kilometros = parseInt(producto.kilometros) || 0;
            base.estadoStock = producto.estadoStock || 'disponible'; // disponible, reservado, vendido
            base.stock = producto.estadoStock === 'vendido' ? 0 : 1;
            base.descripcionAuto = producto.descripcionAuto?.trim() || producto.descripcion?.trim() || '';
            base.envioExterior = Boolean(producto.envioExterior);
        } 
        // CAMPOS PARA PRODUCTOS
        else {
            base.stock = parseInt(producto.stock) || 0;
            base.marca = producto.marca?.trim() || '';
            base.modelos = Array.isArray(producto.modelos) ? producto.modelos : [];
            // UNIFICAR: usar subcategoria como fuente principal de categoría
            base.subcategoria = producto.subcategoria?.trim() || producto.categoria?.trim() || '';
            base.categoria = base.subcategoria; // Categoría siempre igual a subcategoria para productos
            base.color = producto.color?.trim() || '';
            base.tamano = producto.tamano?.trim() || '';
            base['descripcion-corta'] = producto['descripcion-corta']?.trim() || producto.descripcion?.trim() || '';
            base['descripcion-larga'] = producto['descripcion-larga']?.trim() || '';
            base.envio = Boolean(producto.envio);
        }

        // IMÁGENES (común para ambos)
        if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
            base.imagenes = producto.imagenes;
        } else {
            base.imagenes = [];
        }

        // Mantener compatibilidad con foto/imagen antiguas
        base.imagen = producto.imagen?.trim() || producto.foto?.trim() || '';
        base.foto = producto.foto?.trim() || producto.imagen?.trim() || '';
        
        base.destacado = Boolean(producto.destacado);

        return base;
    }

    // Obtener todos los productos
    async findAll() {
        try {
            const collection = this.getCollection();
            const productos = await collection.find({ activo: true }).toArray();
            return productos;
        } catch (error) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    // Obtener producto por ID
    async findById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('ID de producto inválido');
            }

            const collection = this.getCollection();
            const producto = await collection.findOne({ _id: new ObjectId(id) });
            
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            return producto;
        } catch (error) {
            throw new Error(`Error al obtener producto: ${error.message}`);
        }
    }

    // Crear nuevo producto
    async create(productoData) {
        try {
            const errors = this.validate(productoData);
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            const producto = this.sanitize(productoData);
            const collection = this.getCollection();
            
            const result = await collection.insertOne(producto);
            
            return {
                _id: result.insertedId,
                ...producto
            };
        } catch (error) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    // Actualizar producto
    async update(id, productoData) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('ID de producto inválido');
            }

            const errors = this.validate(productoData);
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            const producto = this.sanitize(productoData);
            const collection = this.getCollection();

            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: producto },
                { returnDocument: 'after' }
            );

            if (!result) {
                throw new Error('Producto no encontrado');
            }

            return result;
        } catch (error) {
            throw new Error(`Error al actualizar producto: ${error.message}`);
        }
    }

    // Eliminar producto (soft delete)
    async delete(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('ID de producto inválido');
            }

            const collection = this.getCollection();
            
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { activo: false, fechaActualizacion: new Date() } },
                { returnDocument: 'after' }
            );

            if (!result) {
                throw new Error('Producto no encontrado');
            }

            return result;
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }

    // Eliminar producto permanentemente (opcional)
    async deleteForever(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error('ID de producto inválido');
            }

            const collection = this.getCollection();
            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 0) {
                throw new Error('Producto no encontrado');
            }

            return { mensaje: 'Producto eliminado permanentemente' };
        } catch (error) {
            throw new Error(`Error al eliminar producto: ${error.message}`);
        }
    }
}

export const productoModel = new ProductoModel();
