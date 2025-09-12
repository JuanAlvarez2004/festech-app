# 🔧 Configuración de Supabase para Festech

## 📧 Desactivar Confirmación de Email

Para que el registro funcione sin confirmación de email, sigue estos pasos:

### Opción 1: Configuración Rápida en Dashboard
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication** → **Settings**
3. En la sección **"Email Confirmation"**:
   - Desactiva **"Enable email confirmations"**
4. Guarda los cambios

### Opción 2: Configuración por SQL (Alternativa)
Si prefieres usar SQL, ejecuta en el SQL Editor:

```sql
-- Desactivar confirmación de email
UPDATE auth.config 
SET value = 'false' 
WHERE parameter = 'email_confirm_change_enabled';

UPDATE auth.config 
SET value = 'false' 
WHERE parameter = 'email_autoconfirm';
```

## 🎯 Configuración RLS (Row Level Security)

Asegúrate de que las siguientes políticas estén configuradas:

### Tabla `profiles`
```sql
-- Política para leer perfiles
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Política para actualizar perfiles
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Política para insertar perfiles
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);
```

### Tabla `wallets`
```sql
-- Política para crear wallet automáticamente
CREATE POLICY "Users can manage own wallet" ON wallets
FOR ALL USING (auth.uid() = user_id);
```

## 🪙 Trigger de Wallet Automático

Para crear automáticamente la wallet al registrarse:

```sql
-- Función para crear wallet
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type, phone, interests)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'phone',
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'interests')),
      '{}'::text[]
    )
  );
  
  -- Crear wallet con 50 coins de bienvenida
  INSERT INTO public.wallets (user_id, balance)
  VALUES (new.id, 50);
  
  -- Registrar transacción de bienvenida
  INSERT INTO public.coin_transactions (user_id, type, amount, description)
  VALUES (new.id, 'earn', 50, 'Coins de bienvenida');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 📱 Variables de Entorno

Asegúrate de tener estas variables en tu `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## 🧪 Datos de Prueba

Para probar el registro, puedes usar estos datos de ejemplo:

**Cliente:**
- Email: `cliente@test.com`
- Password: `test123`
- Nombre: `Juan Cliente`
- Tipo: `client`
- Intereses: `["gastronomia", "cultura"]`

**Negocio:**
- Email: `negocio@test.com`
- Password: `test123`
- Nombre: `Restaurante Demo`
- Tipo: `business`
- Intereses: `["gastronomia", "hospedaje"]`

## 🔍 Solución de Problemas

### Error: "User already registered"
- Verifica que el email no exista en `auth.users`
- Si existe pero no está confirmado, elimínalo desde el dashboard

### Error: "Cannot coerce the result to a single JSON object"
- Esto indica problema en la función `getUserProfile`
- Verifica que la consulta retorne un solo registro
- Asegúrate de que el perfil exista en la tabla `profiles`

### Error de RLS
- Verifica que las políticas estén habilitadas
- Usa `auth.uid()` en lugar de `current_user` en las políticas
- Asegúrate de que RLS esté habilitado en todas las tablas

## ✅ Verificación

Para verificar que todo está configurado correctamente:

1. **Registro:** Debería funcionar sin confirmación de email
2. **Perfil:** Se debe crear automáticamente en `profiles`
3. **Wallet:** Se debe crear con 50 coins
4. **Transacción:** Se debe registrar la transacción de bienvenida

Si todos estos pasos funcionan, la configuración está completa.