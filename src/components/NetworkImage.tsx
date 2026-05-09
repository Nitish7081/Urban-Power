import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, ImageProps, ImageStyle, StyleProp, ViewStyle, Animated } from 'react-native';
import { Colors } from '../constants/Theme';

interface NetworkImageProps extends Omit<ImageProps, 'style'> {
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showLoader?: boolean;
}

export const NetworkImage: React.FC<NetworkImageProps> = ({ 
  source, 
  style, 
  containerStyle, 
  showLoader = false,
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Placeholder / Loading State */}
      {(loading || error) && (
        <View style={[styles.placeholder, style]}>
          {showLoader && !error && (
            <ActivityIndicator size="small" color={Colors.light.primary} />
          )}
          {error && (
             <View style={styles.errorContainer}>
               <View style={styles.emptyCircle} />
             </View>
          )}
        </View>
      )}

      {/* Actual Image */}
      {!error && (
        <Image
          {...props}
          source={source}
          style={[
            style,
            loading ? styles.hiddenImage : styles.visibleImage
          ]}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  hiddenImage: {
    opacity: 0,
  },
  visibleImage: {
    opacity: 1,
  },
  errorContainer: {
    opacity: 0.3,
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.textMuted,
  }
});
