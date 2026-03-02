// Market Hours Calculator - NO API needed, calculated from UTC time

export interface MarketStatus {
  isOpen: boolean;
  currentSession: string;
  nextOpenTime: string | null;
  sessions: {
    sydney: { isOpen: boolean; openTime: string; closeTime: string };
    tokyo: { isOpen: boolean; openTime: string; closeTime: string };
    london: { isOpen: boolean; openTime: string; closeTime: string };
    newyork: { isOpen: boolean; openTime: string; closeTime: string };
  };
}

// Forex market hours in UTC
const SESSION_TIMES = {
  sydney: { open: 22, close: 7 },   // 22:00 - 07:00 UTC
  tokyo: { open: 0, close: 9 },      // 00:00 - 09:00 UTC
  london: { open: 8, close: 17 },    // 08:00 - 17:00 UTC
  newyork: { open: 13, close: 22 }   // 13:00 - 22:00 UTC
};

function isSessionOpen(session: { open: number; close: number }, hour: number, day: number): boolean {
  if (session.close > session.open) {
    // Session doesn't cross midnight
    return hour >= session.open && hour < session.close;
  } else {
    // Session crosses midnight (e.g., Sydney)
    return hour >= session.open || hour < session.close;
  }
}

function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00 UTC`;
}

function getNextOpenTime(session: { open: number; close: number }, currentHour: number, currentDay: number): string {
  if (session.open > currentHour) {
    return `Opens at ${formatTime(session.open)} today`;
  } else if (currentDay === 5 && currentHour >= 22) {
    // Friday after close - opens Sunday
    return 'Opens Sunday at 22:00 UTC';
  } else if (currentDay === 0 && currentHour < 22) {
    // Sunday before open
    return `Opens today at ${formatTime(22)}`;
  } else if (currentDay === 6) {
    // Saturday
    return 'Opens Sunday at 22:00 UTC';
  } else {
    return `Opens tomorrow at ${formatTime(session.open)}`;
  }
}

export function getMarketStatus(): MarketStatus {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getUTCHours();
  
  // Forex market is closed on Saturday and Sunday before 22:00 UTC
  const isSaturday = day === 6;
  const isSundayBeforeOpen = day === 0 && hour < 22;
  const isFridayAfterClose = day === 5 && hour >= 22;
  
  const isMarketClosed = isSaturday || isSundayBeforeOpen || isFridayAfterClose;
  
  // Check each session
  const sydneyOpen = isSessionOpen(SESSION_TIMES.sydney, hour, day);
  const tokyoOpen = isSessionOpen(SESSION_TIMES.tokyo, hour, day);
  const londonOpen = isSessionOpen(SESSION_TIMES.london, hour, day);
  const newyorkOpen = isSessionOpen(SESSION_TIMES.newyork, hour, day);
  
  // Determine current active session
  let currentSession = 'Closed';
  if (londonOpen && newyorkOpen) {
    currentSession = 'London & New York Overlap';
  } else if (londonOpen) {
    currentSession = 'London Session';
  } else if (newyorkOpen) {
    currentSession = 'New York Session';
  } else if (tokyoOpen && sydneyOpen) {
    currentSession = 'Tokyo & Sydney Overlap';
  } else if (tokyoOpen) {
    currentSession = 'Tokyo Session';
  } else if (sydneyOpen) {
    currentSession = 'Sydney Session';
  }
  
  // Calculate next open time if market is closed
  let nextOpenTime: string | null = null;
  if (isMarketClosed) {
    if (isSaturday) {
      nextOpenTime = 'Opens Sunday at 22:00 UTC';
    } else if (isSundayBeforeOpen) {
      nextOpenTime = `Opens today at ${formatTime(22)}`;
    } else if (isFridayAfterClose) {
      nextOpenTime = 'Opens Sunday at 22:00 UTC';
    }
  }
  
  return {
    isOpen: !isMarketClosed,
    currentSession,
    nextOpenTime,
    sessions: {
      sydney: {
        isOpen: sydneyOpen,
        openTime: formatTime(SESSION_TIMES.sydney.open),
        closeTime: formatTime(SESSION_TIMES.sydney.close)
      },
      tokyo: {
        isOpen: tokyoOpen,
        openTime: formatTime(SESSION_TIMES.tokyo.open),
        closeTime: formatTime(SESSION_TIMES.tokyo.close)
      },
      london: {
        isOpen: londonOpen,
        openTime: formatTime(SESSION_TIMES.london.open),
        closeTime: formatTime(SESSION_TIMES.london.close)
      },
      newyork: {
        isOpen: newyorkOpen,
        openTime: formatTime(SESSION_TIMES.newyork.open),
        closeTime: formatTime(SESSION_TIMES.newyork.close)
      }
    }
  };
}

export function getSessionColor(session: string): string {
  switch (session) {
    case 'Sydney Session':
      return '#00ff88';
    case 'Tokyo Session':
      return '#ff00ff';
    case 'London Session':
      return '#00ffff';
    case 'New York Session':
      return '#ffff00';
    case 'London & New York Overlap':
      return '#ff8800';
    case 'Tokyo & Sydney Overlap':
      return '#88ff00';
    default:
      return '#888888';
  }
}
