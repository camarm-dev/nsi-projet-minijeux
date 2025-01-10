# Journal de bord

Rétrospective de l'avancée du projet chaque jour.

## Mercredi 27 Novembre

**Réunion du jour :**

Nous avons commencé par faire connaissance, puis nous avons discuté de ce que nous imaginions pour le projet.

Nous avons défini les rôles, l'organisation du projet, sa DA...

**Tâches effectuées ce jour**

- Création du dépôt Github

![Capture d'écran du dépot Github](.github/images/repo.png)

- Définition de notre direction artistique
  - 8-bit
  - arcade
  - rétro
- Création des fichiers HTML de base

> Grands objectifs associés : "Direction artistique "8-bit""

## À la maison (27 Novembre - 2 Décembre)

**Tâches effectuées**

- Initialisation de la structure et des fichiers css

| Structure                                | Fichiers css                                |
|------------------------------------------|---------------------------------------------|
| ![img.png](.github/images/structure.png) | ![img.png](.github/images/fichiers_css.png) | 

- Début d'une sélection de jeux

![img.png](.github/images/selection_jeux.png)

- Création d'un écran de chargement

![img.png](.github/images/loader.png)

- Développement du Morpion

![Morpion](.github/images/morpion.png)

## Lundi 2 Décembre

- Paramétrage d'outils pour la gestion des tâches
![Capture d'écran du projet Github](.github/images/project.png)
- Rédaction Cahier des Charges
- Finalisation Morpion
- Design: cartouche morpion, PFC & borne arcade
![icone morpion](static/img/morpion.png)

## Mercredi 4 Décembre
- Amélioration du morpion : ajout d'un mode de jeux contre ordinateur
![img.png](.github/images/morpion_avancement.png)
- Styles des boutons
![Boutons](.github/images/bouton.png)
- Ajout d'une page de crédits
![crédits](.github/images/credits.png)

## À la maison (4 Décembre - 8 Décembre)
- Commencement du jeu du dino
![dino.png](.github/images/dino.png)
- Création des pages de connexion / création de compte

| Création de compte                       | Connexion                            |
|------------------------------------------|--------------------------------------|
| ![img.png](.github/images/createAcc.png) | ![img.png](.github/images/login.png) |

- Commencement du jeu du juste prix

![img.png](.github/images/justeprix.png)

- Restylisation de la page d'accueil

![img.png](.github/images/homepage.png)

- Configuration d'un rétroplanning

![retroplanning.png](.github/images/retroplanning.png)

> Grands objectifs associés : "Page d'accueil avec sélection du jeu" & "Comptes (connexion)"

## Lundi 8 décembre

- Commencement de la migration vers Flask
- Continuation OSU! & dino
- Nouvelles images pour PFC

> Grands objectifs associés : "Site dynamique avec Flask"

## Mercredi 11 décembre 
- Images dino
- Continuation OSU!
- Continuation dino

## À la maison (11 décembre - 16 Décembre)

- Explications dans le README pour la sécurité des comptes
- Migration des ressources pour flask

![img.png](.github/images/structure_flask.png)

- Commencement de l'authentification: hashage de mots de passe & récupération des données du formulaire en python

| Hashage des mots de passes             | Code python de la création de compte |
|----------------------------------------|--------------------------------------|
| ![img.png](.github/images/hashing.png) |                                      |

- Mise en place de la base de données
```sql
CREATE TABLE IF NOT EXISTS users (pseudo TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, created_at TIME NOT NULL)
CREATE TABLE IF NOT EXISTS scores (game TEXT NOT NULL, user TEXT NOT NULL, points INT NOT NULL, date TIME NOT NULL)
```
_Schéma de la BDD_

- Mise en place d'une page de profil

![img.png](.github/images/profile.png)

> Grands objectifs associés : "Site dynamique avec Flask" & "Comptes (gestion d'une base d'utilisateurs)"

## Lundi 16 décembre

- V1 mise en ligne
- Création de compte et connexion fonctionnelle
- Avancement OSU
- Création cartouche OSU!

![osu](static/img/osu.png)

## Mercredi 18 Décembre

- Continuation OSU!
- Création cartouche dino et juste prix

![osu](static/img/dino.png)


![osu](static/img/justeprix.png)

- Début de mise en place de l'acquisition des scores
- Mise en place d'un anticheat

![img.png](.github/images/img.png)

## À la maison (18 décembre - 6 Janvier)

**Tâches effectuées**

- Mise en place du classement

![img_1.png](.github/images/img_1.png)


> Pour cette partie, nous avons rencontré un problème : Comment obtenir un classement de chaque joueur, alors que l'on ne dispose que de leurs parties individuelles.
> Réponse très intéressante : découverte des jointures de table
```sql
SELECT u.pseudo, u.name, SUM(s.points) AS score, RANK() OVER (ORDER BY SUM(s.points) DESC) AS rank
FROM users u
JOIN scores s ON u.pseudo = s.user
GROUP BY u.pseudo, u.name
ORDER BY rank
```
> On récupère chaque pseudo et nom d'utilisateur dans la table `users`, on joint la table `scores` à `users` par la colonne `user` = `pseudo`, on calcule la somme des points, et on crée un "RANK" sur la somme des points pour obtenir un classement. 
- Résolutions de bugs (erreur à la connexion si l'utilisateur n'existait pas)
- Ajout d'une page d'erreur

![img.png](.github/images/img_3.png)


- Mise en place d'une personnalisation du profil

![img_2.png](.github/images/img_2.png)

- Ajout cooldown pour éviter les requêtes bloquées par l'anticheat

![img.png](.github/images/img_4.png)


- Responsive du site (pour qu'il soit au moins fonctionnel sur mobile)

> Grands objectifs associés : "Page de classement"


## Lundi 6 Janvier

**Réunion du jour :**

Julien absent; il était responsable du développement du OSU!.
Nous avons donc pris la décision d'utiliser une version fonctionnelle suffisante de OSU! pour pouvoir rendre le site dans les temps.

Prévision du planning jusqu'au lundi 13 janvier : définition des tâches importantes pour rendre le site.
Notamment à propos de la sécurité des mots de passes

**Tâches effectuées ce jour**

- Commencement d'un plan pour l'oral
- Trouver un diaporama dans le style 8-bit / retro du site 


## Mercredi 8 Janvier

**Réunion du jour :**

Julien encore absent. On a donc vérifié que le OSU fonctionnait et des bugs ont été trouvés : les balles à cliquer peuvent apparaître trop haut.

Point sur le planning prévisionnel : catégorisation plus précise des tâches, et définition de tâches à réaliser le weekend.

**Tâches effectuées ce jour**

- Mise en place d'un minimum de caractère et de normes de sécurité sur les mots de passes
- Ajout des différents niveaux du OSU!
- Continuation de l'oral : rédaction de textes 

## À la maison (8 - 13 Janvier)

**Tâches effectuées**
- Rafraichissement du journal de bord
- Continuation et finalisation de l'oral (principalement des textes)
- Renseignement sur la conformité RGPD du site

## Lundi 13 Janvier

**Réunion du jour :**


**Tâches effectuées ce jour**

- Finalisation de l'oral
