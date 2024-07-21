import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskList from '../src/Components/TaskList';
import TaskInput from '../src/Components/TaskInput';
import { TaskProvider } from '../src/context/TaskContext';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TaskList">
          <Stack.Screen name="TaskList" component={TaskList} />
          <Stack.Screen name="TaskInput" component={TaskInput} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
};

export default App;
