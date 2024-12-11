<div align="center">

![borne_arcade_v1.png](design/borne_arcade_v1.png)

</div> 

# Projet mini jeux NSI
NSI 1ère Projet Mini Jeux

## Liens utiles
- Gestion des tâches : [projet Github](https://github.com/users/camarm-dev/projects/6)

## Crédits

Ce projet est disponible sous la licence [CeCILL-2.1](./LICENSE).

## Direction artistique / graphisme

- Style 8-bit / police pixelisée (type minecraft)
- Cartouches de jeux
- Les jeux tournent dans une borne d'arcade

## Documentation

- Installer les dépendances python
```shell
pip install -r requirements.txt
```
- Lancer le serveur
```shell
python3 main.py
```

## Base de données

La base de données est située à la racine; `database.db`. C'est une base Sqlite3.

Ci-dessous la définition des tables:

| Nom de la table | Description |
| --- | --- |
| users | Stockages des profils utilisateurs |
| scores | Stockages des résultats des parties |

**Table `users`**
| Nom de la colonne (propriété) | Description |
| --- | --- |
| name | Nom complet de l'utilisateur |
| pseudo | Pseudo de l'utilisateur |
| email | Email de l'utilisateur |
| password | Mot de passe hashé de l'utilisateur |
| created_at | Date de création de l'utilisateur |


**Table `scores`**
| Nom de la colonne (propriété) | Description |
| --- | --- |
| game | Nom du jeu parmis `morpion`, `pfc`, `osu`, `dino`, `justeprix`. |
| date | Date d'enregistrement de la partie |
| user | Pseudo de l'utilisateur |
| points | Nombres de points gagnés |

## Sound effect
https://pixabay.com/sound-effects/success-02-68338/
https://pixabay.com/sound-effects/arcade-countdown-7007/
