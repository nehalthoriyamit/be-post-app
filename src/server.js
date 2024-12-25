const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const supabase = require('./supabaseClient');
const sequelize = require('./config/database');
const apiRoutes = require('./api/routes/index');
const { ENV_VAR } = require('./utils/envConstants');

const app = express();

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan('[:date[clf]] :remote-addr - :method :url :status :response-time ms - :body'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(ENV_VAR.PORT, () => {
    console.log(`Server running on http://localhost:${ENV_VAR.PORT}`);
  });
});
