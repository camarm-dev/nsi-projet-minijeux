# Cahier des charges

Ce cahier des charges décrit le fonctionnement du projet ainsi que les fonctionnalités attendues de ce projet.


### Répartition des rôles

| Personne | Rôle                                       |
|----------|--------------------------------------------|
| Gaspard  | Designer & Co-directeur                    |
| Julien   | Développeur & Co-directeur                 |
| Armand   | Coordination, développement & Co-directeur |

## Objectifs

Voici une liste non exhaustive des objectifs de ce projet, dressée au début de celui-ci :
- Direction artistique "8-bit"
- Page d'accueil avec sélection du jeu
- 5 jeux: Osu, Pierre Feuille Ciseaux, Morpion, Jeu du Dino, Juste prix
- Comptes (gestion d'une base d'utilisateurs)
- Page de classement

## Description du projet

Site Web avec HTML, CSS et Javascript pour le frontend. Backend avec Python, et le framework [Flask](https://flask.palletsprojects.com/en/stable/).

### Tableau des fonctionnalités

| Nom                                     | Description                                                                                                                                                                | Périmètre | Type           | Technologies          |
|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|----------------|-----------------------|
| Accueil                                 | Page d'accueil avec affichage des jeux en grille, sous forme de cartouche                                                                                                  | Frontend  | Page           | HTML, CSS             |
| Loader                                  | Écran de chargement                                                                                                                                                        | Frontend  | Animation      | Javascript, CSS, HTML |
| Borne d'arcade                          | Affichage des jeux dans une borne d'arcade                                                                                                                                 | Frontend  | Mise en page   | CSS                   |
| Morpion                                 | Jeu du morpion, à jouer à deux ou contre l'ordinateur.                                                                                                                     | Frontend  | Page Jeu       | HTML, CSS, Javascript |
| Dino                                    | Jeu du dino, à jouer tout seul                                                                                                                                             | Frontend  | Page Jeu       | HTML, CSS, Javascript |
| Juste prix                              | Jeu du juste prix, à jouer tout seul                                                                                                                                       | Frontend  | Page Jeu       | HTML, CSS, Javascript |
| OSU                                     | OSU, jeu en rythme à jouer seul                                                                                                                                            | Frontend  | Page Jeu       | HTML, CSS, Javascript |
| PFC                                     | Jeu de pierre, feuille, ciseaux à jouer seul contre ordinateur.                                                                                                            | Frontend  | Page Jeu       | HTML, CSS, Javascript |
| Page de connexion                       | Page de connexion avec formulaire et champs, email, mot de passe                                                                                                           | Frontend  | Page           | HTML, CSS             |
| Page de création de compte              | Page de création de compte avec formulaire et champs, pseudo, mot de passe, email                                                                                          | Frontend  | Page           | HTML, CSS             |
| Page de modification de compte          | Page de modification de compte avec formulaire et champs, pseudo. Pouvoir supprimer son compte.                                                                            | Frontend  | Page           | HTML, CSS             |
| Gestion des utilisateurs                | Gestion des utilisateurs avec création, modification & suppression de compte. Requêtes POST. Stockage dans une base Sqlite. Stockage du jeton de connexion dans un cookie. | Backend   | Fonctionnalité | Python, Sqlite        |
| Sécurisation des comptes                | Sécurisation des comptes avec hashage des mots de passe et règles: minimum de 10 caractère avec 1 caractère spécial.                                                       | Backend   | Sécurité       | Python, Regex         |
| Sécurisation des comptes connectés      | Assurer la sécurité d'une connexion avec un jeton JWT.                                                                                                                     | Backend   | Sécurité       | Python                |
| (Bonus) Système de classement           | Classement des joueurs en fonction de leurs points.                                                                                                                        | Backend   | Fonctionnalité | Python                |
| (Bonus) Page de classement              | Affichage du classement des joueurs. Bonus: classement par jeu + statistiques.                                                                                             | Frontend  | Page           | HTML, CSS             |
| (Bonus) Acquisition des parties gagnées | Bouton "Envoyer ma progression" sur les pages pour envoyer les points gagnés.                                                                                              | Frontend  | Page           | HTML, CSS             |
| (Bonus) Acquisition des parties gagnées | Sauvegarder les parties gagnées dans une table. Préciser sur quel jeux les parties ont été gagnées.                                                                        | Backend   | Fonctionnalité | Python, Sqlite        |


## Exigences fonctionnelles

Les exigences fonctionnelles sont les descriptions détaillées du comportement attendu des fonctionnalités

| Fonctionnalité                          | Exigences                                                                                                                                  |
|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Accueil                                 | Affichage des jeux en grille, avec écran de chargement au clique.                                                                          |
| Loader                                  | Écran de chargement pour avoir des transition fluides entre les pages.                                                                     |
| Borne d'arcade                          | Affichage de certains jeux dans une borne d'arcade. Doit fonctionner sur n'importe quel écran d'ordinateur.                                |
| Morpion                                 | Pouvoir jouer seul ou contre l'ordinateur.                                                                                                 |
| Dino                                    | Comptage du score et fluidité de jeu.                                                                                                      |
| Juste prix                              | Affichage dans un style "terminal".                                                                                                        |
| OSU                                     | Animations pour guider l'utilisateur sur le prochain clique. Le point doit se déplacer aléatoirement.                                      |
| PFC                                     | Pierre feuille ciseaux contre ordinateur. Doit inclure des animations.                                                                     |
| Page de connexion                       | Le pseudo ne doit pas contenir de majuscules et caractères spéciaux...                                                                     |
| Page de création de compte              | Le pseudo ne doit pas contenir de majuscules et caractères spéciaux...                                                                     |
| Page de modification de compte          | Suppression du compte et mise à jour des informations.                                                                                     |
| Gestion des utilisateurs                | Création, modification, suppression de documents.                                                                                          |
| Sécurisation des comptes                | Le mot de passe doit faire minimum de 10 caractère avec 1 caractère spécial. Utiliser le système de hashage sécurisé PBKDF2 avec SHA-512 ? |
| Sécurisation des comptes connectés      | Les comptes connectés disposent d'un jeton JWT pour faire autorité. Ce jeton doit expirer au bout d'un mois.                               |
| (Bonus) Système de classement           | Classer les joueurs sur un classement global, et par jeux.                                                                                 |
| (Bonus) Page de classement              | Affichage du classement des joueurs dans une table.                                                                                        |
| (Bonus) Acquisition des parties gagnées | Essayer de mettre des filtres "anti-triche": un temps minimal est requis pour faire une partie par exemple...                              |
| (Bonus) Acquisition des parties gagnées | Préciser sur quel jeux les parties ont été gagnées.                                                                                        |

## Livrables attendus

- Fichiers du site HTML, CSS, Javascript & Images
- Serveur web et gestion des utilisateurs : main.py (et fichiers python annexes...)
- Base Sqlite : database.db
- Design: dossier design
- Dépôt Git
- Une démonstration du site web fonctionnelle ouverte sur internet

## Planning

| Semaine | Attendus                                                                      | Date limite |
|---------|-------------------------------------------------------------------------------|-------------|
| 1       | Page d'accueil, Cahier des charges, Direction Artistique, écran de chargement | 8 Décembre  |
| 2       | Dévelopement OSU + Intégration des jeux                                       | 15 Décembre |
| 3       | Backend: Serveur web + gestion utilisateurs                                   | 22 Décembre |
| 4       | Système de classement                                                         | 29 Décembre |

## Modalités de suivi

- Journal des modifications: [JOURNAL.md](https://github.com/camarm-dev/nsi-projet-minijeux/blob/main/JOURNAL.md)
- Suivi des tâches: [Projet Github](https://github.com/users/camarm-dev/projects/6/views/2)
- VSC: Git hébergé sur Github: [historique des commits](https://github.com/camarm-dev/nsi-projet-minijeux/commits/main/)
