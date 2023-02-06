import { Request,Response } from "express";
import hotelsService from "@/services/hotels-service";
import httpStatus, { NOT_FOUND } from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import { HotelId } from "@/protocols";

export async function getHotels(req:AuthenticatedRequest, res:Response){
    const {userId} = req;
    try{
        const hotels = await hotelsService.getHotels(userId)        
        
        return res.status(httpStatus.OK).send(hotels)

    }catch(error){

        if(error.name === "NotFoundError"){

            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        if(error.name === "PaymentRequiredError"){

            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
        }        


        return res.sendStatus(httpStatus.BAD_REQUEST)
    }    

}

export async function getHotelsById(req:AuthenticatedRequest, res:Response){
    const {userId} = req
    const {hotelId} = req.params
    const numberHotelId = parseInt(hotelId)
    try{
        const hotelById = await hotelsService.getHotelsById(userId,numberHotelId)

        return res.status(httpStatus.OK).send(hotelById)
    }catch(error){
        
        if(error.name==="NotFoundError"){
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        

        if(error.name==="PaymentRequiredError"){
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED)
        }

        return res.sendStatus(httpStatus.BAD_REQUEST)
    }

}