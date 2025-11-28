import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string
    subject: string
    html: string
}) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'ReadyMart'}" <${process.env.SMTP_FROM_EMAIL}>`,
            to,
            subject,
            html,
        })
        console.log('Message sent: %s', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}

export const getOrderConfirmationTemplate = (order: any) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #ea580c;">Order Confirmation</h1>
            <p>Hi ${order.user.name || 'Customer'},</p>
            <p>Thank you for your order! We've received it and will begin processing it shortly.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0;">Order #${order.orderNumber}</h2>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${Number(order.totalAmount).toFixed(2)}</p>
                <p><strong>Status:</strong> ${order.status}</p>
            </div>

            <h3>Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${order.items.map((item: any) => `
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 10px 0;">${item.product.name}</td>
                        <td style="padding: 10px 0;">x${item.quantity}</td>
                        <td style="padding: 10px 0; text-align: right;">$${Number(item.price).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </table>

            <p style="margin-top: 30px;">
                You can track your order status in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders">account dashboard</a>.
            </p>

            <p>Best regards,<br>The ReadyMart Team</p>
        </div>
    `
}
