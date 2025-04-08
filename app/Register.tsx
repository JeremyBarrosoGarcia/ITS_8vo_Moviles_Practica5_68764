import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { TextInput, Button, Text, Title, Provider as PaperProvider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { MotiView } from 'moti';
import { api } from '../services/api';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

// Tema profesional con colores oscuros y acentos
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2', // Azul profesional
    accent: '#FF6D00', // Naranja de acento
    background: '#121212', // Fondo oscuro
    surface: '#1E1E1E', // Superficie de componentes
    text: '#E0E0E0', // Texto claro
    placeholder: '#757575', // Placeholder
    onSurface: '#FFFFFF', // Sobre superficie
    surfaceVariant: '#2D2D2D', // Variante de superficie
  },
  roundness: 8, // Bordes redondeados
};

export default function RegisterScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!correo || !password || !confirmar) return alert('Todos los campos son obligatorios');
    if (password !== confirmar) return alert('Las contraseñas no coinciden');
    if (!isValidEmail(correo)) return alert('Formato de correo electrónico inválido');
    if (password.length < 8) return alert('La contraseña debe tener al menos 8 caracteres');

    setLoading(true);
    try {
      await api.register(correo, password);
      router.replace('/');
    } catch {
      alert('Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.splitContainer}>
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 700 }}
            style={styles.leftPanel}
          >
            <MaterialIcons name="security" size={90} color="#1976D2" style={styles.icon} />
            <Text variant="headlineMedium" style={styles.brandText}>
              Registro de Cuenta
            </Text>
            <Text variant="bodyMedium" style={styles.brandSub}>
              Crea credenciales seguras para acceder al sistema
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            style={styles.rightPanel}
          >
            <Title style={styles.title}>Información Requerida</Title>

            <TextInput
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="email" />}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                },
              }}
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon icon="eye" />}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                },
              }}
            />

            <TextInput
              label="Confirmar contraseña"
              value={confirmar}
              onChangeText={setConfirmar}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="lock-check" />}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                },
              }}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              icon="account-plus"
            >
              Registrar Cuenta
            </Button>

            <View style={styles.footer}>
              <Text variant="bodyMedium" style={styles.footerText}>
                ¿Ya tienes una cuenta?
              </Text>
              <TouchableOpacity onPress={() => router.replace('/')}>
                <Text variant="bodyMedium" style={styles.footerLink}>
                  Iniciar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  splitContainer: {
    flex: 1,
    flexDirection: width > 600 ? 'row' : 'column',
    padding: 24,
    gap: 40,
  },
  leftPanel: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width > 600 ? '40%' : '100%',
    padding: 20,
  },
  rightPanel: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 32,
    color: theme.colors.text,
    fontWeight: '600',
  },
  input: {
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 16,
    borderRadius: theme.roundness,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
  },
  buttonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  brandText: {
    marginTop: 24,
    marginBottom: 8,
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  brandSub: {
    color: theme.colors.placeholder,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    color: theme.colors.placeholder,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});