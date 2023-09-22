const express = require('express');
const app = express();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const portName = 'COM3'; // Ganti 'COM3' dengan nama port serial yang digunakan oleh Arduino
const port = new SerialPort(portName, { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Middleware untuk mengizinkan permintaan CORS (jika Anda membutuhkannya)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Menggunakan body-parser untuk menguraikan payload JSON
app.use(express.json());

// Endpoint untuk menerima perintah dari halaman web
app.post('/control', (req, res) => {
  const { command } = req.body;
  
  // Kirim perintah ke Arduino
  port.write(command, (err) => {
    if (err) {
      console.error('Error:', err.message);
      res.status(500).json({ message: 'Gagal mengirim perintah ke Arduino' });
    } else {
      console.log(`Perintah terkirim ke Arduino: ${command}`);
      res.json({ message: 'Perintah berhasil terkirim ke Arduino' });
    }
  });
});

// Port yang digunakan oleh server
const portNumber = 3000;

// Jalankan server
app.listen(portNumber, () => {
  console.log(`Server berjalan pada port ${portNumber}`);
});
