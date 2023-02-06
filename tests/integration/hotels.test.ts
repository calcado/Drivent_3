import supertest from "supertest";
import {createUser,
  createEnrollmentWithAddress, 
  createNotPaidTicket, 
  createTicketType, 
  createTicket, 
  createPayment, 
  createPaidTicket, 
  createHotels, 
  updatePayment,
  createTicketWithHotel,
  createHotelRoom} from "../factories/"
import faker from "@faker-js/faker";
import app,{init} from "@/app"
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { TicketStatus } from "@prisma/client";
import { date } from "joi";

  beforeAll(async ()=>{
      await init();    
  })

  beforeEach(async ()=>{
      await cleanDb();
  })

  const server = supertest(app);

  describe("GET /hotels",()=>{

      it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if given token is not valid", async () => {

        const token = faker.lorem.word();    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should respond with status 401 if there is no session for given token", async () => {

        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe("When token is valid",()=>{
        it("should respond with 404 when user doesn't have an enrollment", async()=>{
            const token = await generateValidToken();
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        })

        it("should respond with status 404 when user doesnt have a ticket yet", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);
      
            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
            expect(response.status).toEqual(httpStatus.NOT_FOUND);            

      });
        it("should respond with status 402 if ticket is not paid", async()=>{
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user)
          const ticketType = await createTicketType();
          const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED)

          const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

          
          expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        })

        it("should respond with status 402 if hotel not included", async ()=>{
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user)
          const ticketType = await createTicketType();
          const ticket = await createTicket(enrollment.id,ticketType.id, TicketStatus.RESERVED)
          const payment = await createPayment(ticket.id, ticketType.price)

          const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

          expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)

        })

        it("Should respond with status 402 if ticket is remote", async()=>{
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user)
          const ticketType = await createTicketType();
          const ticket = await createTicket(enrollment.id,ticketType.id, TicketStatus.RESERVED)

          const payment = await createPayment(ticket.id, ticketType.price)          
          const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)

          expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
        })
        
        it("should respond with status 200 and with hotel data", async () => {
          
          const user = await createUser();
          const token = await generateValidToken(user);
          const enrollment = await createEnrollmentWithAddress(user);
          const ticketType = await createTicketWithHotel();
          const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
          const payment = await createPayment(ticket.id, ticketType.price);
          await updatePayment(payment.ticketId)
          const hotel = await createHotels();

          
          const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`)
          expect(response.status).toEqual(httpStatus.OK)
          expect(response.body).toEqual([{

            id:expect.any(Number),
            name:expect.any(String),
            image:expect.any(String),
            createdAt:expect.any(String),
            updatedAt:expect.any(String)
          }])

        })
      })      

} )

  describe("GET /hotels/:hotelid", ()=>{

  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {

    const token = faker.lorem.word();    
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if there is no session for given token", async () => {

    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });


  describe("When token is valid",()=>{
    it("should respond with 400 when the body param hotelId is invalid",async()=>{
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get("/hotels/test").set("Authorization", `Bearer ${token}`)

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
  })

    it("should respond with 404 when user doesn't have an enrollment", async()=>{
      const token = await generateValidToken();
      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
  })

  it("should respond with status 404 when user doesnt have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.NOT_FOUND);          

});

  it("should respond with status 402 if ticket is not paid", async()=>{
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id,ticketType.id,TicketStatus.RESERVED)

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)

    
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  })

  it("should respond with status 402 if hotel not included", async ()=>{
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id,ticketType.id, TicketStatus.RESERVED)
    const payment = await createPayment(ticket.id, ticketType.price)

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)

  })
  
  it("Should respond with status 402 if ticket is remote", async()=>{
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user)
    const ticketType = await createTicketType();
    const ticket = await createTicket(enrollment.id,ticketType.id, TicketStatus.RESERVED)

    const payment = await createPayment(ticket.id, ticketType.price)          
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`)

    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)
  }) 
  
  
  it("should responde with status 200 an room data", async ()=>{
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);     
    
      const hotel = await createHotels();
      const room = await createHotelRoom(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toEqual({

            id:expect.any(Number),
            name:hotel.name,
            image:hotel.image,
            createdAt:hotel.createdAt.toISOString(),
            updatedAt:hotel.updatedAt.toISOString(),
            Rooms:[{
              id: expect.any(Number),
              name: room.name,
              hotelId: room.hotelId,
              capacity: room.capacity,
              createdAt: room.createdAt.toISOString(),
              updatedAt: room.updatedAt.toISOString(),
        },]
    })
  })
  })
})