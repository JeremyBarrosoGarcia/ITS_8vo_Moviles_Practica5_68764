import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card, Text, Title } from 'react-native-paper';
import { useRouter, Stack } from 'expo-router';
import { MotiView } from 'moti';
import { api } from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!correo || !password) {
      return alert('Todos los campos son obligatorios');
    }

    if (!isValidEmail(correo)) {
      return alert('Correo electrónico inválido');
    }

    setLoading(true);
    try {
      await api.login(correo, password);
      router.replace('/inicio');
    } catch (error) {
      alert('Usuario o contraseña incorrecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.background}>
        <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
          >
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>Iniciar Sesión</Title>
                <Text style={styles.subtitle}>Accede a tus notas con seguridad</Text>

                <TextInput
                  label="Correo electrónico"
                  value={correo}
                  onChangeText={setCorreo}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  theme={{ colors: { primary: '#FFD700', text: '#F5F5F5' } }}
                  underlineColor="#FFD700"
                />
                <TextInput
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                  theme={{ colors: { primary: '#FFD700', text: '#F5F5F5' } }}
                  underlineColor="#FFD700"
                />

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                  labelStyle={styles.buttonLabel}
                >
                  Iniciar Sesión
                </Button>

                <TouchableOpacity onPress={() => router.replace('/Register')}>
                  <Text style={styles.link}>
                    ¿No tienes cuenta?{' '}
                    <Text style={styles.linkBold}>Regístrate</Text>
                  </Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </MotiView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1A1A1A', // Dark charcoal background
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#2A2A2A', // Slightly lighter dark shade for the card
    borderRadius: 8, // Sharper corners for a modern look
    elevation: 8, // Subtle shadow for depth
    padding: 24,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F5F5', // Soft white for contrast
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0', // Muted gray for subtitle
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '400',
  },
  input: {
    backgroundColor: 'transparent', // Minimalist input background
    marginVertical: 12,
    color: '#F5F5F5',
  },
  button: {
    backgroundColor: '#FFD700', // Gold accent for masculinity and elegance
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 24,
    elevation: 4, // Slight elevation for a "pop" effect
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A', // Dark text for contrast on gold button
    textTransform: 'uppercase',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: 14,
  },
  linkBold: {
    color: '#FFD700', // Gold for the actionable part
    fontWeight: '600',
  },
});