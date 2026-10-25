// The Rust side stays small on purpose. Reading and writing files, picking
// folders, opening links and talking to AI providers are handled by Tauri's
// own plugins; everything that feels like the app lives in the web layer, so
// the browser build and the desktop build never drift apart.

mod vault;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![vault::keep_secret, vault::read_secret, vault::forget_secret])
        .run(tauri::generate_context!())
        .expect("typeSirkel could not open its window");
}
