import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@/components/TabBar';

const TabLayout = () => {
  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen name='index' options={{ title: "Dashboard", headerShown: false }} />
      <Tabs.Screen name='graphs' options={{ title: "Graphs", headerShown: false }} />
      <Tabs.Screen name='heatMap' options={{ title: "Map", headerShown: false }} />
      <Tabs.Screen name='addExpense' options={{ title: "Add Expense", headerShown: false }} />
    </Tabs>
  );
}

export default TabLayout;
