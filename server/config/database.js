import { MongoClient } from 'mongodb';
import { config } from './config.js';

class Database {
    constructor() {
        this.client = null;
        this.db = null;
    }

    async connect() {
        try {
            if (!config.mongodb.uri) {
                throw new Error('MONGODB_URI no está definida en las variables de entorno');
            }

            console.log('🔄 Conectando a MongoDB Atlas...');
            
            this.client = new MongoClient(config.mongodb.uri);
            await this.client.connect();
            
            this.db = this.client.db(config.mongodb.dbName);
            
            console.log('✅ Conexión exitosa a MongoDB Atlas');
            console.log(`📦 Base de datos: ${config.mongodb.dbName}`);
            
            return this.db;
        } catch (error) {
            console.error('❌ Error al conectar a MongoDB:', error.message);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.client) {
                await this.client.close();
                console.log('🔌 Desconectado de MongoDB');
            }
        } catch (error) {
            console.error('❌ Error al desconectar de MongoDB:', error.message);
            throw error;
        }
    }

    getDB() {
        if (!this.db) {
            throw new Error('Base de datos no conectada. Llama a connect() primero');
        }
        return this.db;
    }

    getCollection(collectionName) {
        return this.getDB().collection(collectionName);
    }
}

// Exportar instancia única (singleton)
export const database = new Database();
