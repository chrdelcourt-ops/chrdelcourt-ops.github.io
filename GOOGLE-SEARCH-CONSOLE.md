# Google Search Console — mise en service

Le site est préparé pour l'indexation Google.

## 1. Mettre la V6 en ligne

Déposer tous les fichiers de la V6 dans le dépôt GitHub Pages :
`chrdelcourt-ops.github.io`

Vérifier ensuite :
- https://chrdelcourt-ops.github.io/
- https://chrdelcourt-ops.github.io/robots.txt
- https://chrdelcourt-ops.github.io/sitemap.xml

## 2. Ajouter le site dans Google Search Console

Utiliser une **propriété de type Préfixe d'URL** :
`https://chrdelcourt-ops.github.io/`

Pour ce site GitHub Pages, ne pas utiliser une propriété « Domaine » : elle demanderait le contrôle DNS de `github.io`.

## 3. Vérifier la propriété

Google fournira soit :
- un fichier HTML unique à déposer à la racine du dépôt ; ou
- une balise `<meta name="google-site-verification" ...>` à placer dans `<head>` de `index.html`.

Le jeton est propre au compte Search Console : il ne peut pas être généré à l'avance.

## 4. Envoyer le sitemap

Dans Search Console > Sitemaps, envoyer :
`sitemap.xml`

Adresse complète :
https://chrdelcourt-ops.github.io/sitemap.xml

## 5. Demander l'indexation des pages principales

Dans « Inspection de l'URL », tester puis demander l'indexation de :
- https://chrdelcourt-ops.github.io/
- https://chrdelcourt-ops.github.io/themes/internet.html
- https://chrdelcourt-ops.github.io/themes/web.html
- https://chrdelcourt-ops.github.io/classes/terminale-sti2d.html
- https://chrdelcourt-ops.github.io/classes/terminale-numeration.html

## Pages volontairement en noindex

Les thèmes encore vides / « À venir » sont en `noindex,follow`.
Ils pourront passer en `index,follow` quand leur contenu sera réellement créé.
Cela évite de proposer à Google des pages très pauvres ou temporaires.
