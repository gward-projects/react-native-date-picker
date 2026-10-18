# Journal des mises à jour de dépendances

**Nature :** historique vivant des revues de versions · **Dernière mise à jour :** 17 octobre 2026.

Ce fichier suit les mêmes règles que le journal des dépendances de gward-app, dont il reprend le
format.

## Règles de tenue

Pour chaque mise à jour qui justifie une revue fonctionnelle ou technique, ajouter une entrée datée
indiquant :

- les packages et le passage de versions concerné ;
- les changements de comportement ou nouvelles API réellement examinés ;
- les évolutions adoptées dans le code ;
- les évolutions non adoptées, avec une raison concrète ;
- les vérifications exécutées et leurs limites, notamment l'absence de test interactif, natif ou
  dans le navigateur.

Chaque correctif annoncé comme un apport doit être rattaché à la version exacte qui le porte, en
comparant les archives npm et les commits amont (voir la procédure de
montée des dépendances de gward-app). Une simple montée
sans différence à analyser ne nécessite pas d'entrée.

## 17 octobre 2026 — React Native 0.88, React 19.3, TypeScript 6, passage en TypeScript et alignement sur gward-app

| Package | Départ | Arrivée |
| ------- | ------ | ------- |
| Yarn (`packageManager`) | 4.13.0 | 4.18.1 |
| `react` | 19.2.3 | 19.3.0 |
| `react-native` | 0.84.1 | 0.88.0 |
| `@types/react` | 19.2.14 | 19.3.0 |
| `typescript` | 5.9.3 | 6.0.3 |
| `@react-native/eslint-config` | 0.84.1 | retiré (jamais utilisé : `eslint` absent) |
| `jest`, `babel-jest`, `@types/jest` | 30.3.0, 30.3.0, 30.0.0 | retirés (`node:test`) |
| `@babel/core`, `@babel/preset-env` | 7.29.0 | retirés |

### Changements de code

- React Native 0.88 ne publie plus de types pour les imports profonds
  (`react-native/Libraries/...`) : les spécifications codegen de `src/fabric/` importent
  `CodegenTypes`, `TurboModule` et `codegenNativeComponent` depuis `react-native`. La codegen de
  RN 0.88 lit la forme qualifiée (`CodegenTypes.Double`).
- `Appearance.getColorScheme()` peut renvoyer `'unspecified'` : `getTheme` le traduit en
  `undefined` (thème automatique) au lieu de transmettre une valeur inconnue au natif.
- `src/` passe entièrement en TypeScript (`index.d.ts` → `src/types.ts`). Effets du typage strict :
  sans module natif et avec `global.ignoreDatePickerWarning`, ouvrir ou fermer la modale ne fait
  plus rien au lieu de planter ; `onConfirm` n'est plus appelé sans date ; une plateforme non prise
  en charge reçoit un message clair ; `propChecker` contrôle aussi les styles en tableau
  (`StyleSheet.flatten`).
- Les tests Jest échouaient déjà avant la montée (`@react-native/babel-preset` manquant) ; ils sont
  passés en `node:test` (`tests/src/colorToHex.test.ts`).
- Compatibilité avec gward-app, en React Native 0.86 : ses types par défaut sont les anciens, où
  `NativeEventEmitter` n'est pas générique et refuse `null`. Les écouteurs d'événements natifs
  (`DatePickerAndroid.tsx`, `modal.ts`) convertissent donc leur paramètre et passent
  `NativeModule ?? undefined`. `tsc` de gward-app passe avec ce code.

### Alignement sur gward-app

- tsconfig strict commun aux trois forks (`moduleResolution: "bundler"`,
  `customConditions: ["react-native"]`, options strictes de gward-app plus
  `noUncheckedIndexedAccess`, `noImplicitReturns`, `allowUnreachableCode: false`) ;
- ESLint 9.39.5 + `eslint-config-expo` 58.0.4 en configuration TypeScript (`jiti` 2.7.0), avec
  `import/order` et la règle `sort-imports-by-first-name` copiée de gward-app ;
- tests `node:test` + `tsx` 4.23.15 dans `tests/`, `@types/node` 24.19.2 ;
- `yarn check` et pre-commit Husky 9.1.7, installé par `yarn setup-hooks` (pas de `prepare`) ;
- `.yarnrc.yml` réduit à `nodeLinker: node-modules` : les lignes ajoutées par `yarn set version`
  (`enableScripts`, `npmMinimalAgeGate: 0`, `approvedGitRepositories`) désactivaient les nouvelles
  protections de Yarn sans besoin pour le fork.

### Évolutions non adoptées

- **TypeScript 7** : Expo 58 et React Native 0.88 ne le prennent pas encore en charge ; les forks
  restent en 6.0.3, comme gward-app.
- **Babel 8** : n'est plus utilisé par les forks (aucune transformation Babel).
- **ESLint 10** : `eslint-plugin-import`, utilisé par `eslint-config-expo`, ne le prend pas encore
  en charge ; ESLint reste en 9.39.5, comme gward-app.

### Vérifications et limites

- `yarn check` : lint, typecheck et 26 tests passent.
- **Non fait** : comparaison des archives npm et des commits amont entre versions de départ et
  d'arrivée. Les versions n'interviennent qu'en développement (les `peerDependencies` restent à
  `*`) ; seules les erreurs de compilation et de lint ont été analysées.
- Codegen : le schéma généré à partir de `src/fabric/` est identique avant et après, avec la codegen
  de React Native 0.86 (gward-app) comme avec celle de 0.88 ; les copies `.js` supprimées n'y
  contribuaient pas. `android/` et `ios/` sont inchangés : pas de nouveau build natif nécessaire.
- Testé dans gward-app par le propriétaire sur Android et iOS (les deux sélecteurs en modale de
  l'app : confirmation, annulation, bornes, langue, textes, thèmes clair et sombre, ouvertures
  répétées), sur le build natif existant.
- Build iOS avec React Native 0.88 (première tentative du propriétaire, 18 octobre 2026) : échec de
  compilation, `'RCTConvert.h' file not found` dans `RNDatePickerManager.mm`. Les en-têtes React
  importés entre guillemets (`RCTConvert.h`, `RCTUtils.h`, `UIView+React.h`, `RCTComponent.h`,
  `RCTView.h`, `RCTFabricComponentsPlugins.h`) ne se trouvent plus qu'à leur chemin de module avec
  les modules précompilés d'Expo 58 : ils passent en `<React/…>` (5.1.1), forme qui fonctionne aussi
  avec React Native 0.86. L'amont a les mêmes imports. Le podspec appelle désormais
  `install_modules_dependencies` sans condition.
- Build Android avec le plugin Android 9 (même jour) : échec à l'évaluation du projet, qui
  déclarait pour sa release `getDefaultProguardFile('proguard-android.txt')`, refusé par AGP 9
  (`-dontoptimize`). La ligne ne servait pas : la bibliothèque n'est pas minifiée (`minifyEnabled
  false`) et le `proguard-rules.pro` référencé n'existe pas. Elle est retirée (5.1.2). Aucune autre
  bibliothèque native de gward-app n'utilise encore `proguard-android.txt`.
- **Non fait** : builds natifs avec React Native 0.88 après ces correctifs (à refaire par le
  propriétaire) ;
  mode en ligne (non utilisé par gward-app).
