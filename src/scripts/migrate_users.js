// migration/migrate.js
const { ObjectId } = require('mongodb');
const { connectMySQL } = require('./mysql');
const { connectMongo } = require('./mongo');

function getPermissions(role) {
    const permissions = {
        pastor: ['ADMIN_CELL'],
        supervisor: ['SUPERVISOR']
    };

    return permissions[role?.toLowerCase()] || ['USER'];
}

function findCellByName(name, cells) {
    const cell = cells[0].cells.find(cell =>
        cell.name?.toLowerCase().trim() === name?.toLowerCase().trim()
    );

    if (!cell) return null;

    return {
        _id: cell._id.toString(),
        name: cell.name
    };
}

async function migrate() {
    const mysqlConn = await connectMySQL();
    const { client: mongoClient, db } = await connectMongo();
    const cells = await db.collection('churchs').find({ _id: new ObjectId('686d94b389e6b6180b3dbe55') }, { projection: { cells: 1 } }).toArray()
    // const matchedCell = findCellByName(row.supervisao, cells);

    try {
        const [rows] = await mysqlConn.execute('SELECT * FROM membros');

        const users = rows.map((row) => ({
            name: row.nome.toUpperCase().trim(),
            birthDate: row.nasc,
            address: row.endereco,
            phone: row.telefone,
            cem: findCellByName(row.supervisao, cells),
            role: row.cargo === 'Anfritião' ? 'membro' : row.cargo.toLowerCase(),
            email: row.email,
            createdAt: row.cadastro,
            churchId: '686d94b389e6b6180b3dbe55',
            active: row.status === 'ativo' ? true : false,
            permission: getPermissions(row.cargo)
        }));
        console.log(users);
        const result = await db.collection('users').insertMany(users);
        console.log(`Migrated ${result.insertedCount} users to MongoDB.`);
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mysqlConn.end();
        await mongoClient.close();
    }
}

migrate();
