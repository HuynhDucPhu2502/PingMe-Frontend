import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./features/store";
import { ScrollArea } from "./components/ui/scroll-area";
import { Toaster } from "./components/ui/sonner";
import { setupAxiosInterceptors } from "./lib/axiosClient";

function App() {
  setupAxiosInterceptors(store.dispatch);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ScrollArea className="min-h-screen">
          <RouterProvider router={router}></RouterProvider>
        </ScrollArea>
        <Toaster duration={3000} closeButton position="top-center" />
      </PersistGate>
    </Provider>
  );
}

export default App;
