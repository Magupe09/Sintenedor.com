export async function POST(req) {
    try {
        const body = await req.json();

        // Enviar datos a n8n
        const n8nResponse = await fetch("http://localhost:5678/webhook/pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await n8nResponse.json();

        return Response.json({
            ok: true,
            message: "Pedido enviado a n8n correctamente.",
            n8n: data,
        });
    } catch (error) {
        return Response.json(
            { ok: false, error: "Error al enviar pedido a n8n" },
            { status: 500 }
        );
    }
}
