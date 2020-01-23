const app = require('./app');
const connectMongoose = require('./db/mongoose');
const port = process.env.PORT || 5000;


connectMongoose(() => app.listen(port, () => console.log(`Server running on port ${port}`)));
// app.listen(port, () => console.log(`Server running on port ${port}`));
