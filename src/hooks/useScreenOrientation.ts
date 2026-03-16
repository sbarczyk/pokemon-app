import { useEffect, useState } from 'react';
import { getOrientation, addOrientationListener } from '../../modules/screen-orientation';

export function useScreenOrientation() {
  const [orientation, setOrientation] = useState(getOrientation());

  useEffect(() => {
    const subscription = addOrientationListener((event) => {
      setOrientation(event.orientation);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return orientation;
}