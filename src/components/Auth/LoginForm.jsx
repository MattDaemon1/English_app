import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import { getThemeClasses } from '../../themes/index.js';

export const LoginForm = ({ theme, onClose }) => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Effacer l'erreur quand l'utilisateur tape
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await login(formData.username.trim(), formData.password);

            if (result.success) {
                // La connexion est gérée automatiquement par le hook
                if (onClose) onClose();
            } else {
                setError(result.error || 'Erreur lors de la connexion');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setError('Erreur technique lors de la connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await login('admin', 'admin123');

            if (result.success) {
                if (onClose) onClose();
            } else {
                setError(result.error || 'Erreur lors de la connexion démo');
            }
        } catch (error) {
            console.error('Erreur de connexion démo:', error);
            setError('Erreur technique lors de la connexion démo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className={`w-full max-w-md ${theme.cardBackground} shadow-2xl animate-fadeIn`}>
                <CardHeader className="text-center pb-6">
                    <CardTitle className={`text-2xl font-bold ${theme.text} mb-2`}>
                        🔐 Connexion
                    </CardTitle>
                    <p className={`${theme.textSecondary} text-sm`}>
                        Connectez-vous à votre compte EnglishMaster
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {error && (
                        <div className={`p-3 rounded-lg ${theme.error} text-sm font-medium animate-fadeIn`}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nom d'utilisateur */}
                        <div>
                            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                                👤 Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full ${getThemeClasses(theme, 'input')}`}
                                placeholder="Votre nom d'utilisateur"
                                disabled={loading}
                                autoComplete="username"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                                🔑 Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full ${getThemeClasses(theme, 'input')} pr-12`}
                                    placeholder="Votre mot de passe"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textSecondary} hover:${theme.text} transition-colors`}
                                    disabled={loading}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Boutons */}
                        <div className="space-y-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full ${getThemeClasses(theme, 'button-primary-solid')} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Connexion...
                                    </span>
                                ) : (
                                    '🚀 Se connecter'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleDemoLogin}
                                disabled={loading}
                                className={`w-full ${getThemeClasses(theme, 'button-secondary')} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                🎭 Connexion démo (Admin)
                            </button>
                        </div>
                    </form>

                    {/* Informations de connexion */}
                    <div className={`p-3 rounded-lg ${theme.cardSecondary} text-xs ${theme.textSecondary} space-y-1`}>
                        <div className="font-medium text-center mb-2">💡 Informations de connexion par défaut :</div>
                        <div><strong>Admin :</strong> admin / admin123</div>
                        <div className="text-center mt-2 text-orange-600">
                            ⚠️ Changez le mot de passe après la première connexion
                        </div>
                    </div>

                    {/* Bouton fermer */}
                    <div className="flex justify-center pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-6 py-2 ${theme.textSecondary} hover:${theme.text} transition-colors text-sm`}
                            disabled={loading}
                        >
                            ❌ Annuler
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
