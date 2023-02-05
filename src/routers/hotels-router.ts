import { authenticateToken, validateBody } from "@/middlewares";
import {Router} from "express";
import { getHotels} from "@/controllers";


const hotelsRouter = Router();

hotelsRouter
        .all("/*", authenticateToken)
        .get("", getHotels)
        // .get("/:hotelId", getHotelsById)

export {hotelsRouter}