import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert , TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { supabase } from '../supabaseClient'; // Import Supabase client
import CalendarScreen  from './CalendarScreen';
import NewsScreen from './NewsScreen';
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

  const toggleTaskCompletion = async (id: number, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .match({ id });

    if (error) {
      Alert.alert('Error', 'There was a problem updating the task.');
      console.error('Error updating task:', error);
    } else {
      fetchTasks(); // Refresh the task list after update
    }
  };

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
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => toggleTaskCompletion(item.id, item.completed)}
            >
              <Text style={styles.toggleButtonText}>
                {item.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
       <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('CalendarScreen')} // Navigate to Calendar screen
        >
          <Text style={styles.footerButtonText}>Go to Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('NewsScreen')} // Navigate to News screen
        >
          <Text style={styles.footerButtonText}>Go to News</Text>
        </TouchableOpacity>
      </View>
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
    toggleButton: {
      marginTop: 8,
      padding: 8,
      backgroundColor: '#007BFF',
      borderRadius: 4,
    },
    toggleButtonText: {
      color: 'white',
      textAlign: 'center',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#f8f8f8',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    footerButton: {
      flex: 1,
      marginHorizontal: 4,
      padding: 12,
      backgroundColor: '#007BFF',
      borderRadius: 4,
      alignItems: 'center',
    },
    footerButtonText: {
      color: 'white',
      fontSize: 16,
    },
});

export default TaskList;
