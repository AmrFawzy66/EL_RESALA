import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getStoredUser, clearSession, setOnSessionExpired } from '../api/client.js';

const ShiftContext = createContext(null);

/**
 * Tracks the currently logged-in user and their open cash-register
 * shift. Every module that touches the cash drawer (POS checkout,
 * repair advances, wallet cash-in/out) reads shiftId from here so all
 * cash movements roll up correctly into the end-of-day Z-report.
 *
 * Unlike the desktop app (which always started fresh), a web page can
 * be refreshed or closed and reopened at any time — so the logged-in
 * user is restored from localStorage on load instead of being lost.
 * The open shift itself is intentionally NOT persisted client-side:
 * it's re-fetched from the server truth on demand instead, so a
 * refresh never shows stale/incorrect shift state.
 */
export function ShiftProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(getStoredUser);
  const [shift, setShift] = useState(null); // { shiftId, startFloat, openedAt }

  useEffect(() => {
    setOnSessionExpired(() => {
      setCurrentUserState(null);
      setShift(null);
    });
  }, []);

  const setCurrentUser = useCallback((user) => {
    setCurrentUserState(user);
    if (!user) {
      clearSession();
      setShift(null);
    }
  }, []);

  const openShift = useCallback(async (startFloat) => {
    if (!currentUser) throw new Error('لا يوجد مستخدم مسجل الدخول');
    const res = await api.shifts.open(currentUser.id, startFloat);
    if (res.ok) {
      setShift({ shiftId: res.shiftId, startFloat, openedAt: new Date().toISOString() });
    }
    return res;
  }, [currentUser]);

  const closeShift = useCallback(async (endCounted) => {
    if (!shift) throw new Error('لا توجد وردية مفتوحة');
    const res = await api.shifts.close(shift.shiftId, currentUser.id, endCounted);
    if (res.ok) setShift(null);
    return res;
  }, [shift, currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    shift,
    isShiftOpen: Boolean(shift),
    openShift,
    closeShift,
  };

  return <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>;
}

export function useShift() {
  const ctx = useContext(ShiftContext);
  if (!ctx) throw new Error('useShift must be used within a ShiftProvider');
  return ctx;
}
