import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
    count: number;
    activeIndex: number;
}

const PaginationDots = ({ count, activeIndex }: Props) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: count }).map((_, index) => (
                <View 
                    key={index}
                    style={[
                        styles.dot,
                        index === activeIndex ? styles.activeDot : styles.inactiveDot,
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        position: 'absolute', bottom: 35, right: 35, 
        flexDirection: 'row', zIndex: 10 
    },
    dot: { position: 'absolute', top: 12, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: '#FFF' },
    activeDot: { width: 18, backgroundColor: '#FFFFFF' },
    inactiveDot: { width: 8 },
});

export default PaginationDots;