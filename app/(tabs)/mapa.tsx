import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTareas } from '../../context/TareasContext';

export default function MapaScreen() {
  const { tareas } = useTareas();
  const tareasConUbicacion = tareas.filter(
  (t) =>
    t.ubicacion &&
    typeof t.ubicacion.latitud === 'number' &&
    typeof t.ubicacion.longitud === 'number'
);

if (tareasConUbicacion.length === 0) {
  return (
    <View style={styles.center}>
      <Text style={styles.emptyText}>No hay tareas con ubicación para mostrar</Text>
    </View>
  );
}

const primeraUbicacion = tareasConUbicacion[0].ubicacion!;

return (
  <View style={styles.container}>
    <MapView
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: primeraUbicacion.latitud,
        longitude: primeraUbicacion.longitud,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {tareasConUbicacion.map((tarea) => {
        const u = tarea.ubicacion!;
        return (
          <Marker
            key={tarea.id}
            coordinate={{ latitude: u.latitud, longitude: u.longitud }}
            title={tarea.titulo}
            description={tarea.descripcion}
            pinColor={tarea.completada ? 'green' : 'red'}
          />
        );
      })}
    </MapView>
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b0b0b',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
  },
});
