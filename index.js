const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Configurar a conexão com o PostgreSQL
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST, // Banco de dados configurado no Railway
    username: process.env.DB_USERNAME, // Usuário configurado no Railway
    password: process.env.DB_PASSWORD, // Senha configurada no Railway
    database: process.env.DB_NAME, // Nome do banco de dados configurado no Railway
    logging: console.log, // Se quiser ver os logs de consultas no console
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

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
