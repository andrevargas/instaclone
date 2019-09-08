import React from 'react';
import { Animated, Easing } from 'react-native';

import { Small, Original, Loading } from './styles';

const AnimatedOriginal = Animated.createAnimatedComponent(Original);

export default function LazyImage({
  source,
  smallSource,
  aspectRatio,
  shouldLoad = false,
}) {
  const opacity = new Animated.Value(0);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (shouldLoad) {
      setTimeout(() => setLoaded(true), 1000);
    }
  }, [shouldLoad]);

  function handleAnimated() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Small
      source={smallSource}
      aspect={aspectRatio}
      resizeMode="contain"
      blurRadius={2}>
      {loaded && (
        <AnimatedOriginal
          style={{ opacity }}
          source={source}
          aspect={aspectRatio}
          resizeMode="contain"
          onLoadEnd={handleAnimated}
        />
      )}
      {!loaded && <Loading />}
    </Small>
  );
}
