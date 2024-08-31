import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const UserData = ({ navigation }: { navigation: any }) => {
    const couponsUsed = 8;
    const totalCoupons = 12;
    const screenWidth = Dimensions.get("window").width;

    const barData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99]
            }
        ]
    };

    const pieData = [
        { name: "Diner", population: 20, color: "#f00", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Sandwich", population: 20, color: "#0f0", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Pizza", population: 10, color: "#00f", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Asian", population: 10, color: "#ff0", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Veggie", population: 10, color: "#0ff", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Café", population: 10, color: "#f0f", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Spicy", population: 10, color: "#800", legendFontColor: "#7F7F7F", legendFontSize: 15 },
        { name: "Drink", population: 10, color: "#088", legendFontColor: "#7F7F7F", legendFontSize: 15 }
    ];

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    <Text style={styles.header}>Data Overview</Text>
                    <View style={styles.dataBlock}>
                        <Text style={styles.subHeader}>Coupons Used This Month:</Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: `${(couponsUsed / totalCoupons) * 100}%` }]} />
                        </View>
                        <Text style={styles.value}>
                            {couponsUsed} out of <Text style={{ fontWeight: 'bold' }}>{totalCoupons}</Text>
                        </Text>
                    </View>
                    <View style={styles.dataBlock}>
                        <BarChart
                            data={barData}
                            width={screenWidth - 40}
                            height={220}
                            yAxisLabel=""
                            chartConfig={chartConfig}
                            verticalLabelRotation={30}
                        />
                    </View>
                    <View style={styles.dataBlock}>
                        <Text style={styles.subHeader}>Category Distribution (Pie Chart)</Text>
                        <PieChart
                            data={pieData}
                            width={screenWidth - 40}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            absolute
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#121212',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    dataBlock: {
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 18,
        color: '#FF6347',
        marginBottom: 10,
    },
    value: {
        fontSize: 16,
        color: '#BBBBBB',
        marginBottom: 10,
    },
    progressBarContainer: {
        height: 20,
        width: '100%',
        backgroundColor: '#ddd',
        borderRadius: 10,
        marginBottom: 5,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#c65102',
        borderRadius: 10,
    },
});

export default UserData;