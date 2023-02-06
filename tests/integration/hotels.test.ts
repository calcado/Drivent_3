import supertest from "supertest";
import {createUser,createEnrollmentWithAddress} from "../factories/"
import faker from "@faker-js/faker";
import app,{init} from "@/app"
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";

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
            

      })

      })      






} )