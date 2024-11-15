const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Leer datos de un archivo JSON (subastas)
const readData = () => {
    try {
        const data = fs.readFileSync('./data.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error al leer data.json:', err);
        return { subastas: [] };
    }
};

// Escribir datos en un archivo JSON (subastas)
const writeData = (data) => {
    try {
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error al escribir en data.json:', err);
    }
};

// Leer datos de un archivo JSON (usuarios)
const readDataU = () => {
    try {
        const usua = fs.readFileSync('./usuarios.json', 'utf-8');
        return JSON.parse(usua);
    } catch (err) {
        console.error('Error al leer usuarios.json:', err);
        return { lista: [] };
    }
};

// Escribir datos en un archivo JSON (usuarios)
const writeDataU = (usua) => {
    try {
        fs.writeFileSync('./usuarios.json', JSON.stringify(usua, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error al escribir en usuarios.json:', err);
    }
};

//1_ Endpoint de bienvenida
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de sistema de gestión de subastas en línea!');
});

//2_ Endpoint para obtener todas las subastas
app.get('/subastas', (req, res) => {
    const data = readData();
    res.json(data.subastas);
});

//3_ Endpoint para obtener todos los usuarios
app.get('/lista', (req, res) => {
    const usua = readDataU();
    res.json(usua.lista);
});

//4_ Endpoint para obtener una subasta específica por su ID
app.get('/subastas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const subasta = data.subastas.find((subasta) => subasta.id === id);
    if (subasta) {
        res.json(subasta);
    } else {
        res.status(404).json({ error: 'La Subasta no fue encontrada' });
    }
});

//5_ Endpoint para obtener un usuario específica por su categoria
app.get('/lista/categoria/:categoria', (req, res) => {
    const usua = readDataU();
    const categoria = (req.params.categoria);
    const lista = usua["lista"].find((lista) => lista.categoria === categoria);
    if (lista) {
        res.json(lista);
    } else {
        res.status(404).json({ error: 'La categoria no fue encontrada' });
    }
});

//6_ Endpoint para obtener un usuario específico por su ID
app.get('/lista/id/:id', (req, res) => {
    const usua = readDataU();
    const id = parseInt(req.params.id);
    const lista = usua["lista"].find((lista) => lista.id === id);
    if (lista) {
        res.json(lista);
    } else {
        res.status(404).json({ error: 'El ID no fue encontrado' });
    }
});

//7_ Endpoint para crear una nueva subasta
app.post('/subastas', (req, res) => {
    const data = readData();
    const body = req.body;
    const nuevaSubasta = {
        id: data.subastas.length + 1,
        ...body,
    };
    data.subastas.push(nuevaSubasta);
    writeData(data);
    res.status(201).json(nuevaSubasta);
});

//8_ Endpoint para crear un nuevo usuario
app.post('/lista', (req, res) => {
    const usua = readDataU();
    const body = req.body;
    const nuevoUsuario = {
        id: usua.lista.length + 1,
        ...body,
    };
    usua.lista.push(nuevoUsuario);
    writeDataU(usua);
    res.status(201).json(nuevoUsuario);
});

//9_ Endpoint para actualizar una subasta existente
app.put('/subastas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const subastaIndex = data.subastas.findIndex((subasta) => subasta.id === id);
    
    if (subastaIndex !== -1) {
        const updatedSubasta = {
            ...data.subastas[subastaIndex],
            ...req.body,
        };
        data.subastas[subastaIndex] = updatedSubasta;
        writeData(data);
        res.json(updatedSubasta);
    } else {
        res.status(404).json({ error: 'La Subasta no fue encontrada' });
    }
});

//10_ Endpoint para actualizar un usuario existente
app.put('/lista/:id', (req, res) => {
    const usua = readDataU();
    const id = parseInt(req.params.id);
    const listaIndex = usua.lista.findIndex((lista) => lista.id === id);
    
    if (listaIndex !== -1) {
        const updatedLista = {
            ...usua.lista[listaIndex],
            ...req.body,
        };
        usua.lista[listaIndex] = updatedLista;
        writeData(usua);
        res.json(updatedLista);
    } else {
        res.status(404).json({ error: 'El usuario no fue encontrada' });
    }
});

//11_ Endpoint para cambiar el estado de la subasta a abierto
app.delete('/EstadoC/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id)
    const subasta = data.subastas.find((subasta) => subasta.id === id);
    if (subasta) {
        let estado = subasta.estado;
        if (estado === "Cerrado") {
            subasta.estado = "Abierto"
            writeData(data);
            res.json({message: "Estado cambiado"})
        }else{ 
             subasta.estado = "Cerrado"
             writeData(data);
             res.json({message: "Estado cambiado"})             
        }
    } else {
        res.status(404).json({ error: 'La Subasta no fue encontrada' });
    }
});

//12_ Endpoint para eliminar una subasta
app.delete('/subastas/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const filteredSubastas = data.subastas.filter((subasta) => subasta.id !== id);

    if (data.subastas.length !== filteredSubastas.length) {
        data.subastas = filteredSubastas;
        writeData(data);
        res.json({ mensaje: 'La Subasta fue eliminada correctamente' });
    } else {
        res.status(404).json({ error: 'La Subasta no fue encontrada' });
    }
});

//13_ Endpoint para eliminar un usuario
app.delete('/lista/:id', (req, res) => {
    const usua = readDataU();
    const id = parseInt(req.params.id);
    const filteredLista = usua.lista.filter((lista) => lista.id !== id);

    if (usua.lista.length !== filteredLista.length) {
        usua.lista = filteredLista;
        writeDataU(usua);
        res.json({ mensaje: 'El usuario fue eliminado correctamente' });
    } else {
        res.status(404).json({ error: 'El usuario no fue encontrado' });
    }
});

//14_ Endpoint para hacer una oferta en una subasta SI esta esta abierta
app.post('/subastas/:id/ofertas', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const subasta = data.subastas.find((subasta) => subasta.id === id);

    if (subasta.estado === 'Abierto') {
        const nuevaOferta = {
            oferta: subasta.ofertas ? subasta.ofertas.length + 1 : 1,
            ...req.body,
        };
        if (subasta.ofertas) {
            subasta.ofertas = [];
        }
        subasta.ofertas.push(nuevaOferta);
        writeData(data);
        res.status(201).json(nuevaOferta);
    }
    else if (subasta.estado === 'Cerrado') {
        return res.status(400).json({ error: 'La subasta no está abierta para ofertas.' });
    } 

});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
