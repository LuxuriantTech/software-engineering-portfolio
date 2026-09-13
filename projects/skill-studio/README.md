# Skill Studio

Skill Studio est un atelier pour rédiger, modifier et comparer des instructions destinées à des modèles d’IA.

Le projet est en cours de développement. L’atelier privé permet de conserver plusieurs versions, de comparer les réponses obtenues avec et sans instructions supplémentaires, et d’exporter ou réimporter les instructions sous forme de paquet ZIP. La génération automatique reste expérimentale et peut être refusée par les contrôles du paquet.

Les essais réalisés jusqu’ici ne montrent pas d’amélioration systématique par rapport à une utilisation sans instructions supplémentaires. Les [résultats publiés et leurs limites](../../site/public/projects/skill-studio/evaluation.html), y compris les échecs, sont conservés.

La démo publique présente une partie des fonctionnalités. L’exécution du modèle reste dans l’atelier privé.

## Ce que contient ce dépôt public

Les [sources de la démonstration](../../site/public/projects/skill-studio/) sont des fichiers HTML, CSS et JavaScript. La démo permet de modifier une instruction préparée, de voir le diff du texte, de réinitialiser l’exemple et d’exporter le Markdown. Elle affiche des résultats préparés ou enregistrés sur des données explicitement synthétiques.

La démo ne génère pas de nouvelles réponses et ne sauvegarde aucune version ; un rechargement réinitialise l’exemple. Après modification de l’instruction, l’illustration de réponse est masquée parce qu’elle ne correspond plus au texte. L’exemple de comparaison enregistré ne se recalcule pas.

Le serveur, les modèles, les données et l’historique de l’atelier privé ne sont pas inclus. Les fonctionnalités de l’atelier privé décrivent le projet ; elles ne sont pas exécutables depuis cette édition publique.

## Vérifier la démo

Depuis le dossier `site`, exécuter `npm ci --ignore-scripts`, puis `npm run check`. `npm run dev` permet de consulter la route `/projects/skill-studio/` dans le site local.

Le [guide](../../site/public/projects/skill-studio/guide.html) distingue le parcours public du parcours privé. Les exemples synthétiques et les résultats historiques ne constituent pas une preuve d’usage réel ni de bénéfice général.

L’assistance IA a contribué au code, aux tests et à la documentation. Aucun entraînement personnalisé des modèles n’est revendiqué.
