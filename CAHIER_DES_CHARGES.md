# Cahier des charges

Projet minijeux 1ère NSI.


Répartition des rôles

| Personne | Rôle |
| --- | --- |
| Gaspard | Designer & Co-directeur |
| Julien | Développeur & Co-directeur |
| Armand | Coordination, dévelopement & Co-directeur |

## Objectifs

- Direction artistique "8-bit"
- Page d'accueil
- 5 jeux: Osu, Pierre Feuille Ciseaux, Morpion, Jeu du Dino, Juste prix
- Comptes
- Page de classement

## Description du projet

Site Web avec HTML, CSS et Javascript pour le frontend. Backend avec Python, et le framework [Flask](https://flask.palletsprojects.com/en/stable/).

### Tableau des fonctionalités

| Nom | Description | Périmètre | Type | Technologies |
| --- | --- | --- | --- | --- |
| Accueil | Page d'accueil avec affichage des jeux en grille, sous forme de cartouche | Frontend | Page | HTML, CSS |
| Loader | Écran de chargement | Frontend | Animation | Javscript, CSS, HTML |
| Borne d'arcade | Affichage des jeux dans une borne d'arcade | Frontend | Mise en page | CSS |
| Morpion | Jeu du morpion, à jouer à deux ou contre l'ordinateur. | Frontend | Page Jeu | HTML, CSS, Javascript |
| Dino | Jeu du dino, à jouer tout seul | Frontend | Page Jeu | HTML, CSS, Javascript |
| Juste prix | Jeu du juste prix, à jouer tout seul | Frontend | Page Jeu | HTML, CSS, Javascript |
| OSU | OSU, jeu en rythme à jouer seul | Frontend | Page Jeu | HTML, CSS, Javascript |
| PFC | Jeu de pierre, feuille, ciseaux à jouer seul contre ordinateur. | Frontend | Page Jeu | HTML, CSS, Javascript |
| Page de connexion | Page de connexion avec formulaire et champs, pseudo, mot de passe | Frontend | Page | HTML, CSS |
| Page de création de compte | Page de création de compte avec formulaire et champs, pseudo, mot de passe, couleur, email | Frontend | Page | HTML, CSS |
| Page de modification de compte | Page de modification de compte avec formulaire et champs, pseudo, couleur. Pouvoir supprimer son compte. | Frontend | Page | HTML, CSS |
| Gestion des utilisateurs | Gestion des utilisateurs avec création, modification & suppression de compte. Requêtes POST. Stockage dans une base Sqlite. Stockage du jeton de connexion dans un cookie. | Backend | Fonctionalité | Python, Sqlite |
| Sécurisation des comptes | Sécurisation des comptes avec hashage des mots de passe et règles: minimum de 10 caractère avec 1 caractère spécial. | Backend | Sécurité | Python, Regex |
| Système de classement | Classement des joueurs en fonction de leurs points. | Backend | Fonctionalité | Python |
| Page de classement | Affichage du classement des joueurs. Bonus: classement par jeu + statistiques. | Frontend | Page | HTML, CSS |
| Acquisition des parties gagnées | Bouton "Envoyer ma progression" sur les pages pour envoyer les points gagnés. | Frontend | Page | HTML, CSS |
| Acquisition des parties gagnées | Sauvegarder les parties gagnées dans une table. Préciser sur quel jeux les parties ont été gagnées. | Backend | Fonctionalité | Python, Sqlite |


## Exigences fonctionnelles

- Connexion / création comptes
- Personnalisation interface (couleur)
- Pouvoir jouer aux 5 jeux
- Page d'accueil
- (Bonus) Système de classement

## Livrables attendus

- Fichiers du site HTML, CSS, Javascript & Images
- Serveur web et gestion des utilisateurs: main.py
- Base Sqlite: database.db
- Design: dossier design
- Dépôt Git
- Une démonstration du site web ouverte sur internet

## Planning

| Semaine | Attendus | Date limite |
| --- | --- | --- |
| 1 | Page d'accueil, Cahier des charges, Direction Artistique, écran de chargement | 8 Décembre |
| 2 | Dévelopement OSU + Intégration des jeux | 15 Décembre |
| 3 | Backend: Serveur web + gestion utilisateurs | 22 Décembre |
| 4 | Système de classement | 29 Décembre |

## Modalités de suivi

- Journal des modifications: [JOURNAL.md](https://github.com/camarm-dev/nsi-projet-minijeux/blob/main/JOURNAL.md)
- Suivi des tâches: [Projet Github](https://github.com/users/camarm-dev/projects/6/views/2)
- VSC: Git hébergé sur Github: [historique des commits](https://github.com/camarm-dev/nsi-projet-minijeux/commits/main/)
