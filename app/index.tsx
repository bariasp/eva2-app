import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { router } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
  if (!email || !password) {
    setError('Debes ingresar email y contraseña');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    await login(email.trim(), password);
    router.replace("/(tabs)");
  } catch (e: any) {
    setError(e.message || 'Error al iniciar sesión');
  } finally {
    setLoading(false);
  }
};
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '600', marginBottom: 24 }}>
        Iniciar Sesión
      </Text>

      {/* EMAIL */}
      <Text style={{ marginBottom: 6 }}>Correo electrónico</Text>
      <TextInput
        placeholder="ej: felipe@test.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#333',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      />

      {/* PASSWORD */}
      <Text style={{ marginBottom: 6 }}>Contraseña</Text>
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: '#333',
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
        }}
      />

      {/* ERROR */}
      {error && (
        <Text style={{ color: 'red', marginBottom: 12 }}>
          {error}
        </Text>
      )}

      {/* BOTÓN */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: '#1e90ff',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16 }}>
            Entrar
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
