const mongoose = require('mongoose');

const connect = async (cb) => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-ngxlm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )

        cb();
    } catch (error) {
        console.log(error);
    }
    // mongoose
    // .connect(
    //     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-ngxlm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    //     {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //     }
    // )
    // // .then(() => console.log((`mongoose connected to ${process.env.DB_NAME}`)))
    // .then(cb)
    // .catch(err => console.log(err));
}

module.exports = connect;

