import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

function getAllHotels():Promise<Hotel[]>{
    return prisma.hotel.findMany({});    
}

function getHotelbyId(id:number){
    return prisma.hotel.findFirst({
        where:{id},
        include:{
            Rooms: true
        }
        
    })
}

const hotelsRepository={
    getAllHotels,
    getHotelbyId
}

export default hotelsRepository;