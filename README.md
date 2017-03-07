# Install the `electron` command globally in your $PATH
```
npm install electron -g
```

# Run npm install in the project folder
```
npm install
```

# Run electron --version
```
electron --version
```

# Run npm rebuild base on electron version.Modify target value.
```
npm rebuild --runtime=electron --target=1.2.5 --disturl=https://atom.io/download/atom-shell --build-from-source
```

# After above, run electon in project folder
```
electron .
```