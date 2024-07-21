import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  const handleAddTask = () => {
    if (task) {
      const createdAt = new Date(); // Get the current date and time
      addTask({ text: task, date: deadline, createdAt });
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
        style={[styles.input, { color: 'black' }]}
        placeholder="Enter task"
        placeholderTextColor="gray"
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
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
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 12,
  },
});

export default TaskInput;
