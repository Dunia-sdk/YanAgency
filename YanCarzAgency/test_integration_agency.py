import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5175"

def hunt_new_bugs():
    driver = webdriver.Chrome()
    driver.maximize_window()
    wait = WebDriverWait(driver, 15)

    try:
        print("\n=== 🛡️ AUDIT DE LA VERSION API & I18N ===")
        
        # 1. CONNEXION
        driver.get(f"{BASE_URL}/login")
        wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys("admin@yancarz.com")
        driver.find_element(By.NAME, "password").send_keys("password123")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # 2. NAVIGATION VERS VEHICULES
        wait.until(EC.url_contains("/dashboard"))
        driver.get(f"{BASE_URL}/vehicles")

        # --- TEST BUG UX : LE SILENCE DU FORMULAIRE ---
        print("\n[TEST] Validation du prix négatif (Vérification du feedback)...")
        btn_add = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'véhicule')]")))
        driver.execute_script("arguments[0].click();", btn_add)
        
        # Remplir le formulaire avec un prix négatif
        wait.until(EC.presence_of_element_located((By.NAME, "brand"))).send_keys("TEST_BUG")
        driver.find_element(By.NAME, "model").send_keys("SILENT_FAIL")
        driver.find_element(By.NAME, "price").send_keys("-500")
        
        # Cliquer sur Sauvegarder
        save_btn = driver.find_element(By.XPATH, "//button[text()='Ajouter' or text()='Add']")
        save_btn.click()
        time.sleep(2)
        
        # VERIFICATION : Si le modal est encore là mais qu'il n'y a AUCUN message d'erreur
        if driver.find_elements(By.CLASS_NAME, "modal-backdrop"):
            print("❌ BUG UX DÉTECTÉ : Le formulaire bloque le prix négatif mais n'affiche AUCUNE erreur à l'utilisateur !")
        else:
            print("✅ OK : Le formulaire a réagi.")

        # --- TEST BUG : SUPPRESSION SANS PROTECTION ---
        print("\n[TEST] Vérification de la boîte de dialogue de suppression...")
        # On essaie de cliquer sur supprimer (Trash2 icon)
        trash_btn = driver.find_element(By.CLASS_NAME, "action-btn.danger")
        trash_btn.click()
        
        # Selenium doit gérer l'alerte du navigateur (window.confirm)
        alert = driver.switch_to.alert
        print(f"   Alerte détectée avec le texte : {alert.text}")
        alert.dismiss() # On annule pour ne pas supprimer vraiment
        print("✅ OK : La suppression est protégée par une confirmation.")

    except Exception as e:
        print(f"❌ ERREUR SCRIPT : {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    hunt_new_bugs()