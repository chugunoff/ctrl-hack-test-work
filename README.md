# CtrlHack Test Work

## Run app

Install deps

```
npm i
```

Remove or comment out a line `base: '/ctrl-hack-test-work/',` in `vite.config.ts`

Replace `history: createWebHistory('/ctrl-hack-test-work/'),` with `history: createWebHistory(),` in `./src/routes/index.ts`

Development mode:

```
npm run dev
```

Production mode:

```
npm run build
npm run preview
```
