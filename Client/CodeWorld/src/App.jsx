import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ReviewResult from './pages/ReviewResult';
import History from './pages/History';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute><Home /></PrivateRoute>
                    } />
                    <Route path="/editor" element={
                        <PrivateRoute><Dashboard /></PrivateRoute>
                    } />
                    <Route path="/result" element={
                        <PrivateRoute><ReviewResult /></PrivateRoute>
                    } />
                    <Route path="/history" element={
                        <PrivateRoute><History /></PrivateRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;