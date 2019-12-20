const mongoose = require('mongoose');

const app = require('./app');

const port = process.env.PORT;

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-ngxlm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
    .catch(err => console.log(err));