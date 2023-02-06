import { ApplicationError } from "@/protocols";

export function  PaymentRequiredError(message:string):ApplicationError{
    return{
        name:"PaymentRequiredError",
        message,
    }
}