import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- CONFIGURATION (PORT 5175) ---
BASE_URL = "http://localhost:5175" 
ADMIN_EMAIL = "admin@yancarz.com"
ADMIN_PASS = "password123"

def run_unit_tests():
    driver = webdriver.Chrome()
    driver.maximize_window()
    wait = WebDriverWait(driver, 20) # On augmente à 20 secondes pour l'API
    
    try:
        print("\n=== [UNITAIRE] VALIDATION DES COMPOSANTS (V3) ===")
        driver.get(f"{BASE_URL}/login")

        # 1. Vérifier si on est sur la bonne page
        wait.until(EC.presence_of_element_located((By.NAME, "email")))
        print("✅ Unitaire : Page de Login accessible.")

        # 2. Tentative de Connexion
        print("   Tentative de connexion...")
        driver.find_element(By.NAME, "email").send_keys(ADMIN_EMAIL)
        driver.find_element(By.NAME, "password").send_keys(ADMIN_PASS)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # --- VÉRIFICATION DU LOGIN ---
        try:
            # On attend soit la Sidebar, soit une alerte d'erreur
            element = wait.until(EC.presence_of_element_located((By.XPATH, "//nav | //div[contains(@class, 'alert')]")))
            
            if "alert" in element.get_attribute("class"):
                print(f"❌ ERREUR MÉTIER : Le login a échoué avec le message : {element.text}")
                return # On arrête le test ici pour ne pas attendre dans le vide
            else:
                print("✅ Unitaire : Connexion réussie, Dashboard chargé.")
        except:
            print("❌ TIMEOUT : Le Dashboard n'a pas chargé après 20s.")
            driver.save_screenshot("timeout_dashboard.png")
            return

        # 3. Test du Tableau (si login réussi)
        driver.get(f"{BASE_URL}/vehicles")
        print("   Vérification du tableau des véhicules...")
        # On attend que le spinner de chargement disparaisse
        time.sleep(3) 
        
        header_text = wait.until(EC.presence_of_element_located((By.TAG_NAME, "thead"))).text.upper()
        assert "PRIX" in header_text
        print("✅ Unitaire : Structure du tableau validée.")

    except Exception as e:
        print(f"❌ ÉCHEC TECHNIQUE : {e}")
        driver.save_screenshot("crash_debug.png")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_unit_tests()