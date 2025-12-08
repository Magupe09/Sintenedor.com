// app/pedidos/new/route.js

// 1. Definimos la función que maneja la solicitud POST
export async function POST(request) {
    try {
        // 2. Capturamos el cuerpo del pedido enviado desde el frontend
        const pedidoData = await request.json();

        // 3. Definimos la URL de su Webhook de n8n (¡REEMPLAZAR CON SU URL REAL!)
        const N8N_WEBHOOK_URL = "https://magupe94.app.n8n.cloud/webhook-test/5520fbee-8fd5-49ae-9fc5-1cf090e93e5d";

        // 4. Enviamos la solicitud POST a n8n
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // El cuerpo de la solicitud es el objeto JSON del pedido
            body: JSON.stringify(pedidoData),
        });

        // 5. Verificamos la respuesta de n8n (debe ser 200 o 202)
        if (response.ok) {
            // Si n8n responde correctamente, confirmamos al cliente de Next.js
            return new Response(JSON.stringify({
                message: 'Pedido enviado a n8n y en proceso.',
                success: true
            }), {
                status: 202, // 202 Accepted, el pedido fue aceptado para ser procesado
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            // Si n8n da error (ej. 404, 500)
            console.error("Error al enviar a n8n:", response.status, response.statusText);
            return new Response(JSON.stringify({
                message: 'Error interno al procesar el pedido.',
                success: false
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        console.error("Error en la API Route:", error);
        return new Response(JSON.stringify({
            message: 'Error inesperado del servidor.',
            success: false
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}