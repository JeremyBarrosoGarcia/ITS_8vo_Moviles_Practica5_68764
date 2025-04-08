import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import useNotes from '../hooks/useNotes';

const theme = {
  colors: {
    primary: '#1976D2',
    accent: '#FF6D00',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#E0E0E0',
    placeholder: '#757575',
    error: '#CF6679',
  }
};

export default function NotesListScreen() {
  const router = useRouter();
  const { notes, isLoading, error, deleteNote, loadNotes } = useNotes();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const handleEditNote = (noteId: number) => {
    router.push(`/create-note?id=${noteId}`);
  };

  const handleDeleteNote = async (noteId: number) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que deseas eliminar esta nota permanentemente?',
      [
        { 
          text: 'Cancelar', 
          style: 'cancel',
        },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un problema al eliminar la nota');
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerText}>
          Mis Notas
        </Text>
        <Text variant="bodyMedium" style={styles.subHeaderText}>
          {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
        </Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="note-add" size={64} color={theme.colors.placeholder} />
            <Text style={styles.emptyText}>No hay notas creadas</Text>
            <Text style={styles.emptySubText}>Presiona el botón + para crear una nueva</Text>
          </View>
        ) : (
          notes.map(note => (
            <Card key={note.id} style={styles.card} mode="elevated">
              <Card.Title
                title={note.titulo}
                titleNumberOfLines={1}
                titleStyle={styles.cardTitle}
                subtitle={`Última actualización`}
                subtitleStyle={styles.cardSubtitle}
                right={() => (
                  <View style={styles.cardStatus}>
                    <MaterialIcons 
                      name={note.important ? "star" : "star-border"} 
                      size={24} 
                      color={note.important ? theme.colors.accent : theme.colors.placeholder} 
                    />
                  </View>
                )}
              />
              <Card.Content>
                <Text 
                  numberOfLines={3} 
                  ellipsizeMode="tail"
                  style={styles.cardContent}
                >
                  {note.descripcion.replace(/<[^>]*>/g, '')}
                </Text>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <IconButton
                  icon="pencil"
                  size={22}
                  iconColor={theme.colors.primary}
                  onPress={() => handleEditNote(note.id)}
                  style={styles.actionButton}
                />
                <IconButton
                  icon="delete"
                  size={22}
                  iconColor={theme.colors.error}
                  onPress={() => handleDeleteNote(note.id)}
                  style={styles.actionButton}
                />
                <View style={styles.spacer} />
                <Text style={styles.dateText}>
                  {new Date(note.fecha).toLocaleDateString()}
                </Text>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/create-note')}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  headerText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  subHeaderText: {
    color: theme.colors.placeholder,
    marginTop: 4,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardTitle: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 18,
  },
  cardSubtitle: {
    color: theme.colors.placeholder,
    fontSize: 12,
  },
  cardContent: {
    color: theme.colors.text,
    opacity: 0.9,
    lineHeight: 22,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
  },
  cardStatus: {
    paddingRight: 16,
  },
  actionButton: {
    margin: 0,
  },
  spacer: {
    flex: 1,
  },
  dateText: {
    color: theme.colors.placeholder,
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: theme.colors.text,
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  emptySubText: {
    color: theme.colors.placeholder,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '70%',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});