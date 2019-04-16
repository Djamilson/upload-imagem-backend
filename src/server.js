const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('connectRoom', box => {
    socket.join(box);
  });
});

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_KEY}-@cluster0-exrjh.mongodb.net/uploadfotos?retryWrites=true`, {
  useNewUrlParser: true
});


app.use((req, res, next) => {
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
   req.io = io;

  return next();
});


app.use(express.json()); //para enviar json
app.use(express.urlencoded({ extended: true })); //para envia arquivos de fotos
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333);