import { notFoundError, PaymentRequiredError } from "@/errors";
import { Hotel } from "@prisma/client";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId:number):Promise<Hotel[]>{
    
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollment){
        throw notFoundError();
    }
    
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket){
        throw notFoundError();
    }
    
    if(ticket.status!== "PAID"){
        throw PaymentRequiredError("Ticket not paid");

    }
    if(ticket.TicketType.isRemote){
        throw PaymentRequiredError("Ticket is remote");
    }
    
    if(!ticket.TicketType.includesHotel){
        throw PaymentRequiredError("Ticket does not includes hotel");
    }


    const allHotels = await hotelsRepository.getAllHotels()    
    
    if(!allHotels){
        throw notFoundError();
    }
    return allHotels
}

async function getHotelsById(userId:number, hotelId:number):Promise<Hotel>{
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if(!enrollment){
        throw notFoundError();
    }

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket){
        throw notFoundError();
    }
    if(ticket.status!=="PAID"){
        throw PaymentRequiredError("Ticket not paid");        
    }
    if(ticket.TicketType.isRemote){
        throw PaymentRequiredError("Ticket is remote")
    }

    if(ticket.TicketType.includesHotel){
        throw PaymentRequiredError("Ticket does not includes hotel");
    }

    
    const hotelById = await hotelsRepository.getHotelbyId(hotelId)
    
    if(!hotelById){
        throw notFoundError();
    }

    const rooms = await hotelsRepository.getRoomsbyId(hotelId)
    if(!rooms){
        throw notFoundError();
    }

    return rooms

}

const hotelsService = {
    getHotels,
    getHotelsById
}

export default hotelsService