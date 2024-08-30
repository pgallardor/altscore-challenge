import express, { type Request, type Response, type Express } from "express"
import {readFileSync} from "fs"
import cors from "cors"

const app: Express = express()

enum HttpCode {
    OK = 200,
    TEAPOT = 418
}

app.use(cors())

app.get("/", (req: Request, res: Response) => {
    return res.status(HttpCode.OK).send("Helloo!!!")
})

app.get("/status", (req: Request, res: Response) => {
    return res.status(HttpCode.OK).json({
        "damaged_system": "life_support"
    })
})

app.get("/repair-bay", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/html")
    const html = readFileSync("index.html")
    res.write(html)
    res.end()
})

app.post("/teapot", (req: Request, res: Response) => {
    return res.status(HttpCode.TEAPOT).end()
})

app.listen(8080, () => {
    console.log("Running on port 8080")
})