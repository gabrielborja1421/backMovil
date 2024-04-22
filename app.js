const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1421',
  database: 'datos'
});

// Inicializar express
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Endpoints

// Obtener todos los registros
app.get('/api/lenguajes', (req, res) => {
  connection.query('SELECT * FROM lenguajes', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});
//obtener por id
app.get('/api/lenguajes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM lenguajes WHERE idlenguaje = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al obtener el registro.', error: error });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Registro no encontrado.' });
      }
    }
  });
});


// Obtener los nombres de todos los lenguajes
app.get('/api/lenguajes-names', (req, res) => {
    connection.query('SELECT nombre FROM lenguajes', (error, results) => {
      if (error) {
        // Es mejor práctica manejar los errores así en lugar de usar `throw`
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los nombres de los lenguajes' });
        return;
      }
      // Esto extraerá solo los nombres de los lenguajes y los enviará como un array
      const nombres = results.map(row => row.nombre);
      res.json(nombres);
    });
  });
  
// Crear un registro
app.post('/api/lenguaje', (req, res) => {
  // Asegúrate de validar y desinfectar el input del usuario aquí
  const data = req.body;
  connection.query('INSERT INTO lenguajes SET ?', data, (error, results) => {
    if (error) throw error;
    res.status(201).json({ id: results.insertId });
  });
});

// Actualizar un registro
app.put('/api/lenguajes/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  connection.query('UPDATE lenguajes SET ? WHERE idLenguaje = ?', [data, id], (error, results) => {
    if (error) throw error;
    res.json({ message: 'Registro actualizado.' });
  });
});

// Eliminar un registro
app.delete('/api/lenguajes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM lenguajes WHERE idLenguaje = ?', id, (error, results) => {
    if (error) throw error;
    res.json({ message: 'Registro eliminado.' });
  });
});

// _______________________________________________________________

//endpoits Mensajes

// CRUD Endpoints para 'mensajes'

// Obtener todos los mensajes
app.get('/api/mensajes', (req, res) => {
  connection.query('SELECT * FROM mensajes', (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al obtener los mensajes', error });
    } else {
      res.json(results);
    }
  });
});

// Obtener un mensaje por id
app.get('/api/mensajes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM mensajes WHERE idmensajes = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al obtener el mensaje', error });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'Mensaje no encontrado' });
      }
    }
  });
});

// Crear un nuevo mensaje
app.post('/api/mensajes', (req, res) => {
  const data = req.body; // Asegúrate de que 'body-parser' middleware esté configurado para parsear JSON.
  connection.query('INSERT INTO mensajes SET ?', data, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al crear el mensaje', error });
    } else {
      res.status(201).json({ id: results.insertId });
    }
  });
});

// Actualizar un mensaje
app.put('/api/mensajes/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  connection.query('UPDATE mensajes SET ? WHERE idmensajes = ?', [data, id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al actualizar el mensaje', error });
    } else {
      res.json({ message: 'Mensaje actualizado con éxito' });
    }
  });
});

// Eliminar un mensaje
app.delete('/api/mensajes/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM mensajes WHERE idmensajes = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al eliminar el mensaje', error });
    } else {
      res.json({ message: 'Mensaje eliminado con éxito' });
    }
  });
});
// Endpoint para obtener todas las novedades
app.get('/api/novedades', (req, res) => {
  connection.query('SELECT * FROM novedades', (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al obtener las novedades', error: error });
      return;
    }
    res.json(results);
  });
});

// Endpoint para obtener una novedad por su ID
app.get('/api/novedades/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM novedades WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al obtener la novedad', error: error });
      return;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Novedad no encontrada' });
    }
  });
});

// Endpoint para crear una nueva novedad
app.post('/api/novedades', (req, res) => {
  const data = req.body;
  connection.query('INSERT INTO novedades SET ?', data, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al crear la novedad', error: error });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Endpoint para actualizar una novedad por su ID
app.put('/api/novedades/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  connection.query('UPDATE novedades SET ? WHERE id = ?', [data, id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al actualizar la novedad', error: error });
      return;
    }
    res.json({ message: 'Novedad actualizada' });
  });
});

// Endpoint para eliminar una novedad por su ID
app.delete('/api/novedades/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM novedades WHERE id = ?', [id], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error al eliminar la novedad', error: error });
      return;
    }
    res.json({ message: 'Novedad eliminada' });
  });
});

// ...

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
