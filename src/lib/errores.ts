/**
 * Mensajes seguros para mostrar cuando falla la capa de datos.
 *
 * Los errores técnicos (direcciones, códigos SQL, nombres de servicios)
 * nunca se muestran en pantalla: solo se traducen a texto comprensible.
 */
const MENSAJES = {
  guardar:
    'No pudimos guardar tus cambios en este momento. Revisa tu conexión e inténtalo de nuevo en unos minutos.',
  cargar:
    'No pudimos cargar la información en este momento. Inténtalo de nuevo en unos minutos.',
  subir:
    'No pudimos subir la imagen. Revisa tu conexión e inténtalo de nuevo.',
  ingresar:
    'No pudimos completar el ingreso en este momento. Inténtalo de nuevo en unos minutos.',
} as const;

export type Accion = keyof typeof MENSAJES;

export function mensajeSeguro(accion: Accion = 'guardar'): string {
  return MENSAJES[accion];
}
