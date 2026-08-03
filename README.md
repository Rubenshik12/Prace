# Моя робота v16.5 Shell Padding Fix

- знайдено старий padding-bottom: 118 px на .shell;
- він створював смугу над нижньою навігацією;
- padding .shell повністю скинуто до 0;
- gap між shell і bottomNav також примусово 0;
- safe area знизу не змінювався.
