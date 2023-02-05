import supertest from "supertest";
import app,{init} from "@/app"
import { cleanDb } from "../helpers";
import httpStatus from "http-status";

beforeAll(async ()=>{
    await init();
    await cleanDb();
})

const server = supertest(app);

describe("GET /hotels",()=>{
it("It should respond with 200 and all hotels in success", async ()=>{
    
    
    const response = await server.get("/hotels")
    expect(response.status).toEqual(httpStatus.OK)
    
})

describe("GET /hotels/:id", ()=>{

it("it should respond  with 200 and the chosen hotel's rooms",async()=>{

    const response = await server.get("/hotels/:id")
    expect(response.status).toEqual(httpStatus.OK)
})
})
} )