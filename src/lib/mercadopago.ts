// Step 1: Import the parts of the module you want to use
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

// Step 2: Initialize the client object
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN,
  options: { timeout: 5000, idempotencyKey: "abc" },
});

// Step 3: Initialize the API object
const pref = new Preference(client);

type CreatePrefOptions = {
  productName: string;
  productDescription: string;
  productId: string;
  productPrice: number;
  userEmail: string;
  transactionId: string;
};

// recibimos data más generica en esta función
// para abstraer al resto del sistema
// de los detalles de mercado pago
// esto nos permitirá hacer cambios dentro de esta librería
// sin tener que modificar el resto del sistema
export async function createSingleProductPreference(
  options: CreatePrefOptions
) {
  // Todas las opciones en
  // https://www.mercadopago.com.ar/developers/es/reference/preferences/_checkout_preferences/post

  return pref.create({
    body: {
      items: [
        {
          id: options.productId,
          title: options.productName,
          description: options.productDescription,
          quantity: 1,
          currency_id: "ARS",
          unit_price: options.productPrice,
        },
      ],
      payer: {
        email: options.userEmail,
      },
      // URL de redirección en los distintos casos
      back_urls: {
        success: "https://test.com/success",
        failure: "https://test.com/failure",
        pending: "https://test.com/pending",
      },
      // Esto puede ser el id o algún otro identificador
      // que te ayude a vincular este pago con el producto más adelante
      external_reference: options.transactionId,
    },
  });
}

export async function getPaymentById(id: string) {
  const payment = new Payment(client);
  return payment.get({ id });
}

export type WebhokPayload = {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: string;
};
