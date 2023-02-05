import { prisma } from "@/config";

function getAllHotels(){
    return prisma.hotel.findMany();    
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