import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useTareas } from '../../context/TareasContext';

export default function TareasScreen() {
  const {
    tareas,
    loading,
    fetchTareas,
    eliminarTarea,
    completarTarea,
  } = useTareas();

  useEffect(() => {
    fetchTareas();
  }, []);

  const handleEliminar = (id: string) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Seguro que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => eliminarTarea(id) },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.item}>
      <Text
        style={[
          styles.titulo,
          item.completed && styles.tituloCompletado,
        ]}
      >
        {item.titulo}
      </Text>

      {item.descripcion ? (
        <Text style={styles.descripcion}>{item.descripcion}</Text>
      ) : null}

      <View style={styles.actions}>
        {!item.completed && (
          <TouchableOpacity onPress={() => completarTarea(item.id)}>
            <Text style={styles.completeText}>Completar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handleEliminar(item.id)}>
          <Text style={styles.deleteText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }

  if (!loading && tareas.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No hay tareas aún</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/crear-tarea')}
        >
          <Text style={styles.addText}>Crear tarea</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/crear-tarea')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0b0b',
  },
  loadingText: {
    marginTop: 10,
    color: '#aaa',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  titulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  tituloCompletado: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  descripcion: {
    color: '#aaa',
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  completeText: {
    color: '#4caf50',
    fontWeight: '600',
  },
  deleteText: {
    color: '#ff5c5c',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addText: {
    color: '#fff',
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1e90ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
});
