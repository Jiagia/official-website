import {useMatches} from '@remix-run/react';
import {useMemo} from 'react';
export function usePageAnalytics() {
  const matches = useMatches();

  const analyticsFromMatches = useMemo(() => {
    const data = {};

    matches.forEach((event) => {
      const eventData = event?.data;
      if (eventData) {
        eventData['analytics'] && Object.assign(data, eventData['analytics']);
      }
    });

    return data;
  }, [matches]);

  return analyticsFromMatches;
}