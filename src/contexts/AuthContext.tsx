"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "official" | "passenger";

export interface UserProfile {
  id: string;
  name: string;
  nameMl: string;
  role: UserRole;
  designation?: string;
  depot?: string;
  employeeId?: string; // PEN (Permanent Employee Number) for KSRTC Staff
  phone?: string;
  email?: string;
  preferredRoute?: string;
  badge?: string;
}

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  official: {
    id: "ksrtc-emp-4092",
    name: "Soman K.",
    nameMl: "സോമൻ കെ.",
    role: "official",
    designation: "Station Master / Depot Inspector",
    depot: "Thampanoor Central Depot (Trivandrum)",
    employeeId: "KSRTC-PEN-4092",
    phone: "+91 94470 14092",
    email: "soman.k@ksrtc.kerala.gov.in",
    badge: "Official Inspector",
  },
  passenger: {
    id: "passenger-commuter-782",
    name: "Anjali Nair",
    nameMl: "അഞ്ജലി നായർ",
    role: "passenger",
    designation: "Daily KSRTC Commuter",
    preferredRoute: "Ernakulam ⇄ Thrissur (Fast Passenger)",
    phone: "+91 98470 56789",
    email: "anjali.nair@keralamail.in",
    badge: "Regular Commuter",
  },
};

interface AuthContextType {
  role: UserRole;
  user: UserProfile;
  isAuthenticated: boolean;
  loginAs: (role: UserRole, customProfile?: Partial<UserProfile>) => void;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("official");
  const [user, setUser] = useState<UserProfile>(DEMO_PROFILES.official);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("anavandi_auth_session");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.role && DEMO_PROFILES[parsed.role as UserRole]) {
            setRole(parsed.role as UserRole);
            setUser({ ...DEMO_PROFILES[parsed.role as UserRole], ...(parsed.user || {}) });
            setIsAuthenticated(true);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not read auth session from storage:", err);
      }
    }
  }, []);

  const saveSession = (newRole: UserRole, newUser: UserProfile) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "anavandi_auth_session",
          JSON.stringify({ role: newRole, user: newUser })
        );
      } catch (err) {
        console.warn("Could not persist auth session:", err);
      }
    }
  };

  const loginAs = (targetRole: UserRole, customProfile?: Partial<UserProfile>) => {
    const base = DEMO_PROFILES[targetRole];
    const updated: UserProfile = { ...base, ...(customProfile || {}), role: targetRole };
    setRole(targetRole);
    setUser(updated);
    setIsAuthenticated(true);
    saveSession(targetRole, updated);
  };

  const switchRole = (newRole: UserRole) => {
    const updated = DEMO_PROFILES[newRole];
    setRole(newRole);
    setUser(updated);
    setIsAuthenticated(true);
    saveSession(newRole, updated);
  };

  const logout = () => {
    // Switch to passenger guest mode
    const guestUser: UserProfile = {
      id: "guest-user",
      name: "Guest Passenger",
      nameMl: "യാത്രക്കാരൻ",
      role: "passenger",
      designation: "Guest Traveler",
      badge: "Guest",
    };
    setRole("passenger");
    setUser(guestUser);
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("anavandi_auth_session");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAuthenticated,
        loginAs,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
