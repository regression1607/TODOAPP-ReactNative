import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TaskItemProps {
  task: {
    text: string;
    date?: Date;
    createdAt: Date;
  };
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const hasDeadline = !!task.date;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, hasDeadline && styles.deadlineText]}>{task.text}</Text>
      <Text style={styles.dateText}>
        Created At: {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString()}
      </Text>
      {hasDeadline && (
        <Text style={styles.dateText}>
          Deadline: {new Date(task.date).toLocaleDateString()} {new Date(task.date).toLocaleTimeString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  deadlineText: {
    color: 'red',
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default TaskItem;
