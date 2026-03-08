import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173"

def run_bug_hunting():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)
    
    try:
        print("\n=== RECHERCHE APPROFONDIE DE BUGS (LOGIQUE MÉTIER) ===")
        
        # CONNEXION
        driver.get(f"{BASE_URL}/login")
        driver.find_element(By.NAME, "email").send_keys("admin@yancarz.com")
        driver.find_element(By.NAME, "password").send_keys("password123")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        wait.until(EC.url_contains("/dashboard"))

        # --- NAVIGATION VERS VÉHICULES ---
        driver.get(f"{BASE_URL}/vehicles")
        
        # --- BUG 1 : PRIX NÉGATIF ---
        print("\n[TEST 1] Vérification des montants négatifs...")
        btn_add = wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(., 'Ajouter')]")))
        driver.execute_script("arguments[0].click();", btn_add)
        
        wait.until(EC.visibility_of_element_located((By.NAME, "brand"))).send_keys("BUG_TEST")
        driver.find_element(By.NAME, "model").send_keys("PRIX_NEGATIF")
        driver.find_element(By.NAME, "price").clear()
        driver.find_element(By.NAME, "price").send_keys("-500") # BUG ICI
        driver.find_element(By.XPATH, "//button[text()='Ajouter']").click()
        
        time.sleep(1)
        if "-500" in driver.page_source:
            print("❌ BUG DÉTECTÉ : L'application accepte les prix négatifs !")
        else:
            print("✅ OK : Prix négatif refusé.")

        # --- BUG 2 : ANNÉE DANS LE FUTUR (Celui d'hier) ---
        print("\n[TEST 2] Vérification de la cohérence des dates (Année 2099)...")
        driver.execute_script("arguments[0].click();", btn_add) # On rouvre le modal
        wait.until(EC.visibility_of_element_located((By.NAME, "brand"))).clear()
        driver.find_element(By.NAME, "brand").send_keys("BUG_TEST")
        driver.find_element(By.NAME, "model").send_keys("DATE_FUTUR")
        driver.find_element(By.NAME, "year").clear()
        driver.find_element(By.NAME, "year").send_keys("2099") # BUG ICI
        driver.find_element(By.XPATH, "//button[text()='Ajouter']").click()
        
        time.sleep(1)
        if "2099" in driver.page_source:
            print("❌ BUG DÉTECTÉ : L'application accepte l'année 2099 !")
        else:
            print("✅ OK : Année future refusée.")

        # --- BUG 3 : RECHERCHE ROBUSTE (Caractères spéciaux) ---
        print("\n[TEST 3] Vérification de la robustesse de la recherche...")
        search = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='Rechercher']")
        search.clear()
        search_term = "';-- <script>alert(1)</script>" # Caractères "dangereux"
        search.send_keys(search_term)
        
        time.sleep(1)
        # On vérifie si l'application est toujours vivante (pas d'écran blanc)
        if len(driver.find_elements(By.TAG_NAME, "table")) > 0:
            print("✅ OK : La recherche gère bien les caractères spéciaux.")
        else:
            print("⚠️ ATTENTION : La recherche a fait disparaître l'interface.")

        # --- BUG 4 : SÉCURITÉ URL ---
        print("\n[TEST 4] Vérification de la sécurité d'accès direct...")
        # 1. On se déconnecte
        driver.find_element(By.CLASS_NAME, "topbar__avatar-btn").click()
        wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "topbar__dropdown-item.danger"))).click()
        # 2. On tente d'accéder à la page véhicules par l'URL
        driver.get(f"{BASE_URL}/vehicles")
        time.sleep(1)
        if "/login" in driver.current_url:
            print("✅ OK : L'accès non-autorisé est bien bloqué.")
        else:
            print("❌ BUG CRITIQUE : Accès possible sans être connecté !")

    except Exception as e:
        print(f"❌ ERREUR SCRIPT : {e}")
    finally:
        print("\n--- FIN DE LA SESSION DE TEST ---")
        driver.quit()

if __name__ == "__main__":
    run_bug_hunting()