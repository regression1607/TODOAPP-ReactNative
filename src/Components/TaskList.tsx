import React, { useContext } from 'react';
import { View, Button, FlatList, StyleSheet } from 'react-native';
import { TaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  TaskList: undefined;
  TaskInput: undefined;
};

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;
type TaskListScreenRouteProp = RouteProp<RootStackParamList, 'TaskList'>;

interface TaskListProps {
  navigation: TaskListScreenNavigationProp;
  route: TaskListScreenRouteProp;
}

const TaskList: React.FC<TaskListProps> = ({ navigation }) => {
  const taskContext = useContext(TaskContext);

  if (!taskContext) {
    throw new Error('TaskContext must be used within a TaskProvider');
  }

  const { tasks } = taskContext;

  return (
    <View style={styles.container}>
      <Button title="Add Task" onPress={() => navigation.navigate('TaskInput')} />
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <TaskItem task={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default TaskList;
