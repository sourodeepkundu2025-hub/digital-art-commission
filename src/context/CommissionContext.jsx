import React, { createContext, useContext, useReducer, useCallback } from "react";
import { commissionAPI } from "../utils/api";

// ─── State ─────────────────────────────────────────────────────────────────────
const initialState = {
  commission: null,
  meta: null,
  searchInput: { commission_id: "", client_id: "" },
  loading: false,
  error: null,
  updateSuccess: false,
  updateResult: null,
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_COMMISSION":
      return { ...state, loading: false, commission: action.payload.commission, meta: action.payload.meta, error: null };
    case "SET_SEARCH_INPUT":
      return { ...state, searchInput: { ...state.searchInput, ...action.payload } };
    case "SET_UPDATE_SUCCESS":
      return { ...state, loading: false, updateSuccess: true, updateResult: action.payload, commission: action.payload.commission, error: null };
    case "RESET":
      return initialState;
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────
const CommissionContext = createContext(null);

export function CommissionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const searchCommission = useCallback(async (commission_id, client_id) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data } = await commissionAPI.search(commission_id, client_id);
      dispatch({ type: "SET_COMMISSION", payload: data.data });
      return { success: true, data: data.data };
    } catch (err) {
      const error = err.response?.data?.error || { message: "Network error. Please try again." };
      dispatch({ type: "SET_ERROR", payload: error });
      return { success: false, error };
    }
  }, []);

  const updateCommission = useCallback(async (commission_id, client_id, updates) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data } = await commissionAPI.update(commission_id, client_id, updates);
      dispatch({ type: "SET_UPDATE_SUCCESS", payload: data.data });
      return { success: true, data: data.data };
    } catch (err) {
      const error = err.response?.data?.error || { message: "Update failed. Please try again." };
      dispatch({ type: "SET_ERROR", payload: error });
      return { success: false, error };
    }
  }, []);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);
  const setSearchInput = useCallback((vals) =>
    dispatch({ type: "SET_SEARCH_INPUT", payload: vals }), []);

  return (
    <CommissionContext.Provider value={{
      ...state,
      searchCommission,
      updateCommission,
      reset,
      clearError,
      setSearchInput,
    }}>
      {children}
    </CommissionContext.Provider>
  );
}

export const useCommission = () => {
  const ctx = useContext(CommissionContext);
  if (!ctx) throw new Error("useCommission must be used within CommissionProvider");
  return ctx;
};
