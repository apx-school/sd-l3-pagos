import express from "express";
import {
  createSingleProductPreference,
  getPaymentById,
  WebhokPayload,
} from "./lib/mercadopago";
import { getProductById } from "./lib/products";
import { confirmPurchase, createPurchase } from "./lib/purchases";
import { getSessionUserByRequest } from "./lib/session";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// también podría ser /checkout/:productId/:priceId
// en el caso de que tengamos varios precios por producto
// (con descuento, sin descuento, etc)

app.get("/checkout/:productId", async (req, res) => {
  const user = await getSessionUserByRequest(req);
  const product = await getProductById(req.params.productId);
  const purchase = await createPurchase({
    productId: product.id,
    userId: user.id,
  });

  try {
    const pref = await createSingleProductPreference({
      productName: product.name,
      productPrice: product.price,
      productId: product.id,
      productDescription: product.description,
      userEmail: user.email,
      transactionId: purchase.id,
    });

    return res.send(pref);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

app.post("/mp/webhook", async (req, res) => {
  const payload = req.body as WebhokPayload;
  if (payload.type === "payment") {
    const mpPayment = await getPaymentById(payload.data.id);
    console.log({ mpPayment });
    if (mpPayment.status === "approved") {
      console.log(`Payment ${mpPayment.id} approved`);
      const purchaseId = mpPayment.external_reference;
      // Con esto salgo a buscar el pago/producto y se lo asigno al usuario
      const result = await confirmPurchase(purchaseId);
      return res.send(result);
    }
  }

  res.send({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
