import { url } from "inspector";
import { number, object, string } from "joi";
import { type } from "os";

export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,

};

//Regra de Negócio
export type AddressEnrollment = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
  error?: string

}

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};

export type Hotels = 
  {
    id: number,
    name: string,
    image: string,
    roomId: number,
    createdAt: string,
    updatedAt: string,
    
  }

export type HotelId = 
{
  hotelId: number
}