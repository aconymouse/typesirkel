// API keys live in the operating system's own credential store: Keychain on
// macOS, Credential Manager on Windows, Secret Service on Linux. The web layer
// never writes them to disk itself.

use keyring::{Entry, Error};

const SERVICE: &str = "com.aconymous.typesirkel";

fn entry(name: &str) -> Result<Entry, String> {
    Entry::new(SERVICE, name).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn keep_secret(name: String, value: String) -> Result<(), String> {
    entry(&name)?.set_password(&value).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn read_secret(name: String) -> Result<Option<String>, String> {
    match entry(&name)?.get_password() {
        Ok(value) => Ok(Some(value)),
        Err(Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn forget_secret(name: String) -> Result<(), String> {
    match entry(&name)?.delete_credential() {
        Ok(()) | Err(Error::NoEntry) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}
