import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- CONFIGURATION ---
BASE_URL = "http://localhost:5175" 
ADMIN_EMAIL = "admin@yancarz.com"
ADMIN_PASS = "password123"

def run_e2e_scenario():
    driver = webdriver.Chrome()
    driver.maximize_window()
    wait = WebDriverWait(driver, 15)

    try:
        print("\n=== DÉBUT DU SCÉNARIO END-TO-END (PARCOURS UTILISATEUR) ===")

        # --- ÉTAPE 1 : ARRIVÉE ET CONNEXION ---
        print("1. Connexion à l'espace Agence...")
        driver.get(f"{BASE_URL}/login")
        wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys(ADMIN_EMAIL)
        driver.find_element(By.NAME, "password").send_keys(ADMIN_PASS)
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # --- ÉTAPE 2 : VÉRIFICATION DU TABLEAU DE BORD ---
        wait.until(EC.url_contains("/dashboard"))
        print("2. Analyse des indicateurs sur le Dashboard...")
        # Vérifier si les cartes de statistiques sont chargées
        kpi_cards = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "kpi-card")))
        print(f"   📊 {len(kpi_cards)} indicateurs de performance affichés.")

        # --- ÉTAPE 3 : GESTION DE LA FLOTTE (RECHERCHE ET DÉTAILS) ---
        print("3. Consultation de la flotte de véhicules...")
        driver.get(f"{BASE_URL}/vehicles")
        # Recherche d'un modèle précis
        search_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='Rechercher']")))
        search_input.send_keys("Toyota")
        time.sleep(1)
        
        # Ouvrir les détails via la nouvelle icône loupe (Détails)
        view_btn = driver.find_element(By.CSS_SELECTOR, "button[title='Voir détails']")
        view_btn.click()
        
        # Vérifier que le modal de détails s'affiche bien
        modal_title = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "modal-title")))
        print(f"   🚗 Détails du véhicule consultés : {modal_title.text}")
        driver.find_element(By.XPATH, "//button[text()='Fermer']").click()

        # --- ÉTAPE 4 : SUIVI CLIENTÈLE (HISTORIQUE) ---
        print("4. Vérification de l'historique d'un client...")
        driver.get(f"{BASE_URL}/clients")
        # On déplie la ligne d'un client pour voir ses réservations
        first_client_row = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "tr.clickable")))
        first_client_row.click()
        
        history_section = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "section-title")))
        print(f"   👥 Historique client déployé : {history_section.text}")

        # --- ÉTAPE 5 : FACTURATION (CONSULTATION) ---
        print("5. Revue de la facturation en cours...")
        driver.get(f"{BASE_URL}/billing")
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "data-table")))
        print("   💳 Liste des factures chargée avec succès.")

        # --- ÉTAPE 6 : FIN DE SESSION ---
        print("6. Déconnexion sécurisée...")
        driver.find_element(By.CLASS_NAME, "topbar__avatar-btn").click()
        wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "topbar__dropdown-item.danger"))).click()
        
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, "auth-container")))
        print("✅ SCÉNARIO E2E TERMINÉ : Le parcours utilisateur est fluide.")

    except Exception as e:
        print(f"❌ ÉCHEC DU SCÉNARIO E2E : {e}")
        driver.save_screenshot("e2e_error.png")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_e2e_scenario()