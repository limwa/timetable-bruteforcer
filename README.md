# Timetable Bruteforcer

This tool automatically fetches timetables from SIGARRA and builds schedules that fulfill your requirements.

## How to use

This was built using **Deno**. 

To execute the tool, you need to:

1. Create a .env file with SI_USERNAME and SI_PASSWORD, with your SIGARRA username and password, respectively.
2. Change the config/mod.ts according to your preferences.
3. Execute the following command:

```bash
deno run --unstable src/main.ts
```

## With Docker

If you don't want to install Deno directly on your PC, you can use the Dockerfile to build an image of this project.

```bash
docker build -t timetable-bruteforcer .
docker run -it \
  -v $PWD/config:/usr/app/config \
  -v $PWD/output:/usr/app/output \
  -v $PWD/.env:/usr/app/.env \
  timetable-bruteforcer
```
