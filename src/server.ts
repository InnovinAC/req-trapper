import express from "express";
import {ReqTrapper} from "./functionality/ReqTrapper";
const reqTrapper = new ReqTrapper();

try {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true, limit: "1MB"}))
    app.post('/test', reqTrapper.validate([
        {name: 'test', validation: 'required|in_array:a,b,c'},
        {name: 'test2', validation: 'required'},
    ]), (req, res) => {
        console.log("here")
        res.sendStatus(200);
    })
    app.listen(1000, () => {
        console.log("server started");
    })
} catch (e) {
    console.log("An error occurred")

}