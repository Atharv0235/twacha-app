import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/client';
import { prepareImage, makeThumbnail } from '../api/image';

const PROFILE_KEY = 'twacha.profile';
const LAST_KEY = 'twacha.lastScan';
const THUMBS_KEY = 'twacha.thumbs';

function read(key, fallback) {
  try {
    const v = window.localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function write(key, value) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable or full */ }
}
function remove(key) {
  try { window.localStorage.removeItem(key); } catch { /* ignore */ }
}

const Ctx = createContext(null);
export const useAppData = () => useContext(Ctx);

export function AppDataProvider({ children }) {
  // profile: { name, city, consent, keepThumbnails } or null before onboarding
  const [profile, setProfileState] = useState(() => read(PROFILE_KEY, null));
  const [lastScan, setLastScan] = useState(() => read(LAST_KEY, null)); // latest ScanResponse (no photo)
  const [thumbs, setThumbs] = useState(() => read(THUMBS_KEY, {}));     // { [scanId]: dataURL } on this phone only
  const [history, setHistory] = useState(null);                          // HistoryResponse or null
  const [historyError, setHistoryError] = useState(null);
  const [foodLog, setFoodLog] = useState([]);
  const [foodNames, setFoodNames] = useState([]);

  const setProfile = useCallback((p) => { setProfileState(p); write(PROFILE_KEY, p); }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const h = await api.getHistory(60);
      setHistory(h);
      setHistoryError(null);
    } catch (e) {
      setHistoryError(e.message);
    }
  }, []);

  const refreshLog = useCallback(async () => {
    try { setFoodLog(await api.getLog(7)); } catch { /* shown as empty */ }
  }, []);

  const loadFoodNames = useCallback(async () => {
    try { setFoodNames(await api.getFoods()); } catch { /* picker stays empty */ }
  }, []);

  useEffect(() => {
    if (profile?.consent) {
      refreshHistory();
      refreshLog();
      loadFoodNames();
    }
  }, [profile?.consent, refreshHistory, refreshLog, loadFoodNames]);

  /** Runs a scan on a photo Blob. Throws ApiError / Error with a readable message. */
  const runScan = useCallback(async (rawBlob) => {
    const prepared = await prepareImage(rawBlob);
    const result = await api.scan(prepared, profile?.city || undefined);
    setLastScan(result);
    write(LAST_KEY, result);
    if (profile?.keepThumbnails !== false) {
      try {
        const t = await makeThumbnail(prepared);
        setThumbs((prev) => {
          const next = { ...prev, [result.scan.id]: t };
          write(THUMBS_KEY, next);
          return next;
        });
      } catch { /* thumbnail is optional */ }
    }
    refreshHistory();
    return result;
  }, [profile?.city, profile?.keepThumbnails, refreshHistory]);

  const saveFoods = useCallback(async (foods) => {
    const saved = await api.saveLog(foods);
    await refreshLog();
    return saved;
  }, [refreshLog]);

  const clearThumbs = useCallback(() => { setThumbs({}); remove(THUMBS_KEY); }, []);

  /** Deletes server data for this device and everything stored on the phone. */
  const deleteEverything = useCallback(async () => {
    await api.deleteMyData();
    ['twacha.profile', 'twacha.lastScan', 'twacha.thumbs'].forEach(remove);
    setProfileState(null); setLastScan(null); setThumbs({}); setHistory(null); setFoodLog([]);
  }, []);

  const value = useMemo(() => ({
    profile, setProfile, lastScan, thumbs, history, historyError, foodLog, foodNames,
    runScan, saveFoods, refreshHistory, clearThumbs, deleteEverything
  }), [profile, setProfile, lastScan, thumbs, history, historyError, foodLog, foodNames,
    runScan, saveFoods, refreshHistory, clearThumbs, deleteEverything]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
