const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");

async function startServer(){
    try {
        await MongoDB.connect(config.db.uri);
        console.log("Kết nối database thành công");

        const PORT = config.app.port;

        app.listen(PORT, () => {
            console.log(`Server đang chạy trên cổng ${PORT}`);
        });
    }catch (error) {
        console.log("Cannot connect to the database!", error);
        process.exit();
    }
}

startServer();