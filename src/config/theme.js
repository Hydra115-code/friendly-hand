// src/config/theme.js

export const colors = {
  // --- FONDOS OSCUROS (Deep Space) ---
  background: '#0F172A', // Azul muy oscuro (Casi negro)
  surface: '#1E293B',    // Azul grisáceo (Para tarjetas)
  
  // --- MARCA (Neón / Vibrante) ---
  primary: '#6366F1',    // Indigo Neón (Botones principales)
  secondary: '#EC4899',  // Rosa (Detalles)
  tertiary: '#10B981',   // Verde Esmeralda (Éxito)

  // --- ESTADOS ---
  success: '#10B981',    // Verde brillante
  warning: '#F59E0B',    // Ambar
  error: '#EF4444',      // Rojo suave
  info: '#38BDF8',       // Azul cielo

  // --- TEXTOS (Modo Oscuro) ---
  textPrimary: '#FFFFFF',   // Blanco Puro (Para leer sobre oscuro)
  textSecondary: '#94A3B8', // Gris Espacial (Subtítulos)
  textLight: '#64748B',     // Gris más oscuro (Detalles menores)
  
  // --- BORDES ---
  border: '#334155',        // Borde sutil para tarjetas oscuras
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const shadows = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Más fuerte para que se note en oscuro
    shadowRadius: 4,
    elevation: 4,
  },
  medium: {
    shadowColor: "#6366F1", // Sombra con color primario (Glow)
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const typography = {
  header: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5, color: colors.textPrimary },
  subHeader: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 16, lineHeight: 24, color: colors.textSecondary },
  caption: { fontSize: 12, color: colors.textLight },
};