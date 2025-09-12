# 🚨 SOLUCIÓN INMEDIATA - Error de Registro

## ❌ Error Encontrado
```
ERROR: 42703: column "user_id" does not exist
```

## ✅ Solución Paso a Paso

### **Paso 1: Ejecutar Script Básico (URGENTE)**

1. Ve a tu proyecto Supabase → **SQL Editor**
2. Abre el archivo `supabase-setup-basic.sql`
3. **Copia TODO el contenido y pégalo**
4. **Ejecuta el script completo**

Este script creará:
- ✅ Tabla `profiles`
- ✅ Tabla `wallets`  
- ✅ Tabla `coin_transactions`
- ✅ Triggers automáticos
- ✅ Políticas RLS básicas

### **Paso 2: Desactivar Confirmación de Email**

1. En Supabase Dashboard → **Authentication** → **Settings**
2. Busca **"Enable email confirmations"**
3. **Ponlo en OFF** (desactivar)
4. **Guarda los cambios**

### **Paso 3: Probar Registro**

1. Ejecuta tu app: `npm start`
2. Intenta registrar un nuevo usuario
3. Debería funcionar sin errores

## 🔧 Qué Hace el Script

**Funciones Automáticas:**
```sql
auth.users INSERT → profiles INSERT → wallets INSERT + coins
```

**Cuando un usuario se registra:**
1. Se crea automáticamente su perfil en `profiles`
2. Se crea automáticamente su wallet con 50 coins
3. Se registra la transacción de bienvenida

## 📞 Si Sigue Fallando

Si aún hay errores después del script:

1. **Verifica que las tablas se crearon:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Verifica que los triggers existen:**
   ```sql
   SELECT trigger_name FROM information_schema.triggers 
   WHERE event_object_schema = 'public';
   ```

3. **Verifica las políticas RLS:**
   ```sql
   SELECT schemaname, tablename, policyname 
   FROM pg_policies WHERE schemaname = 'public';
   ```

## ⚡ Script Completo (Para Después)

Una vez que el registro funcione, puedes ejecutar `supabase-setup.sql` para agregar todas las tablas adicionales (businesses, videos, etc.).

El problema era que intentábamos crear triggers para tablas que no existían aún. Ahora el script crea las tablas primero, luego los triggers.