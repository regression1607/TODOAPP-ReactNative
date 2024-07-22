import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Text, TouchableOpacity, Alert } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../supabaseClient'; // Import Supabase client

type RootStackParamList = {
  TaskList: undefined;
  TaskInput: undefined;
};

type TaskInputScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskInput'>;
type TaskInputScreenRouteProp = RouteProp<RootStackParamList, 'TaskInput'>;

interface TaskInputProps {
  navigation: TaskInputScreenNavigationProp;
  route: TaskInputScreenRouteProp;
}

const TaskInput: React.FC<TaskInputProps> = ({ navigation }) => {
  const [task, setTask] = useState<string>('');
  const [deadline, setDeadline] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    throw new Error('TaskContext must be used within a TaskProvider');
  }

  const { addTask } = taskContext;

  const handleAddTask = async () => {
    const createdAt = new Date();
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ text: task, date: deadline?.toISOString(), createdat: createdAt.toISOString() }]);

    if (error) {
      Alert.alert('Error', 'There was an error adding the task.');
      console.error('Error adding task:', error);
    } else {
      addTask({ text: task, date: deadline, createdat: createdAt });
      navigation.goBack();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(false);
    setDeadline(currentDate);
    if (Platform.OS === 'android' && event.type !== 'dismissed') {
      setShowTimePicker(true); // Show time picker after date is selected
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || deadline;
    setShowTimePicker(false);
    if (currentTime && deadline) {
      const combinedDateTime = new Date(
        deadline.getFullYear(),
        deadline.getMonth(),
        deadline.getDate(),
        currentTime.getHours(),
        currentTime.getMinutes()
      );
      setDeadline(combinedDateTime);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        placeholderTextColor="#888"
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>
          Set Deadline: {deadline ? deadline.toLocaleString() : 'Select Date and Time'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  dateButton: {
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TaskInput;
