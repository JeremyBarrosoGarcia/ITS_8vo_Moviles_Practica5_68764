import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { TextInput, Button, Text, Title, Provider as PaperProvider } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { MotiView } from 'moti';
import { api } from '../services/api';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

// Definimos un tema personalizado para react-native-paper
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: '#ffffff',
    primary: '#ffffff',
    onSurface: '#ffffff',
    placeholder: '#cccccc',
    background: 'transparent',
    surface: 'transparent', // Fondo de los componentes como TextInput
    surfaceVariant: 'transparent', // Fondo en estado no enfocado
  },
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
    if (password !== confirmar) return alert('Las contraseñas no son iguales');
    if (!isValidEmail(correo)) return alert('formato Correo electrónico no inválido');
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
            <FontAwesome5 name="user-shield" size={80} color="#ffffff" />
            <Text style={styles.brandText}>Crea tu cuenta</Text>
            <Text style={styles.brandSub}>Regístrate para agragar notas</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            style={styles.rightPanel}
          >
            <Title style={styles.title}>Ingresa tus datos</Title>

            <TextInput
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              textColor="#ffffff"
              underlineColor="#ffffff" // Línea inferior blanca
              theme={{
                colors: {
                  primary: '#ffffff',
                  placeholder: '#cccccc',
                  background: 'transparent',
                  surface: 'transparent', // Fondo transparente
                  surfaceVariant: 'transparent', // Fondo en estado no enfocado
                },
              }}
              placeholderTextColor="#cccccc"
            />
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              textColor="#ffffff"
              underlineColor="#ffffff" // Línea inferior blanca
              theme={{
                colors: {
                  primary: '#ffffff',
                  placeholder: '#cccccc',
                  background: 'transparent',
                  surface: 'transparent',
                  surfaceVariant: 'transparent',
                },
              }}
              placeholderTextColor="#cccccc"
            />
            <TextInput
              label="Confirmar contraseña"
              value={confirmar}
              onChangeText={setConfirmar}
              secureTextEntry
              style={styles.input}
              textColor="#ffffff"
              underlineColor="#ffffff" // Línea inferior blanca
              theme={{
                colors: {
                  primary: '#ffffff',
                  placeholder: '#cccccc',
                  background: 'transparent',
                  surface: 'transparent',
                  surfaceVariant: 'transparent',
                },
              }}
              placeholderTextColor="#cccccc"
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              theme={{
                colors: {
                  primary: '#6200ee',
                },
              }}
            >
              Crear cuenta
            </Button>

            <TouchableOpacity onPress={() => router.replace('/')}>
              <Text style={styles.link}>
                <Text>¿Ya tienes cuenta? </Text>
                <Text style={styles.linkBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000080',
    paddingTop: 50,
  },
  splitContainer: {
    flex: 1,
    flexDirection: width > 600 ? 'row' : 'column',
    padding: 20,
    gap: 30,
  },
  leftPanel: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: width > 600 ? 0 : 20,
    width: width > 600 ? '35%' : '100%',
  },
  rightPanel: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#ffffff',
  },
  input: {
    marginBottom: 14,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#ffffff',
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    color: '#ffffff',
  },
  brandSub: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
    color: '#ffffff',
  },
});