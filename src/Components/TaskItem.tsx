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
    padding: 15,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  deadlineText: {
    color: '#d9534f', // red color for deadline
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default TaskItem;
