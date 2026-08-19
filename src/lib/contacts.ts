/** Единая точка правды по контактам: все заявки с сайта уходят в WhatsApp Сухраба. */

export const WHATSAPP_NUMBER = '971507584835'
export const PHONE_DISPLAY = '+971 50 758 48 35'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

/** Ссылка на чат с предзаполненным текстом. */
export function buildWhatsAppLink(text?: string) {
  return text ? `${WHATSAPP_URL}?text=${encodeURIComponent(text)}` : WHATSAPP_URL
}
