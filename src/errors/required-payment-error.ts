import { ApplicationError } from "@/protocols";

export function  PaymentRequiredError():ApplicationError{
    return{

        name:"PaymentRequiredError",
        message:"Error in payment"

    }
}