const express = require('express');
// Слушаем 4000 порт
const { PORT = 4001 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
