import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BRICSTimezone {
  country: string;
  timezone: string;
  flag: string;
  utcOffset: string;
  dstObserved: boolean;
}

export const BRICS_TIMEZONES: BRICSTimezone[] = [
  { country: 'Brazil', timezone: 'America/Sao_Paulo', flag: '🇧🇷', utcOffset: 'UTC-3', dstObserved: true },
  { country: 'Russia', timezone: 'Europe/Moscow', flag: '🇷🇺', utcOffset: 'UTC+3', dstObserved: false },
  { country: 'India', timezone: 'Asia/Kolkata', flag: '🇮🇳', utcOffset: 'UTC+5:30', dstObserved: false },
  { country: 'China', timezone: 'Asia/Shanghai', flag: '🇨🇳', utcOffset: 'UTC+8', dstObserved: false },
  { country: 'South Africa', timezone: 'Africa/Johannesburg', flag: '🇿🇦', utcOffset: 'UTC+2', dstObserved: false },
  { country: 'Egypt', timezone: 'Africa/Cairo', flag: '🇪🇬', utcOffset: 'UTC+2', dstObserved: false },
  { country: 'Ethiopia', timezone: 'Africa/Addis_Ababa', flag: '🇪🇹', utcOffset: 'UTC+3', dstObserved: false },
  { country: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪', utcOffset: 'UTC+4', dstObserved: false },
  { country: 'Iran', timezone: 'Asia/Tehran', flag: '🇮🇷', utcOffset: 'UTC+3:30', dstObserved: true },
  { country: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: '🇸🇦', utcOffset: 'UTC+3', dstObserved: false },
  { country: 'France', timezone: 'Europe/Paris', flag: '🇫🇷', utcOffset: 'UTC+1', dstObserved: true },
];

export interface TimezoneContextType {
  userTimezone: string;
  setUserTimezone: (tz: string) => void;
  formatInTimezone: (utcDate: string, timezone?: string) => string;
  formatMatchTime: (utcDate: string, timezone?: string) => MatchTimeDisplay;
  getCurrentTimeInTimezone: (timezone: string) => string;
  toUTC: (localDate: string, timezone: string) => string;
}

export interface MatchTimeDisplay {
  local: string;
  utc: string;
  timezone: string;
  iso8601: string;
  date: string;
  time: string;
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

export const TimezoneProvider = ({ children }: { children: ReactNode }) => {
  const [userTimezone, setUserTimezone] = useState('Africa/Johannesburg');

  const formatInTimezone = (utcDate: string, timezone?: string): string => {
    const tz = timezone || userTimezone;
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date(utcDate));
    } catch {
      return utcDate;
    }
  };

  const formatMatchTime = (utcDate: string, timezone?: string): MatchTimeDisplay => {
    const tz = timezone || userTimezone;
    const date = new Date(utcDate);
    const tzInfo = BRICS_TIMEZONES.find(t => t.timezone === tz);

    const localFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const utcFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return {
      local: localFormatter.format(date) + ' ' + timeFormatter.format(date),
      utc: utcFormatter.format(date) + ' UTC',
      timezone: tzInfo ? `${tzInfo.flag} ${tz.split('/')[1].replace('_', ' ')} (${tzInfo.utcOffset})` : tz,
      iso8601: date.toISOString(),
      date: localFormatter.format(date),
      time: timeFormatter.format(date),
    };
  };

  const getCurrentTimeInTimezone = (timezone: string): string => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  };

  const toUTC = (localDate: string, _timezone: string): string => {
    return new Date(localDate).toISOString();
  };

  return (
    <TimezoneContext.Provider value={{
      userTimezone,
      setUserTimezone,
      formatInTimezone,
      formatMatchTime,
      getCurrentTimeInTimezone,
      toUTC,
    }}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = () => {
  const ctx = useContext(TimezoneContext);
  if (!ctx) throw new Error('useTimezone must be used within TimezoneProvider');
  return ctx;
};
