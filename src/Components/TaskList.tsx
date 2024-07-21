import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { supabase } from '../supabaseClient'; // Import Supabase client

const TaskList: React.FC = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    if (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'There was a problem fetching the tasks.');
    } else {
      setTasks(data || []);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Button title="Add Task" onPress={() => navigation.navigate('TaskInput')} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>{item.text}</Text>
            <Text style={styles.createddateText}>Created At: {new Date(item.createdat).toLocaleString()}</Text>
            {item.date && (
              <Text style={styles.deadlinedateText}>Deadline: {new Date(item.date).toLocaleString()}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskText: {
    fontSize: 18,
    color: 'black',
  },
  createddateText: {
    fontSize: 14,
    color: 'green',
  },
    deadlinedateText: {
        fontSize: 14,
        color: 'red',
    },
});

export default TaskList;
