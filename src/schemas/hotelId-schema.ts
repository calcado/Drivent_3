import {HotelIdType } from "@/protocols"
import joi from "joi"

export const hotelIdSchema = joi.object<HotelIdType>({
     hotelId: joi.number().integer().required(),
});