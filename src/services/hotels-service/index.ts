import { notFoundError, PaymentRequiredError } from "@/errors";
import { Hotels } from "@/protocols";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { PAYMENT_REQUIRED } from "http-status";
import { Hotel } from "@prisma/client";


async function getHotels(userId:number):Promise<Hotel[]>{
    //Não existe (inscrição, ticket ou hotel): 404 (not found)
    const enrollments = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollments){
        throw notFoundError();
    }

    //Ticket não foi pago, é remoto ou não inclui hotel: 402 (payment required)
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollments.id)
    if(!ticket){
        throw notFoundError();
    }
    if(ticket.status!== "PAID"){
        throw PaymentRequiredError();

    }
    if(ticket.TicketType.isRemote){
        throw PaymentRequiredError();
    }
    
    if(!ticket.TicketType.includesHotel){
        throw PaymentRequiredError();
    }

    const hotels = await hotelsRepository.getAllHotels()    
    console.log(hotels)
    if(!hotels){
        throw notFoundError();
    }
    return hotels
}

// async function getHotelsById(id:number){
//     const hotelById = await hotelsRepository.getHotelbyId(id)
    
//     if(!hotelById){
//         throw notFoundError();
//     }
//     return hotelById

// }

const hotelsService = {
    getHotels,
    // getHotelsById
}

export default hotelsService