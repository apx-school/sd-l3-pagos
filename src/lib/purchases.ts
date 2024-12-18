export async function createPurchase({ productId, userId }) {
  // Esto debería guardar en la DB que el user ${userId}
  // inició un proceso de pago para el producto ${productId}
  // esto queda pendiente hasta que MP nos avise

  return {
    id: "64ac28bc-2365-4fd0-95ba-b4f053756cd9",
  };
}

export function confirmPurchase(purchaseId: string) {
  // acá tendríamos que ir a la DB a cambiar el estatus del pago a "confirmed" (o algo así)
  // esto se ocupa solo del purchase, no del mail ni nada de eso
  // Todo lo que tiene que ver con asignar el producto mandar el mail, etc
  // lo tiene que atender el endpoint o un controller en su defecto
  console.log(`Purchase ${purchaseId} confirmed`);
  return true;
}
