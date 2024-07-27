import express from 'express';
import router from "./src/routes/routes.js";
import cors from 'cors';

const app = express();
const port = 8080;

app.use(cors());
app.use("/", router);

app.listen(port, () => {
    console.log(`Server is Running at port: ${port}`);
});