const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Configurar a conexão com o PostgreSQL
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
});


// Testar a conexão
sequelize.authenticate()
    .then(() => console.log('Conexão com PostgreSQL estabelecida com sucesso!'))
    .catch(err => console.log('Erro de conexão:', err));

// Definir o modelo de Mensagem
const Message = sequelize.define('Message', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'messages',
});

// Rota para receber mensagens
app.post('/messages', async (req, res) => {
    const { name, email, message } = req.body;

    // Validações básicas
    if (!name || !email || !message || message.length > 250) {
        return res.status(400).json({ error: 'Dados inválidos!' });
    }

    try {
        // Salvar a mensagem no banco de dados
        const newMessage = await Message.create({ name, email, message });
        res.status(200).json({ message: 'Mensagem enviada com sucesso!', data: newMessage });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar a mensagem.' });
    }
});

aapp.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
