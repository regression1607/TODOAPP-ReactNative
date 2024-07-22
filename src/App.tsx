import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskList from '../src/Components/TaskList';
import TaskInput from '../src/Components/TaskInput';
import { TaskProvider } from '../src/context/TaskContext';
import CalendarScreen from './Components/CalendarScreen';
import NewsScreen from './Components/NewsScreen';
const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TaskList">
          <Stack.Screen name="TaskList" component={TaskList} />
          <Stack.Screen name="TaskInput" component={TaskInput} />
          <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
          <Stack.Screen name="NewsScreen" component={NewsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
};

export default App;
