# Site pédagogique — Lycée Marie Rivier

Christophe Delcourt — 2026–2027

## Version 5

Cette version ajoute :
- une nouvelle zone d'accueil cohérente avec les 3 espaces :
  - Seconde SNT
  - Première STI2D
  - Terminale STI2D / SIN
- la transformation du dossier PDF « Numération et codage de l'information » en véritable cours Web ;
- 9 chapitres repliables ;
- diagnostic de début de séquence ;
- tableaux et fiches méthodes ;
- outils interactifs :
  - conversion décimal → binaire / hexadécimal,
  - calcul de l'étendue sur n bits,
  - codage ASCII ;
- quiz d'auto-évaluation ;
- accès au PDF original depuis la page Web.

## Fichier principal ajouté

`classes/terminale-numeration.html`

## Déploiement GitHub Pages

Dépôt :
`chrdelcourt-ops.github.io`

Décompresser le ZIP de mise à jour et téléverser les fichiers en conservant les dossiers.


## Version 6 — Référencement Google

Ajouts :
- titres SEO et meta descriptions uniques ;
- balises canonical ;
- directives robots page par page ;
- Open Graph et Twitter Card ;
- données structurées Schema.org (WebSite, EducationalOrganization, Course, BreadcrumbList) ;
- `robots.txt` ;
- `sitemap.xml` ;
- page `404.html` ;
- guide `GOOGLE-SEARCH-CONSOLE.md`.

Les pages SNT encore « À venir » sont volontairement en `noindex,follow` jusqu'à ce qu'elles contiennent un vrai cours.


## Version 8 — Première STI2D / Innovation Technologique

Ajouts :
- premier cours de Première STI2D en version Web :
  `classes/premiere-ideation-brainstorming.html`
  O5, CO5.1, CO5.5, CO5.6, CO4.1 et CO4.3 ;
- contenus issus du support « Le brainstorming » et de la fiche élève « Idéater et innover » ;
- activités « Mauvaises idées », « Usages alternatifs », « Œuvre inachevée » ;
- mise en situation sur l'impact environnemental des livraisons de moins de 50 km ;
- croquis et canevas d'idée ;
- matrice interactive de choix ;
- canevas de pitch ;
- quiz de 8 questions ;
- documents originaux téléchargeables ;
- référencement SEO et ajout au sitemap.


## Version 9 — Activité 1 Robot aspirateur

Ajouts :
- nouvelle page `classes/premiere-activite-1-robot-aspirateur.html` ;
- rubrique « Ce que je dois retenir » ;
- checklist « À la fin, je dois savoir… » ;
- mini-synthèse et mots-clés ;
- lien vers la fiche élève d'origine ;
- ajout de l'activité sur la page Première STI2D ;
- ajout au sitemap Google.

## Version 18 — Convertisseur SNT Seconde

Ajouts dans « Binaire, bases numériques & débit » :
- convertisseur universel base 2 / base 10 / base 16 ;
- résultats simultanés en décimal, binaire et hexadécimal ;
- explication de la méthode de conversion ;
- exemples rapides ;
- outil bits ↔ octets ;
- accès direct au convertisseur depuis le menu et le bandeau du chapitre.


## Version 22 — Application PWA installable

Le site est maintenant une Progressive Web App (PWA) :
- installation directe sur Android sans Google Play ;
- icône d'application Marie Rivier ;
- ouverture en mode application ;
- cache des ressources essentielles ;
- pages déjà consultées disponibles hors connexion quand elles ont été mises en cache ;
- mise à jour des cours depuis le site quand une connexion est disponible ;
- bouton et instructions d'installation sur la page d'accueil.

Fichiers PWA ajoutés :
- manifest.webmanifest
- service-worker.js
- offline.html
- assets/app-icon-192.png
- assets/app-icon-512.png
- assets/app-icon-maskable-512.png
- assets/apple-touch-icon.png

## Version 23 — Terminale STI2D/SIN : Algorithmique interactive

Ajout du cours `classes/terminale-algorithmique.html` basé sur le support élève 2026–2027 :
- serre connectée interactive (température, humidité, ventilateur, pompe) ;
- animation de la méthode Exigence → Algorithme → Code → Tests ;
- algorigramme animé pour une décision de ventilation ;
- passage piéton séquentiel animé ;
- tri de colis par condition ;
- boucle WHILE simulant une recharge jusqu’à 80 % ;
- boucle FOR et calcul animé d’une moyenne de mesures ;
- comparaison Python / C++ ;
- trois programmes Python dont le comportement est simulé dans le navigateur ;
- débogage interactif et table de traces ;
- quiz de fin de cours ;
- support élève PowerPoint téléchargeable.

Les simulations de code reproduisent la logique des exemples pédagogiques dans JavaScript local :
aucun interpréteur Python externe n’est nécessaire.

## Version 25 — Terminale STI2D / EE

Ajout d'un espace EE parallèle à l'espace SIN :
- cours interactif « Algorithmique appliquée à la gestion de l'énergie » ;
- gestion d'un bâtiment : température, puissance, PAC et batterie ;
- algorigramme animé de délestage au-dessus de 6 kW ;
- démarrage séquentiel d'une pompe à chaleur ;
- orientation de l'énergie photovoltaïque ;
- boucle WHILE sur un stockage thermique ;
- boucle FOR sur une moyenne de puissance ;
- comparaison Python / C++ ;
- programmes simulés dans le navigateur ;
- débogage du chauffage ;
- quiz et support élève PowerPoint ;
- accès EE ajouté depuis la page Terminale STI2D.

## Version 27 — Révisions DST SNT

Ajout d'un espace de révisions pour « Binaire, bases numériques & débit » :
- 18 questions/réponses couvrant les compétences du devoir ;
- valeurs d'entraînement différentes de celles du DST ;
- réponses et méthodes affichables à la demande ;
- boutons « Je maîtrise » / « À revoir » ;
- barre de progression ;
- question aléatoire, priorisant les points à revoir ;
- accès direct depuis le cours Binaire & débit ;
- ajout au cache PWA et au sitemap.
