import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CourseListScreen from '../screens/CourseListScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import CourseFormScreen from '../screens/CourseFormScreen';
import CategoryManagerScreen from '../screens/CategoryManagerScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CourseList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#0F172A',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#F8FAFC',
          },
        }}
      >
        <Stack.Screen
          name="CourseList"
          component={CourseListScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{
            title: 'Chi tiết khóa học',
            headerStyle: {
              backgroundColor: '#0F172A',
            },
            headerTintColor: '#FFFFFF',
          }}
        />

        <Stack.Screen
          name="CourseForm"
          component={CourseFormScreen}
          options={({ route }) => ({
            title: route.params?.courseId ? 'Sửa khóa học' : 'Thêm khóa học mới',
          })}
        />

        <Stack.Screen
          name="CategoryManager"
          component={CategoryManagerScreen}
          options={{
            title: 'Quản lý danh mục',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
