import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import {Router} from "express";
import { getHotels,getHotelsById} from "@/controllers";
import {hotelIdSchema} from "@/schemas"

const hotelsRouter = Router();

hotelsRouter
        .all("/*", authenticateToken)
        .get("", getHotels)
        .get("/:hotelId",validateParams(hotelIdSchema), getHotelsById)

export {hotelsRouter}