from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

BASE_URL = "http://localhost:5173" # Ajustez le port si nécessaire

def run_unit_tests():
    driver = webdriver.Chrome()
    wait = WebDriverWait(driver, 10)
    
    try:
        print("\n=== DÉBUT DES TESTS UNITAIRES (COMPOSANTS) ===")
        driver.get(f"{BASE_URL}/login")

        # 1. Unitaire : Formulaire de Login
        email_label = driver.find_element(By.XPATH, "//label[contains(text(), 'Adresse Email')]")
        assert email_label.is_displayed(), "Le label Email est manquant"
        print("✅ Unitaire : Label Email présent.")

        # 2. Login pour accéder aux autres composants
        driver.find_element(By.NAME, "email").send_keys("admin@yancarz.com")
        driver.find_element(By.NAME, "password").send_keys("password123")
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # 3. Unitaire : Sidebar (Labels du menu)
        wait.until(EC.presence_of_element_located((By.XPATH, "//span[text()='Véhicules']")))
        menu_items = ["Tableau de bord", "Véhicules", "Réservations", "Clients", "Paiements"]
        for item in menu_items:
            element = driver.find_element(By.XPATH, f"//span[text()='{item}']")
            assert element.is_displayed(), f"Menu {item} manquant"
        print(f"✅ Unitaire : Les {len(menu_items)} éléments de navigation sont corrects.")

        # Remplacez la partie TEST 4 par celle-ci dans test_unitaires_agency.py
       # 4. Unitaire : Tableaux (Vérification des colonnes)
        driver.get(f"{BASE_URL}/vehicles")
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))
        header_text = driver.find_element(By.TAG_NAME, "thead").text.upper() # On met tout en MAJUSCULES
        
        print(f"   Vérification des colonnes dans : {header_text}")
        assert "PRIX/JOUR" in header_text, "Colonne PRIX manquante"
        assert "KM" in header_text, "Colonne KM manquante"
        print("✅ Unitaire : Colonnes 'PRIX/JOUR' et 'KM' validées.")
        # 5. Unitaire : Badges CSS
        badge = driver.find_element(By.CLASS_NAME, "badge")
        color = badge.value_of_css_property("background-color")
        print(f"✅ Unitaire : Style du badge détecté (Couleur: {color}).")

    except Exception as e:
        print(f"❌ ÉCHEC UNITAIRE : {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_unit_tests()