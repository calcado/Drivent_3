import { prisma } from "@/config";
import { Hotel,Room } from "@prisma/client";

function getAllHotels():Promise<Hotel[]>{
    return prisma.hotel.findMany({});    
}

function getHotelbyId(id:number):Promise<Hotel>{
    return prisma.hotel.findFirst({
        where:{id}
    })
}

function getRoomsbyId(id:number):Promise<Hotel & {
    Rooms:Room[]}>{
    return prisma.hotel.findFirst({
        where:{id},
        include:{
            Rooms: true
        }
        
    })
}

const hotelsRepository={
    getAllHotels,
    getHotelbyId,
    getRoomsbyId
}

export default hotelsRepository;