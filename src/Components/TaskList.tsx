import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { supabase } from '../supabaseClient'; // Import Supabase client

const TaskList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    if (error) {
      console.error('Error fetching tasks:', error);
      Alert.alert('Error', 'There was a problem fetching the tasks.');
    } else {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

      // Filter tasks created today
      const filteredTasks = data?.filter((task: any) => {
        const taskDate = new Date(task.createdat);
        return taskDate >= startOfDay && taskDate <= endOfDay;
      }) || [];

      setTasks(filteredTasks);
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
      <Button
        title="Add Task"
        onPress={() => navigation.navigate('TaskInput')}
        color="#007BFF"
      />
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Alien 🐿️ Please create your today's task</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <Text style={styles.taskText}>{item.text}</Text>
              <Text style={styles.createdDateText}>Created At: {new Date(item.createdat).toLocaleString()}</Text>
              {item.date && (
                <Text style={styles.deadlineDateText}>Deadline: {new Date(item.date).toLocaleString()}</Text>
              )}
              <TouchableOpacity
                style={[styles.toggleButton, item.completed && styles.toggleButtonCompleted]}
                onPress={() => toggleTaskCompletion(item.id, item.completed)}
              >
                <Text style={styles.toggleButtonText}>
                  {item.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('CalendarScreen')}
        >
          <Text style={styles.footerButtonText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('NewsScreen')}
        >
          <Text style={styles.footerButtonText}>News</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  taskContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  taskText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  createdDateText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  deadlineDateText: {
    fontSize: 14,
    color: '#d9534f', // red color for deadline
    marginTop: 4,
  },
  toggleButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  toggleButtonCompleted: {
    backgroundColor: '#28a745', // green for completed
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 70, // Ensure there's space for footer
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TaskList;
