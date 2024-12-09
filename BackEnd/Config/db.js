import mongoose from "mongoose";

const ConnectionDB = async () => {

    try {
        await mongoose.connect(`mongodb+srv://akashtayade5668:9Za4eDNIfTf53d69@cluster0.hdcya.mongodb.net/tejas`);
        console.log("MongoDB is Sucessfully Connected");
    } catch (error) {
        console.log(`ERROR,${error}`);
    }

};

export default ConnectionDB;