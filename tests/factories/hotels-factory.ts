import faker from "@faker-js/faker";
import {prisma} from "@/config";

export async function createHotels(){

 return prisma.hotel.create({ 
    data:{
        name: faker.name.findName(),
        image: faker.name.findName(),
}})


}

export async function createHotelRoom(hotelId:number){
    return prisma.room.create({
        data:{  
            name:faker.name.findName(),
            capacity: faker.datatype.number({min:1,max:4}),
            hotelId
        },
    })
    
}