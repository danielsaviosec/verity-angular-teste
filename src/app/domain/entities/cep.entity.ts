export interface CepRequest {
  cep: string;
}

export interface CepResponse {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
}
