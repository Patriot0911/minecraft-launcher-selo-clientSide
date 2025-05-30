import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import Window from "./components/Window";
import AuthService from "./scripts/client/services/auth.service";
import { store } from "./store";
import { useAppDispatch } from "./store/hooks";
import { fetchUserDataThunk } from "./store/thunks/authThunk";
import "./styles/auth.global.scss";

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      if (AuthService.getInstance().isAuthenticated()) {
        try {
          await dispatch(fetchUserDataThunk()).unwrap();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <Window />;
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <Provider store={store}>
    <AppContent />
  </Provider>
);
