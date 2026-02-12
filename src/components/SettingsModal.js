import { useEffect } from "react";
import "./GenericModal.css";
import { useTranslation } from "react-i18next";

const SettingsModal = ({ handleSaveSettings, setShowModal, settings, setSettings }) => {
    const { t } = useTranslation();
    const closeModal = () => {
        // Make settings be equal to localStorage settings in case it was modified but not saved
        if (localStorage.settings !== JSON.stringify(settings)) setSettings(JSON.parse(localStorage.settings));
        setShowModal(false);
    }

    useEffect(() => {
        if (localStorage.settings == null || localStorage.settings == undefined)
            setSettings(settings => { return {...settings, language: "en"} })
    }, [])

    return <div className="modal-backdrop">
        <div className="modal">
            <h2>{t("settings.title")}</h2>
            <label className="modal-field">
                {t("settings.language") + " 🌐"}
                <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                >
                    <option value="ca">🇨🇦 Català</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                </select>
            </label>
            <div className="modal-buttons">
                <button
                    onClick={() => {
                        handleSaveSettings();
                        closeModal();
                    }}
                >
                    {t("generic.save")}
                </button>
                <button onClick={() => closeModal()}>{t("generic.cancel")}</button>
            </div>
        </div>
    </div>;
}

export default SettingsModal;