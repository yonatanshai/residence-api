const app = require('./app');
const connectMongoose = require('./db/mongoose');
const port = process.env.PORT;


// connectMongoose(() => app.listen(port, () => console.log(`Server running on port ${port}`)));
app.listen(port, () => console.log(`Server running on port ${port}`));
