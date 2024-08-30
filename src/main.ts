import express, { type Request, type Response, type Express } from "express"
import {readFileSync} from "fs"
import cors from "cors"

const app: Express = express()

enum HttpCode {
    OK = 200,
    BAD_REQUEST = 400,
    TEAPOT = 418
}

interface Point {
    x: number;
    y: number;
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

app.get("/phase-change-diagram", (req: Request, res: Response) => {
    if (!req.query["pressure"])
        return res.status(HttpCode.BAD_REQUEST).send("Pressure not provided")

    const pressure: number = +req.query["pressure"]
    const pend = (p1: Point, p2: Point) => (p2.y - p1.y) / (p2.x - p1.x)

    const liquidLine = (p: number) => {
        const p1 = {x: 0.00105, y: 0.05}
        const p2 = {x: 0.0035, y: 10}

        return (p - p2.y) / pend(p1, p2) + p2.x
    }

    const vaporLine = (p: number) => {
        const p1 = {x: 0.0035, y: 10.0}
        const p2 = {x: 30.0, y: 0.05}

        return (p - p2.y) / pend(p1, p2) + p2.x
    }

    return res.status(HttpCode.OK).json({
        "specific_volume_liquid": parseFloat(liquidLine(pressure).toFixed(16)),
        "specific_volume_vapor": parseFloat(vaporLine(pressure).toFixed(16))
    })
})

app.listen(8080, () => {
    console.log("Running on port 8080")
})