/* eslint-disable @typescript-eslint/ban-ts-comment */
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import { AdminCallbackPage } from "./pages/Admin/Callback";
import { CreateNote } from "./pages/Create/Note";
import { EditItem } from "./pages/Edit/Item";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { FindOrCreate } from "./pages/FindOrCreate/FindOrCreate";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { Main } from "./pages/Main";
import { query } from "./utils/query";
import { Suspense } from "react";
import { ViewItem } from "./pages/View/Item";
import { QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import LoginPage from "./pages/Login";
import LoadingPage from "./pages/Loading";

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={query}>
        <Suspense fallback={<LoadingSpinner />}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                <Routes>
                  <Route path="/">
                    <Route index element={<LoadingPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="admin">
                      <Route path="callback" element={<AdminCallbackPage />} />
                    </Route>
                    <Route path="create">
                      <Route path="note/:itemId" element={<CreateNote />} />
                    </Route>
                    <Route path="edit">
                      <Route path="item/:itemId" element={<EditItem />} />
                    </Route>
                    <Route path="/findOrCreate" element={<FindOrCreate />} />
                    <Route path="/home" element={<Main />} />
                    <Route path="view">
                      <Route path="item/:itemId" element={<ViewItem />} />
                    </Route>
                  </Route>
                </Routes>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Suspense>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
