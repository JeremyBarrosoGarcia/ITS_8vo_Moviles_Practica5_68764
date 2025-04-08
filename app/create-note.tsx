import CustomRichEditor from '@/components/CustomRichEditor';
import useNotes from '@/hooks/useNotes';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export default function CreateNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  const richText = useRef<CustomRichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);

  const { notes, saveNote, updateNote } = useNotes();

  useEffect(() => {
    if (id) {
      const noteId = Number(id);
      const noteToEdit = notes.find(note => note.id === noteId);
      if (noteToEdit) {
        console.log('Nota a editar:', noteToEdit.descripcion);
        setTitle(noteToEdit.titulo);
        setContent(noteToEdit.descripcion);
        setCompleted(noteToEdit.completada);
        richText.current?.setContentHTML(noteToEdit.descripcion);
      }
    }
  }, [id, notes]);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor ingresa un título para la nota');
      return;
    }

    try {
      if (id) {
        await updateNote(Number(id), {
          titulo: title,
          descripcion: content,
          completada: completed,
        });
      } else {
        await saveNote({
          titulo: title.trim(),
          descripcion: content,
          completada: completed,
        });
      }
      router.back();
    } catch (error) {
      alert('Error al guardar la nota');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        nestedScrollEnabled={false}
      >
        <TextInput
          style={styles.titleInput}
          placeholder="Título de la nota"
          placeholderTextColor="#B0B0B0"
          value={title}
          onChangeText={setTitle}
        />

        <CustomRichEditor
          ref={richText}
          style={styles.editor}
          initialContentHTML={content}
          onChange={setContent}
          placeholder="Escribe el contenido de tu nota aquí..."
          useContainer={true}
        />

        <RichToolbar
          editor={richText}
          selectedIconTint="#FFD700" // Gold for selected icons
          iconTint="#F5F5F5" // White for unselected icons
          scalesPageToFit={Platform.OS === 'android'}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.setStrikethrough,
            actions.blockquote,
            actions.alignLeft,
            actions.alignCenter,
            actions.alignRight,
            actions.undo,
            actions.redo,
          ]}
          style={styles.toolbar}
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleSave()}
      >
        <MaterialIcons name="save" size={28} color="#1A1A1A" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // Dark charcoal background
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F5F5F5', // Soft white for text
    marginVertical: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700', // Gold underline for elegance
    letterSpacing: 0.5,
  },
  editor: {
    flex: 1,
    minHeight: 320,
    backgroundColor: '#2A2A2A', // Darker editor background
    borderWidth: 1,
    borderColor: '#3A3A3A', // Subtle border
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#F5F5F5', // White text inside editor
  },
  toolbar: {
    backgroundColor: '#2A2A2A', // Matches editor for consistency
    borderColor: '#3A3A3A',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 80, // Extra space for FAB
    paddingVertical: 4,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#FFD700', // Gold for a premium touch
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Stronger shadow for depth
  },
});